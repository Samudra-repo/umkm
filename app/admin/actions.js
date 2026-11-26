"use server";

import { redirect } from "next/navigation";
import { buatSupabaseSesi } from "@/lib/supabase/server";

export async function loginAdmin(_stateSebelumnya, formData) {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let pesanError = null;

  try {
    const supabase = await buatSupabaseSesi();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login admin gagal:", error.message);
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        pesanError = "Email atau password salah. Silakan periksa kembali.";
      } else {
        pesanError = "Gagal masuk. Periksa email, password, atau koneksi ke server.";
      }
    }
  } catch (err) {
    console.error("Kesalahan saat login admin:", err?.message ?? err);
    pesanError = "Terjadi gangguan pada server autentikasi. Coba lagi beberapa saat.";
  }

  if (pesanError) {
    return { error: pesanError };
  }

  redirect("/admin");
}

export async function keluarAdmin() {
  try {
    const supabase = await buatSupabaseSesi();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Kesalahan saat keluar admin:", err?.message ?? err);
  }

  redirect("/admin/login");
}
