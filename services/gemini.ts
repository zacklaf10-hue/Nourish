import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, UserPreferences } from "../types";

// Robust API Key retrieval that checks multiple standard conventions
// (Vite, Create React App, and standard process.env)
const getApiKey = () => {
  let key = '';

  // 1. Try Vite standard (import.meta.env)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      key = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY || '';
    }
  } catch (e) {}

  // 2. If not found, try process.env (Node/Webpack/CRA/Netlify default)
  if (!key) {
    try {
      if (typeof process !== 'undefined' && process.env) {
        key = process.env.VITE_API_KEY || 
              process.env.REACT_APP_API_KEY || 
              process.env.API_KEY || 
              process.env.APA_KEY || // Keep fallback for typo
              '';
      }
    } catch (e) {
      console.warn("Environment variable access failed.");
    }
  }

  return key;
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateRecipes = async (prefs: UserPreferences): Promise<Recipe[]> => {
  if (!apiKey) {
    console.error("API Key is missing. Checked: VITE_API_KEY, REACT_APP_API_KEY, API_KEY.");
    throw new Error("API Key is missing.");
  }

  const langInstruction = prefs.language === 'fr' 
    ? "Generate all text, titles, descriptions, and steps in French." 
    : "Generate all text in English.";

  const prompt = `
    ${langInstruction}
    Create ${prefs.numberOfDishes} distinct recipes.
    User Name: ${prefs.name}.
    Available Ingredients (must prioritize these): ${prefs.ingredients.join(', ')}.
    Available Tools: ${prefs.tools.join(', ')}.
    Dietary Restriction: ${prefs.diet}.
    Time Limit: ${prefs.timeAvailable} minutes.
    Portions: ${prefs.portions}.
    
    CRITICAL: Provide an estimated price range for the ingredients needed to make this dish in France (EUR), based on average prices at supermarkets like Carrefour, Lidl, or Auchan. Format as "10-15 €".

    Return a list of detailed recipes. 
    Include a specific, descriptive 'imagePrompt' that describes the visual appearance of the final dish for an AI image generator (e.g., "overhead shot of golden crispy tofu with broccoli...").
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              timeToCook: { type: Type.NUMBER, description: "Total time in minutes" },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER, description: "In grams" },
              carbs: { type: Type.NUMBER, description: "In grams" },
              fats: { type: Type.NUMBER, description: "In grams" },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              toolsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
              steps: { type: Type.ARRAY, items: { type: Type.STRING } },
              imagePrompt: { type: Type.STRING },
              priceEstimate: { type: Type.STRING, description: "Estimated price range in Euros (e.g. 12-15 €)" },
            },
            required: ["id", "title", "description", "timeToCook", "calories", "protein", "steps", "imagePrompt", "priceEstimate"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as Recipe[];
  } catch (error) {
    console.error("Recipe generation failed:", error);
    throw error;
  }
};

export const generateRecipeImage = async (imagePrompt: string): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [{ text: imagePrompt }],
      },
      config: {}
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed", error);
  }
  return null;
};