import { cleanEnv, str, url } from 'envalid';

// Validated environment, frozen at first import. Throws on boot if any
// VITE_SUPABASE_* variable is missing or malformed.
export const env = cleanEnv(import.meta.env, {
  VITE_SUPABASE_URL: url(),
  VITE_SUPABASE_ANON_KEY: str(),
  VITE_SUPABASE_STORAGE_BUCKET: str({ default: 'product-images' }),
});
