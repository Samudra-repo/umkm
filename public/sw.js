self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Biarkan permintaan berjalan normal lewat jaringan agar data katalog dan sesi admin selalu terbaru.
});
