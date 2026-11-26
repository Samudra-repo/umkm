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

async function periksaAdminLogin() {
  const supabase = await buatSupabaseSesi();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase: null, user: null };
  }

  return { supabase, user };
}

export async function gantiPassword(_stateSebelumnya, formData) {
  try {
    const { supabase, user } = await periksaAdminLogin();

    if (!user) {
      return {
        error: "Anda harus masuk sebagai admin terlebih dahulu sebelum mengganti password.",
      };
    }

    const passwordBaru = formData.get("password_baru")?.toString() ?? "";
    const konfirmasi = formData.get("konfirmasi_password")?.toString() ?? "";

    if (passwordBaru.length < 8) {
      return { error: "Password baru minimal 8 karakter." };
    }

    if (passwordBaru !== konfirmasi) {
      return { error: "Konfirmasi password tidak sama dengan password baru." };
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordBaru,
    });

    if (error) {
      console.error("Gagal mengganti password:", error.message);
      if (error.message.toLowerCase().includes("different from the old password")) {
        return { error: "Password baru harus berbeda dari password sebelumnya." };
      }
      return { error: "Gagal mengganti password. Silakan coba lagi." };
    }

    return { success: "Password berhasil diperbarui." };
  } catch (err) {
    console.error("Kesalahan saat mengganti password:", err?.message ?? err);
    return {
      error: "Terjadi gangguan pada server autentikasi. Coba lagi beberapa saat.",
    };
  }
}
