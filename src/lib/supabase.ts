import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.ts';
import type { Database } from './types.ts';

// Single client shared by every page entry. Importing this module also pulls
// in `env`, which validates the VITE_SUPABASE_* vars at boot.
//
// We do NOT pass `Database` as the schema generic: Supabase v2's
// GenericSchema has a strict shape (Relationships, Views, Functions) that
// is hard to satisfy by hand for small apps. The `Database` type is exported
// from `./types.ts` for our own use, and we cast query results at the call
// site (e.g. `as Product[]`). When the schema grows, generate it with
// `supabase gen types typescript` and tighten this back up.
export const supabase: SupabaseClient = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
);

// Re-export for callers that want the typed Database.
export type { Database };