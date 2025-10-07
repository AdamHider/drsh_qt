import { register } from 'register-service-worker'

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready () {
    console.log('PWA готово к работе 🚀')
  },

  registered () {
    console.log('Сервис-воркер зарегистрирован')
  },

  cached () {
    console.log('Контент закэширован для оффлайн-режима')
  },

  updatefound () {
    console.log('Найдена новая версия, загружаем…')
  },

  updated (registration) {
    console.log('Доступно новое содержимое. Service Worker ожидает активации.')
    // 1. Отправляем кастомное событие в Window,
    //    передавая объект ServiceWorkerRegistration (SW)
    window.dispatchEvent(
      new CustomEvent('swUpdated', { detail: registration })
    )
  },

  offline () {
    console.log('Нет соединения, работает оффлайн 🌐')
  },

  error (err) {
    console.error('Ошибка при регистрации сервис-воркера:', err)
  }
})
