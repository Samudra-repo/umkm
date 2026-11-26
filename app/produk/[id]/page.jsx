import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import { formatRupiah } from "@/lib/format";
import { buatSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const supabase = buatSupabaseServer();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("id, nama, harga, deskripsi, foto_url, kategori")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.code === "22P02" || error.code === "22003") {
      notFound();
    }
    console.error("Gagal mengambil detail produk:", error.message);
    throw new Error("Gagal mengambil detail produk dari database.");
  }

  if (!produk) {
    notFound();
  }

  let produkTerkait = [];
  if (produk.kategori) {
    const { data: terkait, error: errorTerkait } = await supabase
      .from("produk")
      .select("id, nama, harga, foto_url, kategori")
      .eq("kategori", produk.kategori)
      .neq("id", produk.id)
      .order("created_at", { ascending: false })
      .limit(3);

    if (errorTerkait) {
      console.error("Gagal mengambil produk terkait:", errorTerkait.message);
    } else {
      produkTerkait = terkait ?? [];
    }
  }

  return (
    <>
      <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
        />
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
            Kembali ke katalog
          </Link>
          <p className="text-sm text-teks-lembut">{produk.kategori}</p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
          <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
          <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
          <TombolWhatsApp produk={produk} />
        </div>
      </article>

      {produkTerkait.length > 0 && (
        <section
          aria-labelledby="judul-produk-terkait"
          className="flex flex-col gap-5 border-t border-garis py-8"
        >
          <h2 id="judul-produk-terkait" className="text-xl font-bold">
            Produk terkait
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {produkTerkait.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
