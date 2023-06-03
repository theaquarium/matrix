const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    ".",
    "./controls.js",
    "./favicons",
    "./favicons/android-chrome-192x192.png",
    "./favicons/android-chrome-256x256.png",
    "./favicons/android-chrome-512x512.png",
    "./favicons/apple-touch-icon.png",
    "./favicons/browserconfig.xml",
    "./favicons/favicon-16x16.png",
    "./favicons/favicon-32x32.png",
    "./favicons/favicon.ico",
    "./favicons/mstile-150x150.png",
    "./favicons/safari-pinned-tab.svg",
    "./index.html",
    "./logo.png",
    "./logo.svg",
    "./main.css",
    "./main.js",
    "./manifest.json",
    "./sortandpop.js",
    "./utils.js",
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
    );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return caches.open(RUNTIME).then(cache => {
                return fetch(event.request).then(response => {
                    // Put a copy of the response in the runtime cache.
                    return cache.put(event.request, response.clone()).then(() => {
                        return response;
                    });
                });
            });
        })
    );
});