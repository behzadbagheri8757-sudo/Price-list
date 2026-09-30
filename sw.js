const CACHE = 'bagheri-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
];

/* نصب: هر فایل جدا کش می‌شه تا اگه یکیش نبود بقیه نجات پیدا کنن */
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(
      ASSETS.map(url => cache.add(url).catch(() => {}))
    );
    self.skipWaiting();
  })());
});

/* فعال‌سازی: کش‌های قدیمی پاک می‌شن */
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    );
    self.clients.claim();
  })());
});

/* واکشی: اول کش، بعد شبکه */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
