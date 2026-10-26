/* KashKool Mobile service worker: safe network-first page caching. */
const CACHE_NAME = 'kashkool-mobile-v40-shell';
const SHELL = ['./', './index.html', './kashkool.webmanifest'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('kashkool-mobile-') && key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(fetch(req).then(response => {
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
    }
    return response;
  }).catch(() => caches.match(req).then(cached => cached || caches.match('./index.html'))));
});
