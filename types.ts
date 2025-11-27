export interface Recipe {
  id: string;
  title: string;
  description: string;
  timeToCook: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  toolsNeeded: string[];
  steps: string[];
  imagePrompt: string;
  priceEstimate: string; // e.g. "€10-15"
}

export interface UserPreferences {
  name: string;
  ingredients: string[];
  tools: string[];
  diet: string;
  timeAvailable: number; // in minutes
  portions: number;
  numberOfDishes: number;
  language: 'en' | 'fr';
}

export enum AppState {
  INTRO = 'INTRO',
  NAME_INPUT = 'NAME_INPUT',
  PREFERENCES = 'PREFERENCES',
  GENERATING = 'GENERATING',
  RESULTS = 'RESULTS',
  FAVORITES = 'FAVORITES',
  RECIPE_DETAIL = 'RECIPE_DETAIL'
}

export const DIET_OPTIONS = [
  'Anything', 'High Protein', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Low Carb', 'Gluten Free'
];

export const TOOL_OPTIONS = [
  'Stove', 'Oven', 'Air Fryer', 'Microwave', 'Blender', 'Slow Cooker', 'Grill', 'Toaster'
];

export const COMMON_INGREDIENTS = [
  'Eggs', 'Chicken', 'Rice', 'Pasta', 'Tomatoes', 
  'Onions', 'Milk', 'Cheese', 'Potatoes', 'Spinach', 
  'Bread', 'Butter', 'Garlic', 'Olive Oil'
];

export type Language = 'en' | 'fr';

export const TRANSLATIONS = {
  en: {
    inventory: "Kitchen Inventory",
    fridgeQuestion: "What's in your fridge",
    ingredients: "Ingredients",
    quickAdd: "Quick Add Essentials",
    placeholderIng: "e.g. Quinoa, Salmon...",
    noIng: "No ingredients added yet.",
    equipment: "Equipment",
    diet: "Diet",
    time: "Time Available",
    portions: "Portions",
    count: "Recipe Count",
    create: "Create Menu",
    back: "Back to Menu",
    generating: "Crafting your menu...",
    generatingSub: "Checking prices at Carrefour & Auchan...",
    hello: "Hello",
    hereAreSuggestions: "Here are your personalized suggestions.",
    modify: "Modify Inputs",
    min: "min",
    kcal: "kcal",
    protein: "Protein",
    fats: "Fats",
    prep: "Preparation",
    enjoy: "Enjoy your meal!",
    whoCooking: "Who is cooking today?",
    enterName: "Enter your name",
    favorites: "Favorites",
    noFavorites: "No favorite recipes yet.",
    price: "Est. Price",
    installApp: "Install App",
    howToInstall: "How to install on your phone",
    iosInstructions: "Tap the Share button in Safari, scroll down and select 'Add to Home Screen'.",
    androidInstructions: "Tap the three dots menu in Chrome and select 'Add to Home Screen' or 'Install App'.",
    close: "Close"
  },
  fr: {
    inventory: "Inventaire Cuisine",
    fridgeQuestion: "Qu'y a-t-il dans votre frigo",
    ingredients: "Ingrédients",
    quickAdd: "Ajout Rapide",
    placeholderIng: "ex: Quinoa, Saumon...",
    noIng: "Aucun ingrédient ajouté.",
    equipment: "Équipement",
    diet: "Régime",
    time: "Temps Disponible",
    portions: "Portions",
    count: "Nombre de Plats",
    create: "Créer le Menu",
    back: "Retour au Menu",
    generating: "Création de votre menu...",
    generatingSub: "Vérification des prix Carrefour & Auchan...",
    hello: "Bonjour",
    hereAreSuggestions: "Voici vos suggestions personnalisées.",
    modify: "Modifier",
    min: "min",
    kcal: "kcal",
    protein: "Protéines",
    fats: "Lipides",
    prep: "Préparation",
    enjoy: "Bon appétit !",
    whoCooking: "Qui cuisine aujourd'hui ?",
    enterName: "Entrez votre nom",
    favorites: "Favoris",
    noFavorites: "Aucun favori pour le moment.",
    price: "Prix Est.",
    installApp: "Installer l'App",
    howToInstall: "Comment installer sur mobile",
    iosInstructions: "Appuyez sur le bouton Partager dans Safari, descendez et sélectionnez 'Sur l'écran d'accueil'.",
    androidInstructions: "Appuyez sur le menu (trois points) dans Chrome et sélectionnez 'Ajouter à l'écran d'accueil' ou 'Installer l'application'.",
    close: "Fermer"
  }
};