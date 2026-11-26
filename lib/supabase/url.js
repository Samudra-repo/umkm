/**
 * Mengambil dan menormalisasi SUPABASE_URL menjadi origin utama proyek
 * (misalnya menghapus akhiran /rest/v1/ jika terbawa di environment variable).
 */
export function ambilUrlSupabase() {
  const rawUrl = process.env.SUPABASE_URL?.trim();

  if (!rawUrl) {
    throw new Error("Variabel environment SUPABASE_URL wajib diisi di server.");
  }

  try {
    return new URL(rawUrl).origin;
  } catch {
    throw new Error("Format SUPABASE_URL tidak valid.");
  }
}
