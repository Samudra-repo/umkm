import { createClient } from "@supabase/supabase-js";

/**
 * Membuat koneksi Supabase di sisi server menggunakan SUPABASE_SECRET_KEY.
 * Hanya digunakan di Server Component, Server Action, atau Route Handler
 * untuk membaca data publik yang dilindungi RLS.
 */
export function buatSupabaseServer() {
  const rawUrl = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!rawUrl || !key) {
    throw new Error(
      "Variabel environment SUPABASE_URL dan SUPABASE_SECRET_KEY wajib diisi di server."
    );
  }

  let url;
  try {
    url = new URL(rawUrl).origin;
  } catch {
    throw new Error("Format SUPABASE_URL tidak valid.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
