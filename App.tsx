import React, { useState, useEffect } from 'react';
import { AppState, Recipe, UserPreferences, Language, TRANSLATIONS } from './types';
import { Logo } from './components/Logo';
import { PreferenceForm } from './components/PreferenceForm';
import { RecipeDetail } from './components/RecipeDetail';
import { InstallGuide } from './components/InstallGuide';
import { generateRecipes, generateRecipeImage } from './services/gemini';
import { Loader2, ArrowRight, UtensilsCrossed, Moon, Sun, Star, Heart, Menu, Clock, Smartphone } from 'lucide-react';

// Helper for safe storage access
const getStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn('LocalStorage access failed', e);
    return fallback;
  }
};

const setStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage write failed', e);
  }
};

const App = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [userName, setUserName] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeImages, setRecipeImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Settings State
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  // Initialize
  useEffect(() => {
    // Load persisted settings
    const storedFavorites = getStorage<Recipe[]>('favorites', []);
    setFavorites(storedFavorites);
    
    // Check language
    try {
      const storedLang = localStorage.getItem('language');
      if (storedLang) setLanguage(storedLang as Language);
    } catch(e) {}

    // Check theme
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }
    } catch(e) {}

    if (appState === AppState.INTRO) {
      const timer = setTimeout(() => {
        setAppState(AppState.NAME_INPUT);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  // Toggle Theme
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch(e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch(e) {}
    }
  };

  // Toggle Language
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
    try { localStorage.setItem('language', newLang); } catch(e) {}
  };

  // Toggle Favorite
  const toggleFavorite = (recipe: Recipe) => {
    let newFavorites;
    if (favorites.some(f => f.id === recipe.id)) {
      newFavorites = favorites.filter(f => f.id !== recipe.id);
    } else {
      newFavorites = [...favorites, recipe];
    }
    setFavorites(newFavorites);
    setStorage('favorites', newFavorites);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setAppState(AppState.PREFERENCES);
    }
  };

  const handleFormSubmit = async (prefs: UserPreferences) => {
    setAppState(AppState.GENERATING);
    setLoading(true);
    setError('');

    try {
      const generatedRecipes = await generateRecipes(prefs);
      if (generatedRecipes.length === 0) {
        throw new Error("No recipes generated. Please try different ingredients.");
      }
      setRecipes(generatedRecipes);
      setAppState(AppState.RESULTS);
      
      // Lazy load images
      generatedRecipes.forEach(async (recipe) => {
        const imageUrl = await generateRecipeImage(recipe.imagePrompt);
        if (imageUrl) {
          setRecipeImages(prev => ({ ...prev, [recipe.id]: imageUrl }));
        }
      });
      
    } catch (err: any) {
      console.error(err);
      // Show specific error if it's about the API key, otherwise generic
      const msg = err.message && (err.message.includes("API Key") || err.message.includes("Netlify")) 
        ? err.message 
        : "We couldn't generate recipes at this moment. Please check your connection or try again.";
      setError(msg);
      setAppState(AppState.PREFERENCES);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center px-4 py-4 w-full max-w-6xl mx-auto absolute top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-2">
         {appState !== AppState.INTRO && <Logo className="w-8 h-8" />}
      </div>
      <div className="flex gap-2 md:gap-3">
        {/* Install Button */}
        {appState !== AppState.INTRO && (
           <button onClick={() => setShowInstallGuide(true)} className="p-2 rounded-full bg-white/50 dark:bg-n-dark-base/50 backdrop-blur hover:bg-white transition-colors text-n-dark dark:text-n-cream">
              <Smartphone size={20} />
           </button>
        )}
        
        {appState !== AppState.NAME_INPUT && appState !== AppState.INTRO && (
           <button onClick={() => setAppState(AppState.FAVORITES)} className="p-2 rounded-full bg-white/50 dark:bg-n-dark-base/50 backdrop-blur hover:bg-white transition-colors">
              <Heart size={20} className={favorites.length > 0 ? "text-n-orange fill-current" : "text-n-dark dark:text-n-cream"} />
           </button>
        )}
        <button onClick={toggleLanguage} className="px-3 py-1 rounded-full bg-white/50 dark:bg-n-dark-base/50 backdrop-blur font-bold text-xs uppercase text-n-dark dark:text-n-cream hover:bg-white transition-colors">
          {language}
        </button>
        <button onClick={toggleTheme} className="p-2 rounded-full bg-white/50 dark:bg-n-dark-base/50 backdrop-blur hover:bg-white transition-colors text-n-dark dark:text-n-cream">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );

  const renderIntro = () => (
    <div className="h-screen flex flex-col items-center justify-center bg-n-base dark:bg-n-dark-base">
      <Logo animate={true} className="w-40 h-40" />
      {/* Use standard tailwind class from config instead of arbitrary value to avoid parser issues */}
      <h1 className="mt-8 text-4xl font-serif font-bold text-n-dark dark:text-n-cream opacity-0 animate-delayed-fade">
        Nourish
      </h1>
    </div>
  );

  const renderNameInput = () => (
    <div className="h-screen flex flex-col items-center justify-center px-6 animate-fade-in">
      <Logo className="w-16 h-16 mb-8" />
      <h2 className="text-3xl font-serif text-n-dark dark:text-n-cream mb-8 text-center">{TRANSLATIONS[language].whoCooking}</h2>
      <form onSubmit={handleNameSubmit} className="w-full max-w-sm relative">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder={TRANSLATIONS[language].enterName}
          className="w-full bg-transparent border-b-2 border-n-olive/30 dark:border-n-sage/30 py-4 text-2xl text-center text-n-dark dark:text-n-cream placeholder-n-olive/30 dark:placeholder-n-sage/30 focus:outline-none focus:border-n-orange transition-colors"
          autoFocus
        />
        <button 
          type="submit"
          disabled={!userName.trim()}
          className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
            userName.trim() ? 'text-n-orange opacity-100 hover:bg-n-orange/10' : 'text-n-olive opacity-0'
          }`}
        >
          <ArrowRight size={32} />
        </button>
      </form>
    </div>
  );

  const renderLoading = () => (
    <div className="h-screen flex flex-col items-center justify-center px-6 text-center animate-fade-in relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <UtensilsCrossed className="absolute top-1/4 left-1/4 text-n-olive animate-bounce-slow" size={48} />
        <Loader2 className="absolute bottom-1/4 right-1/4 text-n-orange animate-spin" size={64} />
      </div>

      <div className="relative">
         {/* Animated Pan Flip */}
        <div className="w-32 h-32 mb-8 relative">
           <div className="absolute inset-0 bg-n-cream dark:bg-n-dark-card rounded-full animate-pulse-slow"></div>
           <div className="absolute inset-2 border-4 border-n-orange rounded-full animate-spin border-t-transparent"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-4xl animate-bounce">🍳</span>
           </div>
        </div>
      </div>
      <h3 className="text-2xl font-serif font-bold text-n-dark dark:text-n-cream mb-2 animate-pulse">{TRANSLATIONS[language].generating}</h3>
      <p className="text-n-olive dark:text-n-sage">{TRANSLATIONS[language].generatingSub}</p>
    </div>
  );

  const renderRecipeList = (list: Recipe[], title: string, subtitle: string, showModify: boolean) => (
    <div className="min-h-screen px-4 py-8 pt-20 max-w-6xl mx-auto animate-slide-up">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-serif font-bold text-n-dark dark:text-n-cream">{title}</h2>
          <p className="text-n-olive dark:text-n-sage">{subtitle}</p>
        </div>
        {showModify && (
          <button 
            onClick={() => setAppState(AppState.PREFERENCES)}
            className="bg-white dark:bg-n-dark-card border border-n-cream dark:border-n-dark text-n-olive dark:text-n-sage px-4 py-2 rounded-xl text-sm hover:bg-n-cream dark:hover:bg-n-dark-base transition-colors"
          >
            {TRANSLATIONS[language].modify}
          </button>
        )}
        {!showModify && (
           <button 
            onClick={() => setAppState(AppState.RESULTS)}
            className="text-n-orange font-bold hover:underline"
          >
            {TRANSLATIONS[language].back}
          </button>
        )}
      </header>

      {list.length === 0 ? (
        <div className="text-center py-20 text-n-olive dark:text-n-sage">
           <Heart size={48} className="mx-auto mb-4 opacity-30" />
           <p>{TRANSLATIONS[language].noFavorites}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(recipe => (
            <div 
              key={recipe.id}
              onClick={() => {
                setSelectedRecipe(recipe);
                setAppState(AppState.RECIPE_DETAIL);
              }}
              className="group bg-white dark:bg-n-dark-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-n-cream dark:border-n-dark hover:border-n-sage flex flex-col relative"
            >
              <div className="h-48 bg-n-cream dark:bg-n-dark-base relative overflow-hidden">
                {recipeImages[recipe.id] ? (
                  <img 
                    src={recipeImages[recipe.id]} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-n-cream/50 dark:bg-n-dark-base/50">
                    <Loader2 className="animate-spin text-n-olive dark:text-n-sage" />
                  </div>
                )}
                
                <div className="absolute top-3 right-3 flex gap-2">
                   <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(recipe);
                    }}
                    className="p-1.5 bg-white/90 dark:bg-n-dark-base/90 rounded-full shadow-sm hover:scale-110 transition-transform"
                   >
                     <Star size={16} fill={favorites.some(f => f.id === recipe.id) ? "#E87D33" : "none"} className={favorites.some(f => f.id === recipe.id) ? "text-n-orange" : "text-gray-400"} />
                   </button>
                </div>

                <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-n-dark-base/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-n-dark dark:text-n-cream flex items-center gap-2">
                  <Clock size={12}/> {recipe.timeToCook} {TRANSLATIONS[language].min}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-bold text-n-dark dark:text-n-cream font-serif group-hover:text-n-orange transition-colors">{recipe.title}</h3>
                </div>
                <p className="text-n-olive dark:text-n-sage text-sm line-clamp-3 mb-4 flex-1">{recipe.description}</p>
                
                <div className="flex gap-2 text-xs font-medium text-n-dark/60 dark:text-n-cream/60 mt-auto">
                  <span className="bg-n-base dark:bg-n-dark-base px-2 py-1 rounded-md">{recipe.calories} {TRANSLATIONS[language].kcal}</span>
                  <span className="bg-n-base dark:bg-n-dark-base px-2 py-1 rounded-md border border-n-orange/20 text-n-orange">{recipe.priceEstimate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-n-base dark:bg-n-dark-base font-sans selection:bg-n-sage selection:text-white transition-colors duration-300">
      {renderHeader()}
      
      {showInstallGuide && (
        <InstallGuide language={language} onClose={() => setShowInstallGuide(false)} />
      )}

      {appState === AppState.INTRO && renderIntro()}
      {appState === AppState.NAME_INPUT && renderNameInput()}
      
      {appState === AppState.PREFERENCES && (
        <div className="min-h-screen px-4 py-8 pt-20">
           <header className="flex justify-between items-center max-w-xl mx-auto mb-8">
            <h2 className="text-lg font-bold text-n-dark dark:text-n-cream opacity-50">{userName}</h2>
            {error && <div className="text-red-500 text-sm bg-red-100 px-3 py-1 rounded-lg animate-pulse">{error}</div>}
           </header>
           <PreferenceForm initialName={userName} language={language} onSubmit={handleFormSubmit} />
        </div>
      )}

      {appState === AppState.GENERATING && renderLoading()}
      
      {appState === AppState.RESULTS && renderRecipeList(
        recipes, 
        `${TRANSLATIONS[language].hello}, ${userName}`, 
        TRANSLATIONS[language].hereAreSuggestions, 
        true
      )}

      {appState === AppState.FAVORITES && renderRecipeList(
        favorites,
        TRANSLATIONS[language].favorites,
        `${favorites.length} saved recipes`,
        false
      )}

      {appState === AppState.RECIPE_DETAIL && selectedRecipe && (
        <div className="min-h-screen px-4 py-8 pt-20 max-w-4xl mx-auto">
          <RecipeDetail 
            recipe={selectedRecipe} 
            imageUrl={recipeImages[selectedRecipe.id]} 
            onBack={() => setAppState(AppState.RESULTS)} 
            isFavorite={favorites.some(f => f.id === selectedRecipe.id)}
            toggleFavorite={() => toggleFavorite(selectedRecipe)}
            language={language}
          />
        </div>
      )}
    </div>
  );
};

export default App;