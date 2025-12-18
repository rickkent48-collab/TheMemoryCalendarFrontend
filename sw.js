// Service Worker for The Memory Calendar PWA
const CACHE_VERSION = 'tmc-v1';
const CORE_CACHE_NAME = `${CACHE_VERSION}-core`;
const IMAGE_CACHE_NAME = `${CACHE_VERSION}-images`;

// Files to precache (core app shell)
const CORE_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/app-icon-512.png'
];

// Install event - precache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE_NAME)
      .then((cache) => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('tmc-') && name !== CORE_CACHE_NAME && name !== IMAGE_CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Exclude Stripe and external checkout endpoints from caching
  if (url.hostname.includes('stripe.com') || 
      url.hostname.includes('checkout') ||
      url.pathname.includes('/api/checkout') ||
      url.origin !== self.location.origin) {
    return; // Let the browser handle these normally
  }

  // Navigation requests (HTML pages) - network first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match('./index.html');
        })
    );
    return;
  }

  // Image requests - stale-while-revalidate strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME)
        .then((cache) => {
          return cache.match(request)
            .then((cachedResponse) => {
              const fetchPromise = fetch(request)
                .then((networkResponse) => {
                  // Update cache with fresh response
                  cache.put(request, networkResponse.clone());
                  return networkResponse;
                })
                .catch(() => cachedResponse); // Fallback to cached on network error

              // Return cached response immediately if available, otherwise wait for network
              return cachedResponse || fetchPromise;
            });
        })
    );
    return;
  }

  // Other requests - cache first, network fallback
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request);
      })
  );
});
