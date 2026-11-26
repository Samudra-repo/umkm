-- Migrasi US-19: Status stok produk
-- Jalankan di Supabase > SQL Editor > New query > tempel isi file ini > Run.
alter table public.produk
  add column if not exists stok integer not null default 10 check (stok >= 0);
