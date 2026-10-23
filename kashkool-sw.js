/* KashKool v38 offline app shell. */
'use strict';
const CACHE_NAME = 'kashkool-shell-v38';
const BASE_URL = self.registration.scope;
const SHELL_URLS = [
  BASE_URL,
  new URL('index.html', BASE_URL).href,
  new URL('kashkool.webmanifest', BASE_URL).href,
  new URL('kashkool-icon-192.png', BASE_URL).href,
  new URL('kashkool-icon-512.png', BASE_URL).href
];
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL_URLS);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('kashkool-shell-') && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(new URL('index.html', BASE_URL).href, response.clone());
        }
        return response;
      } catch (_) {
        return (await caches.match(request)) || (await caches.match(new URL('index.html', BASE_URL).href)) || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch (_) {
      return Response.error();
    }
  })());
});
