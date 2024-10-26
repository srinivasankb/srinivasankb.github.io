const CACHE_NAME = 'calculator-cache-v1';
const urlsToCache = [
    '/',
    '/index.html', // Update this if your HTML file has a different name
    '/manifest.json',
    '/style.css',   // Add your CSS file(s) if separate
    '/script.js'    // If you have a separate JS file, add it here
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return the response from the cached version
                if (response) {
                    return response;
                }
                return fetch(event.request); // Fall back to network
            })
    );
});
