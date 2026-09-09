"use client";

import type { MealType, PlannedMeal, Recipe } from "@/types/domain";
import { deleteMeal, saveMeal } from "../actions";

export function MealEditor({ date, type, meal, recipes, done }: { date: string; type: MealType; meal?: PlannedMeal; recipes: Recipe[]; done: () => void }) {
  return <div><form action={saveMeal} onSubmit={done} className="space-y-4"><input type="hidden" name="date" value={date} /><input type="hidden" name="type" value={type} /><label className="block text-sm font-semibold">Recette<select required name="recipeId" defaultValue={meal?.recipe.id ?? ""} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3"><option value="" disabled>Choisir une recette</option>{recipes.map((recipe) => <option key={recipe.id} value={recipe.id}>{recipe.name}</option>)}</select></label><label className="block text-sm font-semibold">Nombre de portions<input required name="portions" type="number" min="0.5" max="20" step="0.5" defaultValue={meal?.portions ?? 1} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-3" /></label><button className="h-12 w-full rounded-xl bg-brand font-bold text-white">Enregistrer</button></form>{meal && <form action={deleteMeal} onSubmit={done} className="mt-3"><input type="hidden" name="id" value={meal.id} /><button className="h-12 w-full rounded-xl bg-red-50 font-semibold text-red-700">Supprimer le repas</button></form>}</div>;
}
