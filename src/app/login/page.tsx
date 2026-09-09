import { Dumbbell } from "lucide-react";
import { login, signUp } from "@/features/auth/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-10">
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white"><Dumbbell /></div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-[.18em] text-brand">Cut Tracker</p>
      <h1 className="text-3xl font-bold tracking-tight">Heureux de vous revoir</h1>
      <p className="mt-2 text-slate-500">Votre progression, simplement.</p>
      <form className="mt-8 space-y-4">
        <label className="block text-sm font-semibold">Adresse email<input required name="email" type="email" autoComplete="email" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-normal" placeholder="vous@exemple.fr" /></label>
        <label className="block text-sm font-semibold">Mot de passe<input required minLength={6} name="password" type="password" autoComplete="current-password" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-normal" /></label>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button formAction={login} className="h-12 w-full rounded-xl bg-brand font-semibold text-white">Se connecter</button>
        <button formAction={signUp} className="h-12 w-full rounded-xl border border-brand font-semibold text-brand">Créer mon compte</button>
      </form>
    </main>
  );
}
