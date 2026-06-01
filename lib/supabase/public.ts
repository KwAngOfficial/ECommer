import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/env";

/** Read-only client without cookies — safe for static generation of public catalog data. */
export function createPublicClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createSupabaseClient(env.url, env.anonKey);
}
