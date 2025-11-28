import React from 'react';
import { Recipe, Language, TRANSLATIONS } from '../types';
import { Clock, Flame, Dumbbell, ArrowLeft, CheckCircle, Star, Coins, ChefHat } from 'lucide-react';

interface RecipeDetailProps {
  recipe: Recipe;
  imageUrl?: string | null;
  onBack: () => void;
  isFavorite: boolean;
  toggleFavorite: () => void;
  language: Language;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ 
  recipe, imageUrl, onBack, isFavorite, toggleFavorite, language 
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="animate-slide-up pb-20">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-n-dark dark:text-n-cream font-bold hover:text-n-orange transition-colors"
      >
        <ArrowLeft size={20} /> {t.back}
      </button>

      <div className="bg-white dark:bg-n-dark-card rounded-3xl shadow-xl overflow-hidden border border-n-cream dark:border-n-dark">
        <div className="relative h-64 md:h-80 bg-n-cream dark:bg-n-dark-base group">
          {imageUrl ? (
            <img src={imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
          ) : imageUrl === null ? (
            // Fallback for failed image
            <div className="w-full h-full flex flex-col items-center justify-center text-n-olive/50 dark:text-n-sage/50">
              <ChefHat size={48} className="mb-2 opacity-50" />
              <span className="text-lg font-serif italic opacity-70">Nourish Kitchen</span>
            </div>
          ) : (
            // Loading State
            <div className="w-full h-full flex items-center justify-center text-n-olive/50 dark:text-n-sage/50">
              <span className="text-lg animate-pulse">Creating delicious visuals...</span>
            </div>
          )}
          
          {/* Overlay Stats */}
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="bg-white/90 dark:bg-n-dark-base/90 backdrop-blur px-4 py-2 rounded-full text-n-dark dark:text-n-cream font-bold text-sm shadow-sm flex items-center gap-2">
              <Coins size={14} className="text-n-orange"/> {recipe.priceEstimate}
            </div>
            <div className="bg-white/90 dark:bg-n-dark-base/90 backdrop-blur px-4 py-2 rounded-full text-n-dark dark:text-n-cream font-bold text-sm shadow-sm">
              {recipe.calories} {t.kcal}
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            className="absolute top-4 left-4 p-3 rounded-full bg-white/90 dark:bg-n-dark-base/90 backdrop-blur shadow-md hover:scale-110 transition-transform"
          >
             <Star size={24} fill={isFavorite ? "#E87D33" : "none"} className={isFavorite ? "text-n-orange" : "text-gray-400"} />
          </button>
        </div>

        <div className="p-8">
          <h1 className="text-4xl font-serif font-bold text-n-dark dark:text-n-cream mb-4">{recipe.title}</h1>
          <p className="text-n-olive dark:text-n-sage text-lg leading-relaxed mb-8">{recipe.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
             <div className="bg-n-base dark:bg-n-dark-base p-4 rounded-2xl text-center border border-n-cream dark:border-n-dark">
                <Clock className="mx-auto text-n-orange mb-2" size={24} />
                <div className="font-bold text-n-dark dark:text-n-cream">{recipe.timeToCook}m</div>
                <div className="text-xs text-n-olive dark:text-n-sage uppercase tracking-wide">Time</div>
             </div>
             <div className="bg-n-base dark:bg-n-dark-base p-4 rounded-2xl text-center border border-n-cream dark:border-n-dark">
                <Dumbbell className="mx-auto text-n-dark dark:text-n-cream mb-2" size={24} />
                <div className="font-bold text-n-dark dark:text-n-cream">{recipe.protein}g</div>
                <div className="text-xs text-n-olive dark:text-n-sage uppercase tracking-wide">{t.protein}</div>
             </div>
             <div className="bg-n-base dark:bg-n-dark-base p-4 rounded-2xl text-center border border-n-cream dark:border-n-dark">
                <Flame className="mx-auto text-n-sage mb-2" size={24} />
                <div className="font-bold text-n-dark dark:text-n-cream">{recipe.fats}g</div>
                <div className="text-xs text-n-olive dark:text-n-sage uppercase tracking-wide">{t.fats}</div>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-n-dark dark:text-n-cream mb-4 font-serif">{t.ingredients}</h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-n-olive dark:text-n-sage">
                    <span className="w-2 h-2 rounded-full bg-n-sage mt-2 shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-n-dark dark:text-n-cream mt-8 mb-4 font-serif">{t.equipment}</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.toolsNeeded.map((tool, idx) => (
                   <span key={idx} className="bg-n-cream dark:bg-n-dark-base text-n-dark dark:text-n-cream px-3 py-1 rounded-lg text-sm">
                     {tool}
                   </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-n-dark dark:text-n-cream mb-4 font-serif">{t.prep}</h3>
              <div className="space-y-6">
                {recipe.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-n-dark dark:bg-n-sage text-white dark:text-n-dark-base flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-n-olive dark:text-n-sage mt-1 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-n-yellow/30 dark:bg-n-yellow/10 rounded-xl flex items-center gap-3 text-n-dark dark:text-n-cream text-sm">
                <CheckCircle size={20} className="text-n-olive dark:text-n-sage" />
                {t.enjoy}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};