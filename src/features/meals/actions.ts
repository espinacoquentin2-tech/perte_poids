"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MealType } from "@/types/domain";

type IngredientInput = { ingredientId?: string; name: string; quantity: number; unit: string };

async function context() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user ? { supabase, user } : null;
}

export async function saveMeal(formData: FormData) {
  const current = await context();
  if (!current) return;
  const date = String(formData.get("date"));
  const type = String(formData.get("type")) as MealType;
  const recipeId = String(formData.get("recipeId"));
  const portions = Number(formData.get("portions") ?? 1);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !["breakfast", "lunch", "dinner"].includes(type) || !recipeId || portions <= 0) return;
  const { data: ownedRecipe } = await current.supabase.from("recipes").select("id").eq("id", recipeId).eq("user_id", current.user.id).maybeSingle();
  if (!ownedRecipe) return;
  await current.supabase.from("meal_plan").upsert({ user_id: current.user.id, planned_for: date, meal_type: type, recipe_id: recipeId, portions }, { onConflict: "user_id,planned_for,meal_type" });
  revalidatePath("/"); revalidatePath("/meals");
}

export async function deleteMeal(formData: FormData) {
  const current = await context(); if (!current) return;
  await current.supabase.from("meal_plan").delete().eq("id", String(formData.get("id"))).eq("user_id", current.user.id);
  revalidatePath("/"); revalidatePath("/meals");
}

function recipeValues(formData: FormData) {
  return { name: String(formData.get("name") ?? "").trim(), description: String(formData.get("description") ?? "").trim(), portions: Number(formData.get("portions")), prep_minutes: Number(formData.get("prepMinutes")), calories_per_portion: Number(formData.get("calories")), protein_g: Number(formData.get("protein")), carbs_g: Number(formData.get("carbs")), fat_g: Number(formData.get("fat")), instructions: String(formData.get("instructions") ?? "").split("\n").map((step) => step.trim()).filter(Boolean).join("\n") };
}

function ingredientValues(formData: FormData): IngredientInput[] {
  try {
    const parsed: unknown = JSON.parse(String(formData.get("ingredients") ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((value): IngredientInput[] => {
      if (typeof value !== "object" || value === null) return [];
      const item = value as Record<string, unknown>; const quantity = Number(item.quantity);
      if ((!item.ingredientId && !item.name) || !Number.isFinite(quantity) || quantity <= 0 || !item.unit) return [];
      return [{ ingredientId: String(item.ingredientId ?? "") || undefined, name: String(item.name ?? "").trim(), quantity, unit: String(item.unit).trim() }];
    });
  } catch { return []; }
}

async function replaceIngredients(current: NonNullable<Awaited<ReturnType<typeof context>>>, recipeId: string, inputs: IngredientInput[]) {
  await current.supabase.from("recipe_ingredients").delete().eq("recipe_id", recipeId).eq("user_id", current.user.id);
  for (const input of inputs) {
    let ingredientId = input.ingredientId;
    if (ingredientId) {
      const { data: ownedIngredient } = await current.supabase.from("ingredients").select("id").eq("id", ingredientId).eq("user_id", current.user.id).maybeSingle();
      ingredientId = ownedIngredient?.id;
    }
    if (!ingredientId) {
      const { data } = await current.supabase.from("ingredients").upsert({ user_id: current.user.id, name: input.name || "Ingrédient" }, { onConflict: "user_id,name" }).select("id").single();
      ingredientId = data?.id;
    }
    if (ingredientId) await current.supabase.from("recipe_ingredients").insert({ user_id: current.user.id, recipe_id: recipeId, ingredient_id: ingredientId, quantity: input.quantity, unit: input.unit });
  }
}

export async function saveRecipe(formData: FormData) {
  const current = await context(); if (!current) return;
  const values = recipeValues(formData); if (!values.name || values.portions <= 0) return;
  const recipeId = String(formData.get("id") ?? "");
  if (recipeId) {
    await current.supabase.from("recipes").update(values).eq("id", recipeId).eq("user_id", current.user.id);
    await replaceIngredients(current, recipeId, ingredientValues(formData));
  } else {
    const { data } = await current.supabase.from("recipes").insert({ ...values, user_id: current.user.id }).select("id").single();
    if (data?.id) await replaceIngredients(current, data.id, ingredientValues(formData));
  }
  revalidatePath("/meals");
}

export async function deleteRecipe(formData: FormData) {
  const current = await context(); if (!current) return;
  const id = String(formData.get("id"));
  const { count } = await current.supabase.from("meal_plan").select("id", { count: "exact", head: true }).eq("recipe_id", id).eq("user_id", current.user.id);
  if ((count ?? 0) > 0) return;
  await current.supabase.from("recipes").delete().eq("id", id).eq("user_id", current.user.id);
  revalidatePath("/meals");
}
