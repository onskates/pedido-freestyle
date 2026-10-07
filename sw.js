// Permite instalar la web como app. No guarda nada en caché:
// siempre carga la versión más reciente del formulario.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => e.respondWith(fetch(e.request)));
