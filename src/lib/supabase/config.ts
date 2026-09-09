<<<<<<< ours
export const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Configuration Supabase manquante");
  return { url, key };
=======
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (Boolean(url) !== Boolean(publishableKey)) {
  throw new Error(
    "Configuration Supabase incomplète : renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
  );
}

export const hasSupabaseConfig = Boolean(url && publishableKey);

export function getSupabaseConfig() {
  if (!url || !publishableKey) throw new Error("Configuration Supabase manquante");
  return { url, publishableKey };
>>>>>>> theirs
}
