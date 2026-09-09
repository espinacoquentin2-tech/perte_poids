"use client";

import { useState } from "react";
import { Check, ChevronRight, Dumbbell, Footprints, Scale, Utensils } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import type { TodayData } from "@/types/domain";
import { saveSteps, saveWeight, toggleMeal, toggleWorkout, validateStepGoal } from "./actions";

const number = new Intl.NumberFormat("fr-FR");

function ToggleButton({ checked, label }: { checked: boolean; label: string }) {
  return <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${checked ? "bg-brand text-white" : "border-2 border-slate-200 bg-white text-transparent"}`} aria-label={label}><Check size={21} strokeWidth={3} /></span>;
}

export function TodayDashboard({ data, demo }: { data: TodayData; demo: boolean }) {
  const [sheet, setSheet] = useState<"weight" | "steps" | null>(null);
  const tasks = [...data.meals.map((meal) => meal.eaten), Boolean(data.workout?.completed), data.steps >= data.profile.stepGoal];
  const completed = tasks.filter(Boolean).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
<<<<<<< ours
  const date = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
=======
  const date = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: data.profile.timezone }).format(new Date());
>>>>>>> theirs
  const lunch = data.meals.find((meal) => meal.type === "lunch");
  const dinner = data.meals.find((meal) => meal.type === "dinner");

  return (
    <>
      <header className="mb-5 flex items-start justify-between">
        <div><p className="capitalize text-sm font-medium text-slate-500">{date}</p><h1 className="mt-1 text-2xl font-bold tracking-tight">Bonjour{data.profile.firstName ? ` ${data.profile.firstName}` : ""} 👋</h1></div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft font-bold text-brand">{data.profile.firstName?.[0] || "CT"}</div>
      </header>
      {demo && <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">Mode aperçu · connectez Supabase pour enregistrer vos données.</p>}
      <section className="grid grid-cols-3 gap-2">
        <button onClick={() => setSheet("weight")} className="min-h-24 rounded-2xl bg-white p-3 text-left shadow-card"><Scale size={18} className="mb-3 text-brand" /><strong className="block text-xl">{data.weight?.toFixed(1) ?? "—"}<small className="ml-1 text-xs text-slate-400">kg</small></strong><span className="text-[11px] text-slate-500">Aujourd’hui</span></button>
        <div className="min-h-24 rounded-2xl bg-white p-3 shadow-card"><span className="mb-3 block text-xs font-semibold text-brand">MOY. 7 J</span><strong className="block text-xl">{data.weightAverage7d?.toFixed(1) ?? "—"}<small className="ml-1 text-xs text-slate-400">kg</small></strong><span className="text-[11px] text-slate-500">Tendance</span></div>
        <div className="min-h-24 rounded-2xl bg-brand p-3 text-white shadow-card"><span className="mb-3 block text-xs font-semibold text-white/70">OBJECTIF</span><strong className="block text-xl">{data.profile.targetWeight.toFixed(1)}<small className="ml-1 text-xs text-white/60">kg</small></strong><span className="text-[11px] text-white/70">À atteindre</span></div>
      </section>
      <div className="mt-3 flex items-center gap-1 rounded-2xl bg-white p-2 shadow-card">
        <button onClick={() => setSheet("steps")} className="flex min-h-14 min-w-0 flex-1 items-center gap-3 p-2 text-left"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand"><Footprints /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Pas du jour</span><strong className="text-xl">{number.format(data.steps)}</strong><span className="text-sm text-slate-400"> / {number.format(data.profile.stepGoal)}</span><span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-brand" style={{ width: `${Math.min(100, data.steps / data.profile.stepGoal * 100)}%` }} /></span></span><ChevronRight className="text-slate-300" /></button>
        <form action={validateStepGoal}><button disabled={data.steps >= data.profile.stepGoal} aria-label="Valider l’objectif de pas" className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white disabled:bg-brand-soft disabled:text-brand"><Check size={20} /></button></form>
      </div>
      <section className="mt-5">
        <div className="mb-2 flex items-center justify-between"><h2 className="font-bold">Au programme</h2><span className="text-xs font-semibold text-brand">{completed}/{tasks.length} validés</span></div>
        <div className="space-y-2">
          {[{ meal: lunch, title: "Déjeuner" }, { meal: dinner, title: "Dîner" }].map(({ meal, title }) => meal ? (
            <form action={toggleMeal} key={meal.id}><input type="hidden" name="id" value={meal.id} /><input type="hidden" name="completed" value={String(meal.eaten)} /><button className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-white px-3 py-2 text-left shadow-card"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Utensils size={20} /></span><span className="min-w-0 flex-1"><span className="block text-xs text-slate-400">{title}</span><strong className="block truncate text-sm">{meal.recipe.name}</strong><span className="text-xs text-slate-400">{meal.recipe.calories} kcal · {meal.recipe.protein} g prot.</span></span><ToggleButton checked={meal.eaten} label={`Valider ${title.toLowerCase()}`} /></button></form>
          ) : <div key={title} className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">Aucun {title.toLowerCase()} planifié</div>)}
          {data.workout ? <form action={toggleWorkout}><input type="hidden" name="id" value={data.workout.id} /><input type="hidden" name="completed" value={String(data.workout.completed)} /><button className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-white px-3 py-2 text-left shadow-card"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Dumbbell size={20} /></span><span className="flex-1"><span className="block text-xs text-slate-400">Séance</span><strong className="block text-sm">{data.workout.name}</strong><span className="text-xs text-slate-400">{data.workout.durationMinutes} min</span></span><ToggleButton checked={data.workout.completed} label="Valider la séance" /></button></form> : null}
        </div>
      </section>
      <section className="mt-4 rounded-2xl bg-ink p-4 text-white"><div className="flex items-center justify-between"><div><p className="text-xs text-white/60">Progression du jour</p><strong className="text-2xl">{progress}%</strong></div><div className="relative h-12 w-12 rounded-full bg-white/10"><div className="absolute inset-2 flex items-center justify-center rounded-full bg-ink text-xs font-bold">{completed}/{tasks.length}</div></div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${progress}%` }} /></div></section>
      <BottomSheet open={sheet === "weight"} title="Poids du jour" onClose={() => setSheet(null)}><form action={saveWeight} onSubmit={() => setSheet(null)}><div className="relative"><input name="weight" required min="30" max="300" step="0.1" inputMode="decimal" defaultValue={data.weight ?? undefined} autoFocus className="h-16 w-full rounded-2xl border border-slate-200 px-5 pr-14 text-2xl font-bold" /><span className="absolute right-5 top-5 text-slate-400">kg</span></div><button className="mt-4 h-13 w-full rounded-2xl bg-brand py-4 font-bold text-white">Enregistrer</button></form></BottomSheet>
      <BottomSheet open={sheet === "steps"} title="Pas du jour" onClose={() => setSheet(null)}><form action={saveSteps} onSubmit={() => setSheet(null)}><input name="steps" required min="0" max="200000" step="1" inputMode="numeric" defaultValue={data.steps} autoFocus className="h-16 w-full rounded-2xl border border-slate-200 px-5 text-2xl font-bold" /><button className="mt-4 w-full rounded-2xl bg-brand py-4 font-bold text-white">Enregistrer</button></form></BottomSheet>
    </>
  );
}
