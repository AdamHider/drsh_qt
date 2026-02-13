/* eslint-env serviceworker */
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

// 1. Сразу сообщаем браузеру, что мы живы
self.skipWaiting()
clientsClaim()

// 2. Прекэш (обязательно для Quasar)
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// 3. Простейший обработчик Push
self.addEventListener('push', (event) => {
  console.log('Пуш получен!', event);
  const data = event.data ? event.data.json() : { title: 'Тест', body: 'Проверка' };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-128x128.png'
    })
  );
});

// 4. Простейший клик
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
