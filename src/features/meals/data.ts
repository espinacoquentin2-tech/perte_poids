import { addDays, DEFAULT_TIMEZONE, localDate, startOfWeek } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import type { IngredientAmount, MealType, MealWeekData, Recipe } from "@/types/domain";
import { getDemoMealWeek } from "./demo";

type RawRecipe = { id: string; name: string; description: string; portions: number; prep_minutes: number; calories_per_portion: number; protein_g: number; carbs_g: number; fat_g: number; instructions: string; meal_plan: { id: string }[]; recipe_ingredients: { id: string; ingredient_id: string; quantity: number; unit: string; ingredients: { name: string } | null }[] };

function mapRecipe(recipe: RawRecipe): Recipe {
  const ingredients: IngredientAmount[] = recipe.recipe_ingredients.map((item) => ({ id: item.id, ingredientId: item.ingredient_id, name: item.ingredients?.name ?? "Ingrédient", quantity: Number(item.quantity), unit: item.unit }));
  return { id: recipe.id, name: recipe.name, description: recipe.description, portions: recipe.portions, prepMinutes: recipe.prep_minutes, calories: recipe.calories_per_portion, protein: Number(recipe.protein_g), carbs: Number(recipe.carbs_g), fat: Number(recipe.fat_g), instructions: recipe.instructions.split("\n").map((step) => step.trim()).filter(Boolean), ingredients, isUsed: recipe.meal_plan.length > 0 };
}

export async function getMealWeek(requestedStart?: string): Promise<{ data: MealWeekData; demo: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { data: getDemoMealWeek(requestedStart), demo: true };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: getDemoMealWeek(requestedStart), demo: true };
  const { data: profile } = await supabase.from("profiles").select("timezone").eq("user_id", user.id).maybeSingle();
  const timezone = String(profile?.timezone ?? DEFAULT_TIMEZONE);
  const today = localDate(timezone);
  const weekStart = requestedStart ?? startOfWeek(today);
  const end = addDays(weekStart, 6);
  const [recipesResult, mealsResult, ingredientsResult] = await Promise.all([
    supabase.from("recipes").select("id,name,description,portions,prep_minutes,calories_per_portion,protein_g,carbs_g,fat_g,instructions,meal_plan(id),recipe_ingredients(id,ingredient_id,quantity,unit,ingredients(name))").eq("user_id", user.id).order("name"),
    supabase.from("meal_plan").select("id,planned_for,meal_type,portions,eaten,recipe_id").eq("user_id", user.id).gte("planned_for", addDays(weekStart, -1)).lte("planned_for", end).order("planned_for"),
    supabase.from("ingredients").select("id,name").eq("user_id", user.id).order("name"),
  ]);
  const recipes = ((recipesResult.data ?? []) as unknown as RawRecipe[]).map(mapRecipe);
  const recipeMap = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const rawMeals = (mealsResult.data ?? []) as unknown as { id: string; planned_for: string; meal_type: MealType; portions: number; eaten: boolean; recipe_id: string }[];
  const meals = rawMeals.filter((meal) => meal.planned_for >= weekStart && recipeMap.has(meal.recipe_id)).map((meal) => {
    const previousDinner = rawMeals.find((candidate) => candidate.planned_for === addDays(meal.planned_for, -1) && candidate.meal_type === "dinner");
    return { id: meal.id, date: meal.planned_for, type: meal.meal_type, portions: Number(meal.portions), eaten: meal.eaten, recipe: recipeMap.get(meal.recipe_id)!, isLeftover: meal.meal_type === "lunch" && previousDinner?.recipe_id === meal.recipe_id };
  });
  return { data: { weekStart, today, timezone, recipes, meals, ingredients: (ingredientsResult.data ?? []) as { id: string; name: string }[] }, demo: false };
}
