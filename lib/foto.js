/**
 * Memecah nilai kolom foto_url menjadi daftar URL foto.
 * Mendukung satu URL, JSON array, atau beberapa URL yang dipisah baris baru / koma.
 */
export function ambilDaftarFoto(fotoUrl) {
  if (!fotoUrl) return [];
  const teks = String(fotoUrl).trim();
  if (!teks) return [];

  if (teks.startsWith("[")) {
    try {
      const parsed = JSON.parse(teks);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // Abaikan jika bukan JSON array valid
    }
  }

  return teks
    .split(/[\r\n]+|,\s*(?=(?:https?:\/\/|\/))/i)
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Mengambil URL foto pertama sebagai foto utama kartu atau tabel produk.
 */
export function ambilFotoUtama(fotoUrl) {
  return ambilDaftarFoto(fotoUrl)[0] ?? "";
}
