"use client";

import { useState, useTransition } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol }) {
  const [nama, setNama] = useState(produk.nama ?? "");
  const [kategori, setKategori] = useState(produk.kategori ?? "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi ?? "");
  const [pesanErrorAI, setPesanErrorAI] = useState(null);
  const [sedangMembuat, startTransition] = useTransition();

  function tanganiBuatDeskripsi() {
    setPesanErrorAI(null);

    if (!nama.trim()) {
      setPesanErrorAI("Isi nama produk terlebih dahulu sebelum membuat deskripsi dengan AI.");
      return;
    }

    startTransition(async () => {
      const hasil = await buatDeskripsiAI({ nama, kategori });
      if (hasil?.error) {
        setPesanErrorAI(hasil.error);
        return;
      }
      if (hasil?.deskripsi) {
        setDeskripsi(hasil.deskripsi);
      }
    });
  }

  return (
    <form className="flex max-w-xl flex-col gap-4">
      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input
        label="Stok"
        name="stok"
        type="number"
        min="0"
        defaultValue={produk.stok ?? 10}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />
      <div className="flex flex-col gap-1">
        <Input
          label="Link foto"
          name="foto_url"
          textarea
          placeholder="https://... atau /produk/nama-file.svg (pisahkan baris baru/koma untuk beberapa foto)"
          defaultValue={produk.foto_url}
        />
        <p className="text-xs text-teks-lembut">
          Bisa diisi lebih dari satu link foto (pisahkan dengan baris baru atau koma).
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold">Deskripsi</span>
          <Tombol
            type="button"
            varian="garis"
            onClick={tanganiBuatDeskripsi}
            disabled={sedangMembuat}
          >
            {sedangMembuat ? "Membuat deskripsi..." : "Buat deskripsi dengan AI"}
          </Tombol>
        </div>
        <Input
          aria-label="Deskripsi"
          name="deskripsi"
          textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
        />
        {pesanErrorAI && (
          <p
            role="alert"
            className="rounded-lg border border-bahaya bg-latar px-3 py-2 text-sm text-bahaya"
          >
            {pesanErrorAI}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Tombol type="submit">{labelTombol}</Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
