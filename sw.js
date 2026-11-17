// Service Worker: เก็บไฟล์ของแอปไว้ในเครื่องเพื่อใช้ออฟไลน์
// ถ้าแก้ไข index.html ภายหลัง ให้เปลี่ยนเลขเวอร์ชันด้านล่าง (v1 -> v2) เพื่อให้เครื่องโหลดไฟล์ใหม่
const CACHE = 'datacollector-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit || fetch(e.request).catch(() => caches.match('./index.html'))
    )
  );
});
