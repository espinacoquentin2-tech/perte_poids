import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

export function createClient() {
<<<<<<< ours
  const { url, key } = getSupabaseConfig();
  return createBrowserClient(url, key);
=======
  const { url, publishableKey } = getSupabaseConfig();
  return createBrowserClient(url, publishableKey);
>>>>>>> theirs
}
