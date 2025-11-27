import React, { useState } from 'react';
import { UserPreferences, DIET_OPTIONS, TOOL_OPTIONS, COMMON_INGREDIENTS, Language, TRANSLATIONS } from '../types';
import { Plus, X, ChefHat, Clock, Users, Utensils, Check } from 'lucide-react';

interface PreferenceFormProps {
  initialName: string;
  language: Language;
  onSubmit: (prefs: UserPreferences) => void;
}

export const PreferenceForm: React.FC<PreferenceFormProps> = ({ initialName, language, onSubmit }) => {
  const t = TRANSLATIONS[language];
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIng, setCurrentIng] = useState('');
  
  const [tools, setTools] = useState<string[]>([]);
  const [diet, setDiet] = useState(DIET_OPTIONS[0]);
  const [time, setTime] = useState(30);
  const [portions, setPortions] = useState(2);
  const [numDishes, setNumDishes] = useState(3);

  const addIngredient = (ingName: string = currentIng) => {
    const trimmed = ingName.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      if (ingName === currentIng) setCurrentIng('');
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const toggleIngredient = (ing: string) => {
    if (ingredients.includes(ing)) {
      removeIngredient(ing);
    } else {
      addIngredient(ing);
    }
  };

  const toggleTool = (tool: string) => {
    if (tools.includes(tool)) {
      setTools(tools.filter(t => t !== tool));
    } else {
      setTools([...tools, tool]);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      name: initialName,
      ingredients,
      tools,
      diet,
      timeAvailable: time,
      portions,
      numberOfDishes: numDishes,
      language
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-20 animate-slide-up">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-serif text-n-dark dark:text-n-cream font-bold">{t.inventory}</h2>
        <p className="text-n-olive dark:text-n-sage">{t.fridgeQuestion}, {initialName}?</p>
      </div>

      {/* Ingredients */}
      <div className="bg-white/50 dark:bg-n-dark-card/50 backdrop-blur-sm p-6 rounded-2xl border border-n-cream dark:border-n-dark shadow-sm">
        <label className="block text-sm font-bold text-n-dark dark:text-n-cream mb-3 uppercase tracking-wider">{t.ingredients}</label>
        
        {/* Quick Add Chips */}
        <div className="mb-4">
          <p className="text-xs font-bold text-n-olive/70 dark:text-n-sage/70 mb-2">{t.quickAdd}</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_INGREDIENTS.map(ing => {
              const isSelected = ingredients.includes(ing);
              return (
                <button
                  key={ing}
                  onClick={() => toggleIngredient(ing)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border flex items-center gap-1 ${
                    isSelected
                      ? 'bg-n-olive text-white border-n-olive'
                      : 'bg-white dark:bg-n-dark-base text-n-olive dark:text-n-sage border-n-cream dark:border-n-dark hover:border-n-sage'
                  }`}
                >
                  {isSelected && <Check size={10} />}
                  {ing}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={currentIng}
            onChange={(e) => setCurrentIng(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
            placeholder={t.placeholderIng}
            className="flex-1 bg-white dark:bg-n-dark-base border border-n-cream dark:border-n-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-n-sage text-n-dark dark:text-n-cream placeholder-n-olive/50"
          />
          <button 
            onClick={() => addIngredient()}
            className="bg-n-sage text-white p-3 rounded-xl hover:bg-n-olive transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {ingredients.map(ing => (
            <span key={ing} className="bg-n-cream/50 dark:bg-n-dark-base text-n-dark dark:text-n-cream border border-n-cream dark:border-n-dark px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium animate-fade-in">
              {ing}
              <button onClick={() => removeIngredient(ing)} className="text-n-olive hover:text-n-orange">
                <X size={14} />
              </button>
            </span>
          ))}
          {ingredients.length === 0 && (
            <span className="text-sm text-n-olive/60 dark:text-n-sage/60 italic">{t.noIng}</span>
          )}
        </div>
      </div>

      {/* Tools */}
      <div className="bg-white/50 dark:bg-n-dark-card/50 backdrop-blur-sm p-6 rounded-2xl border border-n-cream dark:border-n-dark shadow-sm">
        <label className="block text-sm font-bold text-n-dark dark:text-n-cream mb-3 uppercase tracking-wider">{t.equipment}</label>
        <div className="flex flex-wrap gap-2">
          {TOOL_OPTIONS.map(tool => (
            <button
              key={tool}
              onClick={() => toggleTool(tool)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                tools.includes(tool)
                  ? 'bg-n-olive text-white border-n-olive shadow-md transform scale-105'
                  : 'bg-white dark:bg-n-dark-base text-n-olive dark:text-n-sage border-n-cream dark:border-n-dark hover:border-n-sage'
              }`}
            >
              {tool}
            </button>
          ))}
        </div>
      </div>

      {/* Diet - New Selectable Grid */}
      <div className="bg-white/50 dark:bg-n-dark-card/50 backdrop-blur-sm p-6 rounded-2xl border border-n-cream dark:border-n-dark shadow-sm">
         <label className="block text-sm font-bold text-n-dark dark:text-n-cream mb-3 flex items-center gap-2">
           <ChefHat size={16} /> {t.diet}
         </label>
         <div className="flex flex-wrap gap-2">
           {DIET_OPTIONS.map(d => (
             <button
               key={d}
               onClick={() => setDiet(d)}
               className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 border ${
                 diet === d 
                  ? 'bg-n-orange text-white border-n-orange shadow-md' 
                  : 'bg-white dark:bg-n-dark-base text-n-dark dark:text-n-cream border-n-cream dark:border-n-dark'
               }`}
             >
               {d}
             </button>
           ))}
         </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time */}
        <div className="bg-white/50 dark:bg-n-dark-card/50 backdrop-blur-sm p-6 rounded-2xl border border-n-cream dark:border-n-dark shadow-sm">
           <label className="block text-sm font-bold text-n-dark dark:text-n-cream mb-3 flex items-center gap-2">
             <Clock size={16} /> {t.time}
           </label>
           <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="10" 
                max="120" 
                step="5"
                value={time}
                onChange={(e) => setTime(parseInt(e.target.value))}
                className="flex-1 accent-n-orange h-2 bg-n-cream dark:bg-n-dark-base rounded-lg appearance-none cursor-pointer"
              />
              <span className="bg-white dark:bg-n-dark-base px-3 py-1 rounded-lg text-n-dark dark:text-n-cream font-bold border border-n-cream dark:border-n-dark min-w-[4rem] text-center">
                {time}m
              </span>
           </div>
        </div>

         {/* Portions */}
         <div className="bg-white/50 dark:bg-n-dark-card/50 backdrop-blur-sm p-6 rounded-2xl border border-n-cream dark:border-n-dark shadow-sm">
           <label className="block text-sm font-bold text-n-dark dark:text-n-cream mb-3 flex items-center gap-2">
             <Users size={16} /> {t.portions}
           </label>
           <div className="flex items-center justify-between bg-white dark:bg-n-dark-base rounded-xl border border-n-cream dark:border-n-dark p-1">
              <button 
                onClick={() => setPortions(Math.max(1, portions - 1))}
                className="w-10 h-10 flex items-center justify-center text-n-olive dark:text-n-sage hover:bg-n-base dark:hover:bg-n-dark-card rounded-lg"
              >
                -
              </button>
              <span className="font-bold text-n-dark dark:text-n-cream">{portions}</span>
              <button 
                onClick={() => setPortions(portions + 1)}
                className="w-10 h-10 flex items-center justify-center text-n-olive dark:text-n-sage hover:bg-n-base dark:hover:bg-n-dark-card rounded-lg"
              >
                +
              </button>
           </div>
        </div>

        {/* Number of Dishes */}
        <div className="col-span-1 md:col-span-2 bg-white/50 dark:bg-n-dark-card/50 backdrop-blur-sm p-6 rounded-2xl border border-n-cream dark:border-n-dark shadow-sm">
           <label className="block text-sm font-bold text-n-dark dark:text-n-cream mb-3 flex items-center gap-2">
             <Utensils size={16} /> {t.count}
           </label>
           <div className="flex gap-2">
             {[1, 2, 3, 4, 5, 6].map(n => (
               <button
                key={n}
                onClick={() => setNumDishes(n)}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${
                  numDishes === n 
                  ? 'bg-n-orange text-white' 
                  : 'bg-white dark:bg-n-dark-base text-n-olive dark:text-n-sage border border-n-cream dark:border-n-dark'
                }`}
               >
                 {n}
               </button>
             ))}
           </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={ingredients.length === 0}
        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transform transition-all hover:-translate-y-1 ${
          ingredients.length === 0 
            ? 'bg-n-cream dark:bg-n-dark-base text-n-olive/50 cursor-not-allowed'
            : 'bg-n-dark dark:bg-n-sage text-white hover:bg-n-olive dark:hover:bg-n-olive hover:shadow-xl'
        }`}
      >
        {t.create}
      </button>
    </div>
  );
};