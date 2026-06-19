// Minimal service worker: caches the app shell so it installs + opens offline.
const CACHE = "shorts-trigger-v5";
const SHELL = ["./", "./index.html", "./manifest.webmanifest",
               "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // Never cache GitHub API calls; always hit the network for those.
  if (url.hostname === "api.github.com") return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
