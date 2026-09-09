"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
<<<<<<< ours

function today() { return new Date().toISOString().slice(0, 10); }
=======
import { DEFAULT_TIMEZONE, localDate } from "@/lib/date";
>>>>>>> theirs

async function currentUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
<<<<<<< ours
  return user ? { supabase, user } : null;
=======
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("timezone").eq("user_id", user.id).maybeSingle();
  return { supabase, user, date: localDate(String(profile?.timezone ?? DEFAULT_TIMEZONE)) };
>>>>>>> theirs
}

export async function saveWeight(formData: FormData) {
  const value = Number(formData.get("weight"));
  if (!Number.isFinite(value) || value < 30 || value > 300) return;
  const context = await currentUser();
  if (!context) return;
<<<<<<< ours
  await context.supabase.from("weight_logs").upsert({ user_id: context.user.id, logged_on: today(), weight_kg: value }, { onConflict: "user_id,logged_on" });
=======
  await context.supabase.from("weight_logs").upsert({ user_id: context.user.id, logged_on: context.date, weight_kg: value }, { onConflict: "user_id,logged_on" });
>>>>>>> theirs
  revalidatePath("/");
}

export async function saveSteps(formData: FormData) {
  const value = Math.round(Number(formData.get("steps")));
  if (!Number.isFinite(value) || value < 0 || value > 200_000) return;
  const context = await currentUser();
  if (!context) return;
<<<<<<< ours
  await context.supabase.from("daily_logs").upsert({ user_id: context.user.id, logged_on: today(), steps: value }, { onConflict: "user_id,logged_on" });
=======
  await context.supabase.from("daily_logs").upsert({ user_id: context.user.id, logged_on: context.date, steps: value }, { onConflict: "user_id,logged_on" });
>>>>>>> theirs
  revalidatePath("/");
}

export async function validateStepGoal() {
  const context = await currentUser();
  if (!context) return;
  const [{ data: profile }, { data: daily }] = await Promise.all([
    context.supabase.from("profiles").select("daily_step_goal").eq("user_id", context.user.id).single(),
<<<<<<< ours
    context.supabase.from("daily_logs").select("steps").eq("user_id", context.user.id).eq("logged_on", today()).maybeSingle(),
  ]);
  const goal = Number(profile?.daily_step_goal ?? 10_000);
  const steps = Math.max(Number(daily?.steps ?? 0), goal);
  await context.supabase.from("daily_logs").upsert({ user_id: context.user.id, logged_on: today(), steps }, { onConflict: "user_id,logged_on" });
=======
    context.supabase.from("daily_logs").select("steps").eq("user_id", context.user.id).eq("logged_on", context.date).maybeSingle(),
  ]);
  const goal = Number(profile?.daily_step_goal ?? 10_000);
  const steps = Math.max(Number(daily?.steps ?? 0), goal);
  await context.supabase.from("daily_logs").upsert({ user_id: context.user.id, logged_on: context.date, steps }, { onConflict: "user_id,logged_on" });
>>>>>>> theirs
  revalidatePath("/");
}

export async function toggleMeal(formData: FormData) {
  const context = await currentUser();
  if (!context) return;
  await context.supabase.from("meal_plan").update({ eaten: formData.get("completed") !== "true" }).eq("id", String(formData.get("id"))).eq("user_id", context.user.id);
<<<<<<< ours
  revalidatePath("/");
=======
  revalidatePath("/"); revalidatePath("/meals");
>>>>>>> theirs
}

export async function toggleWorkout(formData: FormData) {
  const context = await currentUser();
  if (!context) return;
  const workoutId = String(formData.get("id"));
  const completed = formData.get("completed") === "true";
<<<<<<< ours
  if (completed) await context.supabase.from("workout_logs").delete().eq("workout_id", workoutId).eq("user_id", context.user.id).eq("performed_on", today());
  else await context.supabase.from("workout_logs").insert({ user_id: context.user.id, workout_id: workoutId, performed_on: today(), completed: true });
=======
  if (completed) await context.supabase.from("workout_logs").delete().eq("workout_id", workoutId).eq("user_id", context.user.id).eq("performed_on", context.date);
  else await context.supabase.from("workout_logs").insert({ user_id: context.user.id, workout_id: workoutId, performed_on: context.date, completed: true });
>>>>>>> theirs
  revalidatePath("/");
}
