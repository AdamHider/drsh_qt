<template>
  <q-dialog v-model="updateAvailable" position="top" seamless style="z-index: 100000">
    <div class="full-width text-center">
      <q-card class="q-push q-ma-sm" style="max-width: 350px">
        <q-card-section class="q-pa-xs">
          <q-item class="text-left">
            <q-item-section>
              <q-item-label class="text-subtitle1"><b>Обновимся?</b></q-item-label>
              <q-item-label class="text-caption">Рекомендуем обновить приложение, чтобы получить последние функции и исправления.</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat @click="applyUpdate"  color="primary"><b>Да</b></q-btn>
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </div>
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
  setTimeout(() => {
    updateAvailable.value = false
  }, 5000)
})
onUnmounted(() => {
  window.removeEventListener('swUpdated', handleSWUpdated)
  setTimeout(() => {
    updateAvailable.value = false
  }, 5000)
})
</script>
