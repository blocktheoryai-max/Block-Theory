// Service Worker for Block Theory PWA
const CACHE_NAME = 'block-theory-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/offline.html'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone response before caching
        const responseToCache = response.clone();
        
        if (response.status === 200) {
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
        }
        
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request)
          .then(response => response || caches.match('/offline.html'));
      })
  );
});

// Background sync for rewards claiming
self.addEventListener('sync', event => {
  if (event.tag === 'claim-rewards') {
    event.waitUntil(
      // Retry claiming rewards when connection is restored
      fetch('/api/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    );
  }
});

// Push notifications for competitions
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New competition starting soon!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: 'Join Competition', icon: '/icon-192.png' },
      { action: 'close', title: 'Close', icon: '/icon-192.png' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Block Theory', options)
  );
});