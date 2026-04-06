import { cache } from "react";

export const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export interface Ingredient {
  idIngredient: string;
  strIngredient: string;
  strDescription: string;
  strType: string | null;
}

export interface MealPreview {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

export interface MealDetail {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string;
  // Ingredients and measures are dynamically keyed in the API, up to 20
  [key: string]: string | null;
}

/**
 * Extracts ingredients and measures from the flattened MealDB response.
 */
export function extractIngredients(meal: MealDetail): { ingredient: string; measure: string }[] {
  const ingredients: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : "",
      });
    }
  }
  return ingredients;
}

/**
 * Fetch a list of all available ingredients.
 * Wrapped in cache() to deduplicate calls within a single render.
 */
export const getIngredients = cache(async (): Promise<Ingredient[]> => {
  const res = await fetch(`${BASE_URL}/list.php?i=list`, {
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  if (!res.ok) {
    throw new Error("Failed to fetch ingredients");
  }

  const data = await res.json();
  return data.meals || [];
});

/**
 * Fetch a list of meals that contain a specific ingredient.
 * Wrapped in cache() to deduplicate calls within a single render.
 */
export const getMealsByIngredient = cache(async (ingredient: string): Promise<MealPreview[]> => {
  const res = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch meals for ingredient: ${ingredient}`);
  }

  const data = await res.json();
  return data.meals || [];
});

/**
 * Fetch detailed information for a specific meal by its real ID.
 * Wrapped in cache() to deduplicate calls within a single render (e.g. generateMetadata + page).
 */
export const getMealDetail = cache(async (id: string): Promise<MealDetail | null> => {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch meal details for ID: ${id}`);
  }

  const data = await res.json();
  return data.meals && data.meals.length > 0 ? data.meals[0] : null;
});

/**
 * Search for meals by name.
 * Wrapped in cache() to deduplicate calls within a single render.
 */
export const searchMealsByName = cache(async (query: string): Promise<MealPreview[]> => {
  const res = await fetch(`${BASE_URL}/search.php?s=${query}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`Failed to search meals with query: ${query}`);
  }

  const data = await res.json();
  return data.meals || [];
});

/**
 * Search for ingredient by name.
 * Wrapped in cache() to deduplicate calls within a single render.
 */
export const searchIngredientsByName = cache(async (query: string): Promise<Ingredient[]> => {
  const res = await fetch(`${BASE_URL}/filter.php?i=${query}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`Failed to search meals with query: ${query}`);
  }

  const data = await res.json();
  return data.meals || [];
});
