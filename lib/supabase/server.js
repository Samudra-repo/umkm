import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ambilUrlSupabase } from "./url";

/**
 * Membuat koneksi Supabase di sisi server menggunakan SUPABASE_SECRET_KEY.
 * Hanya digunakan di Server Component, Server Action, atau Route Handler
 * untuk membaca data publik yang dilindungi RLS.
 */
export function buatSupabaseServer() {
  const url = ambilUrlSupabase();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!key) {
    throw new Error(
      "Variabel environment SUPABASE_SECRET_KEY wajib diisi di server."
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Membuat koneksi Supabase berbasis sesi cookie admin (@supabase/ssr)
 * menggunakan SUPABASE_PUBLISHABLE_KEY. Hanya digunakan di server.
 */
export async function buatSupabaseSesi() {
  const url = ambilUrlSupabase();
  const key = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!key) {
    throw new Error(
      "Variabel environment SUPABASE_PUBLISHABLE_KEY wajib diisi di server."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Diabaikan ketika dipanggil dari Server Component yang tidak dapat menulis cookie.
        }
      },
    },
  });
}
