import { demoToday } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type { MealType, TodayData, TodayMeal, TodayWorkout, WorkoutType } from "@/types/domain";

export async function getTodayData(): Promise<{ data: TodayData; demo: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { data: demoToday, demo: true };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: demoToday, demo: true };
  const date = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 6 * 86_400_000).toISOString().slice(0, 10);
  const [profileResult, weightsResult, dailyResult, mealsResult, workoutsResult] = await Promise.all([
    supabase.from("profiles").select("first_name,target_weight_kg,daily_step_goal").eq("user_id", user.id).maybeSingle(),
    supabase.from("weight_logs").select("weight_kg,logged_on").eq("user_id", user.id).gte("logged_on", weekAgo).lte("logged_on", date).order("logged_on"),
    supabase.from("daily_logs").select("steps,step_goal_reached").eq("user_id", user.id).eq("logged_on", date).maybeSingle(),
    supabase.from("meal_plan").select("id,meal_type,eaten,recipes(name,calories_per_portion,protein_g)").eq("user_id", user.id).eq("planned_for", date),
    supabase.from("workouts").select("id,name,workout_type,duration_minutes,workout_logs(completed)").eq("user_id", user.id).eq("scheduled_for", date).limit(1),
  ]);
  const profile = profileResult.data as unknown as { first_name: string; target_weight_kg: number; daily_step_goal: number } | null;
  const weights = (weightsResult.data ?? []) as unknown as { weight_kg: number; logged_on: string }[];
  const daily = dailyResult.data as unknown as { steps: number; step_goal_reached: boolean } | null;
  const rawMeals = (mealsResult.data ?? []) as unknown as { id: string; meal_type: MealType; eaten: boolean; recipes: { name: string; calories_per_portion: number; protein_g: number } | null }[];
  const rawWorkout = (workoutsResult.data?.[0] ?? null) as unknown as { id: string; name: string; workout_type: WorkoutType; duration_minutes: number; workout_logs: { completed: boolean }[] } | null;
  const todayWeight = weights.find((item) => item.logged_on === date)?.weight_kg ?? null;
  const average = weights.length ? weights.reduce((sum, item) => sum + Number(item.weight_kg), 0) / weights.length : null;
  const meals: TodayMeal[] = rawMeals.filter((item) => item.recipes).map((item) => ({ id: item.id, type: item.meal_type, eaten: item.eaten, recipe: { name: item.recipes!.name, calories: item.recipes!.calories_per_portion, protein: item.recipes!.protein_g } }));
  const workout: TodayWorkout | null = rawWorkout ? { id: rawWorkout.id, name: rawWorkout.name, type: rawWorkout.workout_type, durationMinutes: rawWorkout.duration_minutes, completed: rawWorkout.workout_logs.some((log) => log.completed) } : null;
  return { data: { profile: { firstName: profile?.first_name ?? "", targetWeight: profile?.target_weight_kg ?? 79.9, stepGoal: profile?.daily_step_goal ?? 10_000 }, weight: todayWeight, weightAverage7d: average, steps: daily?.steps ?? 0, stepGoalReached: daily?.step_goal_reached ?? false, meals, workout }, demo: false };
}
