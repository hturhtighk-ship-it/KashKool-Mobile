/* KashKool offline shell. Local timers continue in the desktop tray build. */
const CACHE_NAME = 'kashkool-shell-v70';
const SHELL_FILES = [
  './',
  './index.html',
  './kashkool.webmanifest',
  './assets/css/kashkool.css',
  './assets/js/00-bootstrap.js',
  './assets/js/01-app-core.js',
  './assets/js/02-motion-v2-js.js',
  './assets/js/03-motion-v3-js.js',
  './assets/js/04-motion-v4-js.js',
  './assets/js/05-goal-v5-js.js',
  './assets/js/06-visual-v6-js.js',
  './assets/js/07-visual-v7-js.js',
  './assets/js/08-visual-v8-js.js',
  './assets/js/09-visual-v9-js.js',
  './assets/js/10-v25-js.js',
  './assets/js/11-v27-js.js',
  './assets/js/12-theme-studio-js.js',
  './assets/js/13-v29-search-language.js',
  './assets/js/14-theme-motion-v33.js',
  './assets/js/15-v35-motion-studio-js.js',
  './assets/js/16-v36-structural-theme-controller.js',
  './assets/js/17-v37-complete.js',
  './assets/js/18-cloud-accounts-v1.js',
  './assets/js/19-v42-theme-interactions.js',
  './assets/js/20-v43-theme-motion-js.js',
  './assets/js/21-v44-focus-js.js',
  './assets/js/22-theme-secrets-js.js',
  './assets/js/23-learning-os-v50-js.js',
  './assets/js/24-frost-theme-v2-js.js',
  './assets/js/25-v53-frost-ember-cinematic-js.js',
  './assets/js/26-v55-fire-anime-overhaul-js.js',
  './assets/js/27-v56-anime-skybreaker-js.js',
  './assets/js/28-v61-emberfire-laheeb-js.js',
  './assets/js/29-v64-desktop-theme-motion-bridge.js',
  './assets/js/30-v65-secret-manga-js.js',
  './assets/js/31-v69-focus-multi-comments-js.js',
  './assets/js/32-v68-official-image-fallback.js',
  './assets/js/99-notifications.js',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('kashkool-shell-') && key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(request).then(response => {
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  }).catch(() => caches.match(request).then(cached => cached || caches.match('./index.html'))));
});
