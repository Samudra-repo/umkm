import Link from "next/link";
import Input from "@/components/Input";
import KartuProduk from "@/components/KartuProduk";
import Tombol from "@/components/Tombol";
import { buatSupabaseServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

const URUTAN_PRODUK = {
  terbaru: { label: "Terbaru", kolom: "created_at", ascending: false },
  termurah: { label: "Termurah", kolom: "harga", ascending: true },
  termahal: { label: "Termahal", kolom: "harga", ascending: false },
};

function buatUrlKatalog({ kategori, cari, urut }) {
  const params = new URLSearchParams();
  if (kategori) params.set("kategori", kategori);
  if (cari) params.set("cari", cari);
  if (urut && urut !== "terbaru") params.set("urut", urut);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

function escapeLike(nilai) {
  return nilai.replace(/[\\%_]/g, "\\$&");
}

function kelasPill(aktif) {
  return `rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
    aktif
      ? "bg-utama text-white"
      : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
  }`;
}

export default async function HalamanKatalog({ searchParams }) {
  const resolvedParams = await searchParams;
  const kategoriAktif = resolvedParams?.kategori?.toString().trim() ?? "";
  const kataKunci = resolvedParams?.cari?.toString().trim() ?? "";
  const rawUrut = resolvedParams?.urut?.toString().trim() ?? "";
  const urutAktif = Object.hasOwn(URUTAN_PRODUK, rawUrut) ? rawUrut : "terbaru";
  const konfigurasiUrutan = URUTAN_PRODUK[urutAktif];

  let daftarProduk = [];
  let daftarKategori = [];
  let pesanError = null;

  try {
    const supabase = buatSupabaseServer();

    let queryProduk = supabase
      .from("produk")
      .select("id, nama, harga, foto_url, kategori")
      .order(konfigurasiUrutan.kolom, { ascending: konfigurasiUrutan.ascending });

    if (konfigurasiUrutan.kolom !== "created_at") {
      queryProduk = queryProduk.order("created_at", { ascending: false });
    }

    if (kategoriAktif) {
      queryProduk = queryProduk.eq("kategori", kategoriAktif);
    }

    if (kataKunci) {
      queryProduk = queryProduk.ilike("nama", `%${escapeLike(kataKunci)}%`);
    }

    const [{ data: dataProduk, error: errorProduk }, { data: dataKategori, error: errorKategori }] =
      await Promise.all([queryProduk, supabase.from("produk").select("kategori")]);

    if (errorProduk || errorKategori) {
      console.error(
        "Gagal mengambil data produk:",
        errorProduk?.message ?? errorKategori?.message
      );
      pesanError =
        "Gagal mengambil daftar produk dari database. Coba muat ulang halaman atau periksa tabel produk di Supabase.";
    } else {
      daftarProduk = dataProduk ?? [];
      daftarKategori = Array.from(
        new Set(
          (dataKategori ?? [])
            .map((item) => item.kategori?.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b, "id"));
    }
  } catch (err) {
    console.error("Gagal membuat koneksi Supabase:", err?.message ?? err);
    pesanError =
      "Gagal terhubung ke database. Pastikan SUPABASE_URL dan SUPABASE_SECRET_KEY sudah dikonfigurasi dengan benar.";
  }

  const sedangDisaring = Boolean(kategoriAktif || kataKunci || urutAktif !== "terbaru");

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>

        {!pesanError && (daftarKategori.length > 0 || daftarProduk.length > 0 || sedangDisaring) && (
          <div className="flex flex-col gap-4">
            <form method="GET" action="/" className="flex flex-col gap-2 sm:flex-row sm:items-end">
              {kategoriAktif && <input type="hidden" name="kategori" value={kategoriAktif} />}
              {urutAktif !== "terbaru" && <input type="hidden" name="urut" value={urutAktif} />}
              <div className="flex-1 sm:max-w-sm">
                <Input
                  key={kataKunci}
                  label="Cari produk"
                  name="cari"
                  type="search"
                  defaultValue={kataKunci}
                  placeholder="Cari nama produk..."
                />
              </div>
              <div className="flex gap-2">
                <Tombol type="submit">Cari</Tombol>
                {sedangDisaring && (
                  <Tombol href="/" varian="garis">
                    Reset
                  </Tombol>
                )}
              </div>
            </form>

            {daftarKategori.length > 0 && (
              <nav aria-label="Filter kategori" className="flex flex-wrap gap-2">
                <Link
                  href={buatUrlKatalog({ cari: kataKunci, urut: urutAktif })}
                  className={kelasPill(!kategoriAktif)}
                >
                  Semua
                </Link>
                {daftarKategori.map((kategori) => (
                  <Link
                    key={kategori}
                    href={buatUrlKatalog({ kategori, cari: kataKunci, urut: urutAktif })}
                    className={kelasPill(kategoriAktif === kategori)}
                  >
                    {kategori}
                  </Link>
                ))}
              </nav>
            )}

            <nav aria-label="Urutkan produk" className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-teks-lembut">Urutkan:</span>
              {Object.entries(URUTAN_PRODUK).map(([kunci, info]) => (
                <Link
                  key={kunci}
                  href={buatUrlKatalog({
                    kategori: kategoriAktif,
                    cari: kataKunci,
                    urut: kunci,
                  })}
                  className={kelasPill(urutAktif === kunci)}
                >
                  {info.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {pesanError ? (
          <p
            role="alert"
            className="rounded-xl border border-bahaya bg-latar px-4 py-3 text-sm text-bahaya"
          >
            {pesanError}
          </p>
        ) : daftarProduk.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-garis bg-permukaan px-4 py-6 text-sm text-teks-lembut">
            <p>
              {sedangDisaring
                ? "Tidak ada produk yang cocok dengan pencarian atau kategori yang dipilih."
                : "Belum ada produk"}
            </p>
            {sedangDisaring && (
              <Tombol href="/" varian="garis">
                Lihat semua produk
              </Tombol>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
