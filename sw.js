const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    "/matrix/",
    "/matrix/controls.js",
    "/matrix/favicons",
    "/matrix/favicons/android-chrome-192x192.png",
    "/matrix/favicons/android-chrome-256x256.png",
    "/matrix/favicons/android-chrome-512x512.png",
    "/matrix/favicons/apple-touch-icon.png",
    "/matrix/favicons/browserconfig.xml",
    "/matrix/favicons/favicon-16x16.png",
    "/matrix/favicons/favicon-32x32.png",
    "/matrix/favicons/favicon.ico",
    "/matrix/favicons/mstile-150x150.png",
    "/matrix/favicons/safari-pinned-tab.svg",
    "/matrix/index.html",
    "/matrix/logo.png",
    "/matrix/logo.svg",
    "/matrix/main.css",
    "/matrix/main.js",
    "/matrix/manifest.json",
    "/matrix/sortandpop.js",
    "/matrix/utils.js",
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