import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client. Used in client components ("use client").
// Reads the two public env vars you set in .env.local and in Vercel.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
