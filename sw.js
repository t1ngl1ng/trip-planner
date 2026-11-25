// Offline cache for the Japan Trip Planner. Bump VERSION when you upload a new index.html.
const VERSION = 'jtp-v2';
const SHARE = 'jtp-share'; // holds a plan shared into the app until the page picks it up
const QR = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(async c => {
    await c.addAll(CORE);
    try { await c.add(QR); } catch (err) { /* optional */ }
  }).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== SHARE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // "Share to Japan Trip" from WhatsApp etc. (see share_target in manifest.webmanifest)
  if (req.method === 'POST' && new URL(req.url).pathname.endsWith('/share-target')) {
    e.respondWith((async () => {
      const fd = await req.formData();
      const f = fd.get('plan');
      const text = f && typeof f !== 'string' ? await f.text() : [fd.get('text'), fd.get('url')].filter(Boolean).join(' ');
      await (await caches.open(SHARE)).put('shared-plan', new Response(text));
      return Response.redirect(new URL('./index.html#shared', self.registration.scope).href, 303);
    })());
    return;
  }
  if (req.method !== 'GET') return;
  // Pages: try the network first (to pick up new versions), fall back to the cached copy offline.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req.url, { cache: 'no-cache' }).then(res => {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  // Everything else: cache first.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  })));
});
