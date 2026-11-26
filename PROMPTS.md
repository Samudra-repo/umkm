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

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

### Perbaikan error koneksi katalog ke Supabase (US-01)

**Prompt [SENDIRI]:** muncul error ini dalam katalog: Gagal mengambil daftar produk dari database. Coba muat ulang halaman atau periksa tabel produk di Supabase. perbaiki tanpa merubah tampilan

**Hasil:** Penyebabnya adalah nilai `SUPABASE_URL` di `.env.local` memiliki akhiran `/rest/v1/`, sehingga `@supabase/supabase-js` mengakses path yang salah (`/rest/v1/rest/v1/produk`).

**Perbaikan:** Menghapus akhiran `/rest/v1/` pada `SUPABASE_URL` di `.env.local` dan menormalisasi `SUPABASE_URL` dengan `new URL(rawUrl).origin` (serta `.trim()`) di `lib/supabase/server.js` tanpa mengubah tampilan di `app/page.jsx` maupun `components/KartuProduk.jsx`.
