import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

self.skipWaiting()
clientsClaim()

// Предзагрузка ресурсов (критично для WebAPK)
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Обработка входящего PUSH
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  if (!data.title) return;

  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/icon-128x128.png',
    badge: '/icons/badge-72x72.png', // Слева в статус-баре
    vibrate: [200, 100, 200],
    tag: data.tag || 'mektepium-notification', // Группировка
    renotify: true,
    data: {
      // Сохраняем URL из PHP, чтобы использовать его при клике
      url: data.data?.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Обработка КЛИКА по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 1. Пытаемся найти уже открытое окно нашего приложения
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus().then((c) => {
            // Если нужно перейти на конкретную страницу внутри уже открытого приложения
            if (targetUrl && c.url !== targetUrl) return c.navigate(targetUrl);
          });
        }
      }
      // 2. Если приложение закрыто — открываем новую вкладку/окно
      if (clients.openWindow) {
        return clients.openWindow(targetUrl || '/');
      }
    })
  );
});
