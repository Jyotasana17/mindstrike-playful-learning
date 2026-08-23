const CACHE_NAME = 'mindstrike-shell-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Try network first for navigation requests, fallback to cache.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Update cache in background
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/')))
    );
    return;
  }

  // For other requests, respond from cache then network.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
