// Offline: guarda o app no aparelho e atualiza em segundo plano (vale na próxima abertura).
const CACHE = 'calc-v10';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/favicon.svg', './icons/favicon-32.png', './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png',
  './fonts/syne-latin-400-normal.woff2', './fonts/syne-latin-600-normal.woff2', './fonts/syne-latin-700-normal.woff2', './fonts/syne-latin-800-normal.woff2',
  './fonts/dm-mono-latin-300-normal.woff2', './fonts/dm-mono-latin-400-normal.woff2', './fonts/dm-mono-latin-500-normal.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Avisa o app quando chegou versão nova do index.html (ele mostra "Nova versão disponível").
let pend = false;
const tag = r => r ? (r.headers.get('etag') || r.headers.get('last-modified') || '') : '';
const tell = () => self.clients.matchAll({ type: 'window' }).then(cs => cs.forEach(c => c.postMessage({ t: 'upd' })));
self.addEventListener('message', e => { if (e.data && e.data.t === 'chk' && pend && e.source) e.source.postMessage({ t: 'upd' }); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  const font = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!same && !font) return;
  const doc = same && (req.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname));
  if (req.mode === 'navigate') pend = false;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req, { ignoreSearch: same });
    const net = fetch(req).then(async r => {
      if (r && (r.ok || r.type === 'opaque')) {
        const novo = doc && hit && tag(hit) && tag(r) && tag(hit) !== tag(r);
        await c.put(req, r.clone());
        if (novo) { pend = true; tell(); }
      }
      return r;
    }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const r = await net;
    return r || (req.mode === 'navigate' ? c.match('./index.html') : Response.error());
  }));
});
