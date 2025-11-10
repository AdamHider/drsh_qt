/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config file > pwa > workboxMode is set to "InjectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'

self.skipWaiting()
clientsClaim()

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

// Non-SSR fallbacks to index.html
// Production SSR fallbacks to offline.html (except for dev)
if (process.env.MODE !== 'ssr' || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      { denylist: [new RegExp(process.env.PWA_SERVICE_WORKER_REGEX), /workbox-(.)*\.js$/] }
    )
  )
}
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'Новое уведомление';
  const options = {
      body: data.body || 'Кликните, чтобы узнать больше.',
      icon: data.icon || '/icons/icon-128x128.png',
      badge: '/icons/badge.png',
      data: {
          url: data.data.url || '/'
      }
  };
  event.waitUntil(
      self.registration.showNotification(title, options)
  );
});
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data.url || '/';
  event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
          let matchingClient = null;
          for (let i = 0; i < windowClients.length; i++) {
              const client = windowClients[i];
              if (client.url.includes(self.location.origin)) {
                  matchingClient = client;
                  break;
              }
          }
          if (matchingClient) {
              return matchingClient.navigate(targetUrl).then(client => client.focus());
          } else {
              return clients.openWindow(targetUrl);
          }
      })
  );
});
