<template>
  <q-dialog v-model="updateAvailable" persistent>
    <q-card class="q-push">
      <q-card-section>
        <div class="text-h6">Доступна новая версия!</div>
        <div class="text-subtitle2">Рекомендуем обновить приложение, чтобы получить последние функции и исправления.</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat v-close-popup ><b>Позже</b></q-btn>
        <q-btn flat @click="applyUpdate" color="primary"><b>Обновить сейчас</b></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const updateAvailable = ref(false)
let swRegistration = null

const handleSWUpdated = (event) => {
  swRegistration = event.detail
  updateAvailable.value = true
}

const applyUpdate = () => {
  if (!swRegistration || !swRegistration.waiting) {
    window.location.reload()
    return
  }
  // Отправляем сообщение ожидающему SW, чтобы он пропустил стадию ожидания
  swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
  // Важно: сразу же после сообщения перезагрузить страницу
  // Слушатель для события 'controllerchange' гарантирует, что перезагрузка
  // произойдет только после активации нового SW.
  swRegistration.addEventListener('controllerchange', () => {
    window.location.reload()
  })
  // Если событие не сработало (иногда бывает), просто перезагружаем
  window.location.reload()
}
onMounted(() => {
  window.addEventListener('swUpdated', handleSWUpdated)
})
onUnmounted(() => {
  window.removeEventListener('swUpdated', handleSWUpdated)
})
</script>
