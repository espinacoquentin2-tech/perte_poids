import type { LucideIcon } from "lucide-react";

export function ComingSoon({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return <section><p className="text-sm font-semibold uppercase tracking-[.16em] text-brand">Cut Tracker</p><h1 className="mt-1 text-3xl font-bold">{title}</h1><div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-card"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand"><Icon size={30} /></span><h2 className="mt-5 text-lg font-bold">Bientôt disponible</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p></div></section>;
}
