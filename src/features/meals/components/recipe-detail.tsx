"use client";

import { useState } from "react";
import { Clock, Flame } from "lucide-react";
import type { Recipe } from "@/types/domain";

export function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const [portions, setPortions] = useState(recipe.portions);
  const ratio = portions / recipe.portions;
  return <div className="max-h-[72dvh] overflow-y-auto pr-1">
    <p className="text-sm leading-6 text-slate-500">{recipe.description || "Aucune description"}</p>
    <div className="mt-4 grid grid-cols-2 gap-2"><span className="rounded-xl bg-slate-50 p-3 text-sm"><Clock className="mb-1 text-brand" size={18} />{recipe.prepMinutes} min</span><span className="rounded-xl bg-slate-50 p-3 text-sm"><Flame className="mb-1 text-orange-500" size={18} />{recipe.calories} kcal / portion</span></div>
    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs"><span className="rounded-xl bg-brand-soft p-2"><b className="block text-sm">{recipe.protein} g</b>Protéines</span><span className="rounded-xl bg-amber-50 p-2"><b className="block text-sm">{recipe.carbs} g</b>Glucides</span><span className="rounded-xl bg-rose-50 p-2"><b className="block text-sm">{recipe.fat} g</b>Lipides</span></div>
    <label className="mt-5 flex items-center justify-between font-semibold">Portions affichées<select value={portions} onChange={(event) => setPortions(Number(event.target.value))} className="h-11 rounded-xl border border-slate-200 bg-white px-4">{Array.from({ length: 12 }, (_, index) => index + 1).map((value) => <option key={value}>{value}</option>)}</select></label>
    <h3 className="mt-6 font-bold">Ingrédients</h3><ul className="mt-2 divide-y divide-slate-100">{recipe.ingredients.map((item) => <li key={`${item.ingredientId}-${item.unit}`} className="flex justify-between py-3 text-sm"><span>{item.name}</span><b>{Number((item.quantity * ratio).toFixed(2))} {item.unit}</b></li>)}</ul>
    <h3 className="mt-6 font-bold">Préparation</h3><ol className="mt-3 space-y-3">{recipe.instructions.map((step, index) => <li key={`${index}-${step}`} className="flex gap-3 text-sm leading-6"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{index + 1}</span><span>{step}</span></li>)}</ol>
  </div>;
}
