export type MealType = "lunch" | "dinner";
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
  profile: { firstName: string; targetWeight: number; stepGoal: number };
  weight: number | null;
  weightAverage7d: number | null;
  steps: number;
  stepGoalReached: boolean;
  meals: TodayMeal[];
  workout: TodayWorkout | null;
}
