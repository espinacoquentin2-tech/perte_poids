"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

export function BottomSheet({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <button aria-label="Fermer" onClick={onClose} className="absolute inset-0 bg-ink/45" />
      <section className="safe-bottom relative w-full max-w-lg rounded-t-3xl bg-white p-5 pb-6 shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
        <div className="mb-5 flex items-center justify-between"><h2 id="sheet-title" className="text-xl font-bold">{title}</h2><button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100" aria-label="Fermer"><X size={20} /></button></div>
        {children}
      </section>
    </div>
  );
}
