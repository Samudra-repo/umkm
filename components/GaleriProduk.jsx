"use client";

import { useState } from "react";

export default function GaleriProduk({ daftarFoto, nama }) {
  const [indeksAktif, setIndeksAktif] = useState(0);
  const fotoUtama = daftarFoto[indeksAktif] ?? daftarFoto[0] ?? "";

  return (
    <div className="flex flex-col gap-3">
      <img
        src={fotoUtama}
        alt={nama}
        className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
      />
      {daftarFoto.length > 1 && (
        <div className="flex flex-wrap gap-2" role="list" aria-label="Galeri foto produk">
          {daftarFoto.map((url, indeks) => {
            const aktif = indeks === indeksAktif;
            return (
              <button
                key={`${url}-${indeks}`}
                type="button"
                onClick={() => setIndeksAktif(indeks)}
                aria-label={`Lihat foto ${indeks + 1} untuk ${nama}`}
                aria-pressed={aktif}
                className={`overflow-hidden rounded-xl border-2 bg-permukaan transition-colors ${
                  aktif ? "border-utama" : "border-garis hover:border-utama"
                }`}
              >
                <img
                  src={url}
                  alt={`${nama} (${indeks + 1})`}
                  className="h-16 w-16 object-cover sm:h-20 sm:w-20"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
