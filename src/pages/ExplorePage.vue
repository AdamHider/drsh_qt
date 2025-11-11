<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md" reveal>
        <q-toolbar-title><b>Открытия</b></q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white"  style="padding-top: 50px; padding-bottom: 48px;">
        <q-inner-loading :showing="notLoaded">
          <q-spinner-puff size="50px" color="primary" />
        </q-inner-loading>
        <DailyLessonSlider slidesPerView="2.7"/>
        <DailyLessonSlider slidesPerView="2.3"/>

    </q-page>
  </q-page-container>
</template>

<script setup >
import { ref, onMounted, onActivated } from 'vue'
import { api } from '../services/index'
import DailyLessonList from '../components/DailyLessonList.vue'
import DailyLessonSlider from '../components/DailyLessonSlider.vue'

const notifications = ref([])
const error = ref({})
const notLoaded = ref(true)

const load = async function () {
  const notificationListResponse = await api.notifications.getList({})
  notLoaded.value = false
  if (notificationListResponse.error) {
    error.value = notificationListResponse
    return []
  }
  notifications.value = notificationListResponse
}

onMounted(() => {
  load()
})

onActivated(() => {
  load()
})

</script>
