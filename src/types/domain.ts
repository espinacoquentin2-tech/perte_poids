<<<<<<< ours
export type MealType = "lunch" | "dinner";
=======
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
>>>>>>> theirs
export type WorkoutType = "run" | "strength" | "walk" | "rowing" | "cycling";

export interface TodayMeal {
  id: string;
  type: MealType;
  eaten: boolean;
  recipe: { name: string; calories: number; protein: number };
}

export interface TodayWorkout {
  id: string;
  name: string;
  type: WorkoutType;
  durationMinutes: number;
  completed: boolean;
}

export interface TodayData {
<<<<<<< ours
  profile: { firstName: string; targetWeight: number; stepGoal: number };
=======
  profile: { firstName: string; targetWeight: number; stepGoal: number; timezone: string };
>>>>>>> theirs
  weight: number | null;
  weightAverage7d: number | null;
  steps: number;
  stepGoalReached: boolean;
  meals: TodayMeal[];
  workout: TodayWorkout | null;
}
<<<<<<< ours
=======

export interface IngredientAmount {
  id?: string;
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  portions: number;
  prepMinutes: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  instructions: string[];
  ingredients: IngredientAmount[];
  isUsed?: boolean;
}

export interface PlannedMeal {
  id: string;
  date: string;
  type: MealType;
  portions: number;
  eaten: boolean;
  isLeftover: boolean;
  recipe: Recipe;
}

export interface MealWeekData {
  weekStart: string;
  today: string;
  timezone: string;
  meals: PlannedMeal[];
  recipes: Recipe[];
  ingredients: { id: string; name: string }[];
}
>>>>>>> theirs
