"use client";

import { useState } from "react";
import Input from "@/components/Input";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("");

  const jumlahValid = Number.isFinite(jumlah) && jumlah >= 1 ? Math.floor(jumlah) : 1;
  const varianBersih = varian.trim();
  const totalHarga = produk.harga * jumlahValid;

  const nomor = toko.nomorWhatsApp.replace(/\D/g, "");
  const barisPesan = [
    `Halo ${toko.nama}, saya ingin memesan:`,
    `- Produk: ${produk.nama}`,
    `- Harga satuan: ${formatRupiah(produk.harga)}`,
    `- Jumlah: ${jumlahValid}`,
  ];
  if (varianBersih) {
    barisPesan.push(`- Varian/catatan: ${varianBersih}`);
  }
  barisPesan.push(`- Total: ${formatRupiah(totalHarga)}`);

  const pesan = barisPesan.join("\n");
  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  function ubahJumlah(nilaiBaru) {
    const angka = parseInt(nilaiBaru, 10);
    setJumlah(Number.isNaN(angka) || angka < 1 ? 1 : angka);
  }

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Jumlah</span>
          <div className="inline-flex w-fit items-center rounded-lg border border-garis bg-latar">
            <button
              type="button"
              onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
              aria-label="Kurangi jumlah"
              className="px-3 py-2 text-base font-bold text-teks hover:text-utama disabled:opacity-40"
              disabled={jumlahValid <= 1}
            >
              -
            </button>
            <input
              type="number"
              name="jumlah"
              min={1}
              value={jumlahValid}
              onChange={(e) => ubahJumlah(e.target.value)}
              aria-label="Jumlah pesanan"
              className="w-14 border-x border-garis bg-latar py-2 text-center text-base font-semibold text-teks focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setJumlah((prev) => prev + 1)}
              aria-label="Tambah jumlah"
              className="px-3 py-2 text-base font-bold text-teks hover:text-utama"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex-1">
          <Input
            label="Varian / catatan (opsional)"
            name="varian"
            value={varian}
            onChange={(e) => setVarian(e.target.value)}
            placeholder="Contoh: pedas, ukuran L, tanpa gula"
          />
        </div>
      </div>

      <p className="text-sm text-teks-lembut">
        Total pesanan:{" "}
        <span className="font-bold text-teks">{formatRupiah(totalHarga)}</span>
      </p>

      <div>
        <a
          href={urlWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
        >
          Pesan via WhatsApp
        </a>
      </div>
    </div>
  );
}
