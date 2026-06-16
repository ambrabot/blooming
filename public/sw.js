// Blooming service worker — CONSERVADOR.
// Só cacheia estáticos imutáveis do Next (/_next/static) + ícones.
// NUNCA cacheia HTML/navegação/API/auth → conteúdo logado/dinâmico sempre fresco (app é SSR + JWT).
const CACHE = "blooming-static-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  // cache-first apenas para assets imutáveis (hashed) + ícones; o resto segue rede (default)
  if (/\/_next\/static\/|\/icons\//.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then((cached) =>
        cached ||
        fetch(e.request).then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return resp;
        })
      )
    );
  }
});
