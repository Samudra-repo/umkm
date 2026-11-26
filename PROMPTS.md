# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:** Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:** Membuat koneksi Supabase untuk server di `lib/supabase/server.js` (`buatSupabaseServer`) menggunakan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY`. Mengubah `app/page.jsx` menjadi Server Component dinamis (`force-dynamic`) untuk mengambil data dari tabel `produk`, menampilkannya memakai `KartuProduk`, menampilkan pesan error bila gagal atau `"Belum ada produk"` bila kosong, dan menghapus `CatatanBelumAktif`.

**Perbaikan:** Saat diuji muncul pesan error `"Gagal mengambil daftar produk dari database. Coba muat ulang halaman atau periksa tabel produk di Supabase."` karena `SUPABASE_URL` di `.env.local` berisi akhiran `/rest/v1/`. Nilai `SUPABASE_URL` di `.env.local` diperbaiki menjadi URL proyek utama dan `lib/supabase/server.js` dinormalisasi dengan `new URL(rawUrl).origin` tanpa mengubah tampilan.

## US-02 Detail produk

**Prompt:** Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:** Mengubah `app/produk/[id]/page.jsx` menjadi halaman dinamis (`force-dynamic`) yang membaca `id` lewat `await params`, memvalidasi `id` numerik, mengambil data produk dari tabel `produk` di Supabase melalui `buatSupabaseServer()` di `lib/supabase/server.js`, memanggil `notFound()` bila produk tidak ada, mempertahankan tampilan dan komponen `TombolWhatsApp`, serta menghapus `CatatanBelumAktif`.

**Perbaikan:** -

## US-03 Pesan via WhatsApp

**Prompt:** Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:** Mengubah `components/TombolWhatsApp.jsx` menjadi tag `<a>` yang mengarah ke `https://wa.me/<nomor>?text=<pesan>` menggunakan `toko.nomorWhatsApp` dari `lib/toko.js` dan `formatRupiah(produk.harga)` dari `lib/format.js`, di-encode dengan `encodeURIComponent`, dibuka di tab baru (`target="_blank" rel="noopener noreferrer"`), dengan tampilan tombol yang tetap sama. `CatatanBelumAktif` di `app/produk/[id]/page.jsx` sudah tidak ada (dihapus saat US-02).

**Perbaikan:** -

## US-04 Login admin

**Prompt:** Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:** Menambahkan `buatSupabaseSesi()` berbasis `@supabase/ssr` dan cookie di `lib/supabase/server.js`, membuat Server Action `loginAdmin` dan `keluarAdmin` di `app/admin/actions.js`, menyambungkan form login di `app/admin/login/page.jsx` dengan `useActionState` (beserta pesan error dan penghapusan `CatatanBelumAktif`), serta menyambungkan tombol "Keluar" di `components/NavAdmin.jsx` ke `keluarAdmin` tanpa mengubah tampilan.

**Perbaikan:** -

## US-05 Ganti password

**Prompt:** Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:** Menambahkan Server Action `gantiPassword` di `app/admin/actions.js` yang memeriksa sesi login admin lewat `supabase.auth.getUser()`, memvalidasi password baru minimal 8 karakter dan sama dengan konfirmasi di server, lalu memanggil `supabase.auth.updateUser({ password })`. Membuat `app/admin/password/FormGantiPassword.jsx` dengan `useActionState` untuk menampilkan pesan berhasil atau error, menyambungkannya ke `app/admin/password/page.jsx` tanpa mengubah tampilan, dan menghapus `CatatanBelumAktif`.

**Perbaikan:** -

## US-06 Proteksi halaman admin

**Prompt:** Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:** Membuat `proxy.js` di root proyek (`export async function proxy(request)` dengan `matcher: ["/admin/:path*"]`) yang memeriksa sesi login Supabase Auth lewat `supabase.auth.getUser()` untuk seluruh rute `/admin` kecuali `/admin/login`, dan mengalihkan ke `/admin/login` bila belum login. Memisahkan helper `ambilUrlSupabase()` ke `lib/supabase/url.js`, memastikan pemeriksaan login (`periksaAdminLogin()`) dijalankan di awal Server Action pengubah data (`gantiPassword`) di `app/admin/actions.js`, dan menghapus `CatatanBelumAktif` dari `app/admin/page.jsx`.

**Perbaikan:** -

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

### Perbaikan error koneksi katalog ke Supabase (US-01)

**Prompt [SENDIRI]:** muncul error ini dalam katalog: Gagal mengambil daftar produk dari database. Coba muat ulang halaman atau periksa tabel produk di Supabase. perbaiki tanpa merubah tampilan

**Hasil:** Penyebabnya adalah nilai `SUPABASE_URL` di `.env.local` memiliki akhiran `/rest/v1/`, sehingga `@supabase/supabase-js` mengakses path yang salah (`/rest/v1/rest/v1/produk`).

**Perbaikan:** Menghapus akhiran `/rest/v1/` pada `SUPABASE_URL` di `.env.local` dan menormalisasi `SUPABASE_URL` dengan `new URL(rawUrl).origin` (serta `.trim()`) di `lib/supabase/server.js` tanpa mengubah tampilan di `app/page.jsx` maupun `components/KartuProduk.jsx`.

### US-11 Filter kategori atau pencarian

**Prompt:** Sebagai pengunjung, saya ingin menyaring produk berdasarkan kategori atau mencari nama produk.

**Hasil:** Memperbarui `app/page.jsx` agar membaca parameter URL `kategori` dan `cari` melalui `await searchParams`, menyaring query Supabase di sisi server (`.eq("kategori", ...)` dan `.ilike("nama", ...)`), mengambil daftar kategori unik dari tabel `produk`, serta menampilkan form pencarian (memakai komponen `Input` dan `Tombol`) dan tombol filter kategori plus tombol reset tanpa mengubah tampilan `KartuProduk`.

**Perbaikan:** -

### US-12 Pilih jumlah atau varian

**Prompt:** Sebagai pengunjung, saya ingin memilih jumlah atau varian sebelum memesan, dan pilihan itu ikut tertulis di pesan WhatsApp.

**Hasil:** Memperbarui `components/TombolWhatsApp.jsx` (`"use client"`) untuk menambahkan pemilih jumlah pesanan (`-`, input angka minimal `1`, `+`), kolom opsional `Varian / catatan`, tampilan total harga dinamis, serta menyertakan jumlah, varian/catatan (jika diisi), dan total harga di dalam pesan WhatsApp yang di-encode ke tautan `https://wa.me/`.

**Perbaikan:** -

### US-13 PWA

**Prompt:** Sebagai pengunjung, saya ingin memasang katalog di layar HP seperti aplikasi. Ikon tersedia di `public/icons`.

**Hasil:** Membuat web app manifest di `app/manifest.js` (otomatis tertaut sebagai `/manifest.webmanifest`) yang merujuk ikon `/icons/icon-192.png` dan `/icons/icon-512.png` dengan `display: "standalone"` dan identitas toko dari `lib/toko.js`, menambahkan `public/sw.js` dan `app/PwaRegister.jsx` untuk pendaftaran service worker, serta melengkapi `metadata` (ikon dan dukungan `appleWebApp`) dan `viewport.themeColor` di `app/layout.jsx`.

**Perbaikan:** -

### US-14 Deskripsi produk dibuat AI

**Prompt:** Sebagai admin, saya ingin membuat deskripsi produk secara otomatis dengan AI (Gemini API) dari nama dan kategori produk.

**Hasil:** Menambahkan Server Action `buatDeskripsiAI` di `app/admin/actions.js` yang memeriksa login admin lewat `periksaAdminLogin()`, memanggil Gemini API (`gemini-2.5-flash`) dari server menggunakan `GEMINI_API_KEY` (tanpa terekspos ke browser), serta memperbarui `components/FormProduk.jsx` dengan tombol **Buat deskripsi dengan AI** yang mengisi kolom deskripsi sebelum produk disimpan. Menambahkan `GEMINI_API_KEY=` di `.env.example`.

**Perbaikan:** -

### US-15 Urutkan produk

**Prompt:** Sebagai pengunjung, saya ingin mengurutkan produk, supaya cepat menemukan yang murah atau yang terbaru.

**Hasil:** Memperbarui `app/page.jsx` dengan mapping `URUTAN_PRODUK` (`terbaru`, `termurah`, `termahal`) yang membaca parameter URL `urut`, menerapkan `.order(...)` langsung pada query Supabase di server, dan menampilkan tombol pilihan urutan (`Terbaru`, `Termurah`, `Termahal`) sambil mempertahankan filter kategori dan pencarian.

**Perbaikan:** -

### US-16 Paginasi atau muat lebih banyak

**Prompt:** Sebagai pengunjung, saya ingin daftar produk tidak terlalu panjang, supaya halaman cepat dibuka.

**Hasil:** Memperbarui `app/page.jsx` untuk membatasi jumlah produk per halaman (`PRODUK_PER_HALAMAN = 12`) langsung di query Supabase menggunakan `{ count: "exact" }` dan `.range(awal, akhir)`, membaca parameter URL `halaman`, menghitung jumlah halaman total, mengarahkan ke halaman terakhir bila nomor halaman melebihi batas, serta menampilkan navigasi halaman (**Sebelumnya**, nomor halaman, **Berikutnya**) yang tetap menjaga filter, pencarian, dan urutan.

**Perbaikan:** -

### US-17 Produk terkait di halaman detail

**Prompt:** Sebagai pengunjung, saya ingin melihat produk lain yang mirip, supaya saya punya pilihan lain.

**Hasil:** Memperbarui `app/produk/[id]/page.jsx` untuk mengambil maksimal 3 produk lain dari tabel `produk` di Supabase dengan kategori yang sama (`.eq("kategori", produk.kategori)`) dan mengecualikan produk yang sedang dibuka (`.neq("id", produk.id)`), lalu menampilkannya di bagian **Produk terkait** menggunakan komponen `KartuProduk`.

**Perbaikan:** -
