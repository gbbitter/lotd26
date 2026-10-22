const VERSION = "2026-10-25-28";
const CACHE = `lotd-${VERSION}`;
const APP_SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-512.png", "./icon-192.png", "./apple-touch-icon.png", "./game.js", "./extras.js", "./theme.css",
  "./fonts/barlow-latin-400-normal.woff2", "./fonts/barlow-latin-500-normal.woff2", "./fonts/barlow-latin-600-normal.woff2", "./fonts/barlow-latin-700-normal.woff2",
  "./fonts/barlow-condensed-latin-600-normal.woff2", "./fonts/barlow-condensed-latin-700-normal.woff2", "./fonts/barlow-condensed-latin-800-normal.woff2"];
/* Zuinig met requests: alles uit de cache, nieuwe versies komen binnen via een nieuwe sw.js (VERSION ophogen bij elke deploy).
   Vangnet als VERSION ooit vergeten wordt: code-bestanden ouder dan REVALIDATE worden op de achtergrond ververst. */
const REVALIDATE = 6 * 3600 * 1000;
const CODE = /\/(index\.html|game\.js|extras\.js|theme\.css)$/;

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(APP_SHELL.map(u => new Request(u, { cache: "reload" }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function store(key, response) {
  if (!response || !response.ok || response.type === "opaque") return response;
  const copy = response.clone();
  caches.open(CACHE).then(cache => cache.put(key, copy)).catch(() => {});
  return response;
}
const age = res => { const d = Date.parse(res.headers.get("date") || ""); return isNaN(d) ? Infinity : Date.now() - d; };
function refresh(key) { return fetch(key, { cache: "no-cache" }).then(r => store(key, r)).catch(() => undefined); }

/* cache-first; bij een cache-miss het netwerk; code ouder dan 6 uur stil verversen voor de volgende keer */
function cacheFirst(request, key, isCode) {
  return caches.match(key, { ignoreSearch: true }).then(cached => {
    if (cached) { if (isCode && age(cached) > REVALIDATE) refresh(key); return cached; }
    return fetch(request).then(r => store(key, r)).catch(() => caches.match("./index.html"));
  });
}

self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;   // o.a. Supabase, kaarttegels: nooit via de SW
  const p = url.pathname;
  if (p.startsWith("/api/") || p.endsWith("/lineup.json") || p.endsWith("/food.json") || p.endsWith("/sw.js")) return; // altijd vers van het netwerk
  if (request.mode === "navigate") { event.respondWith(cacheFirst(request, "./index.html", true)); return; }
  event.respondWith(cacheFirst(request, request, CODE.test(p)));
});
