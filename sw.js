const VERSION = "2026-10-15";
const CACHE = `lotd-${VERSION}`;
const APP_SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-512.png", "./game.js", "./extras.js"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function cacheResponse(request, response) {
  if (!response || !response.ok) return response;
  const copy = response.clone();
  caches.open(CACHE).then(cache => cache.put(request, copy));
  return response;
}

function networkFirst(request) {
  const network = fetch(request).then(response => cacheResponse(request, response));
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("network-timeout")), 3000));
  return Promise.race([network, timeout]).catch(() => caches.match(request).then(cached => cached || caches.match("./index.html")));
}

function staleWhileRevalidate(request) {
  const cached = caches.match(request);
  const network = fetch(request).then(response => cacheResponse(request, response)).catch(() => undefined);
  return cached.then(response => response || network);
}

self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;   // o.a. Supabase: nooit cachen
  if (url.pathname.endsWith("/lineup.json")) return;                              // altijd vers van het netwerk (app regelt offline zelf)
  const p = url.pathname;
  if (request.mode === "navigate" || p.endsWith("/index.html") || p.endsWith("/game.js") || p.endsWith("/extras.js")) {
    event.respondWith(networkFirst(request));                                     // code: altijd nieuwste, cache alleen als offline-fallback
    return;
  }
  event.respondWith(staleWhileRevalidate(request));
});
