const CACHE_NAME = 'my-site-cache-v1';
const OFFLINE_URL = 'offline.html';

// List all the assets to pre-cache when the service worker is installed
const urlsToCache = [
  '/', // The root page
  OFFLINE_URL,
  '/index.html',
  '/styles/main.css', // Replace with your actual CSS file
  '/scripts/app.js' // Replace with your actual JavaScript file
];

// Install event: caches the essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serves cached content when offline
self.addEventListener('fetch', event => {
  // Only handle GET requests for navigation and assets
  if (event.request.method === 'GET' && event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Serve the offline page if the network is unavailable
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    // For other requests (like images, JS, CSS), try network first, then cache
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});
