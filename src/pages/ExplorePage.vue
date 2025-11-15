<template>
  <q-page-container>
    <q-app-header class="transparent text-white rounded-b-md" reveal>
        <q-toolbar-title><b>Открытия</b></q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white"  style="padding-top: 50px; padding-bottom: 48px;">
      <div class="page-background fixed-top full-width"  style="height: 300px; background-image: url('https://core.mektepium.com/image/index.php/backgrounds/daily_chat_1.jpg'); background-size: cover;"></div>
      <q-card class="text-center transparent no-shadow full-width justify-center column " style="position: relative;">
          <q-card-section class="text-white text-left flex flex-no-wrap items-center q-pa-none q-pt-md">
            <div class="col">
            </div>
            <div class="col q-pa-sm"  style="text-shadow: 2px 2px 5px black;">
              <div class="text-h6"><b>Лаборатория</b></div>
              <div class="text-caption">Только вверх, к звёздам!</div>
            </div>
          </q-card-section>
      </q-card>
      <q-card flat class="q-main-card relative text-left q-pt-md q-pb-md rounded-borders rounded-b-0 full-width" style="flex: 1;">
        <q-card-section class="q-px-none" style="margin-top: -50px">
          <DailyLessonSlider label="" :slidesPerView="2.8" type="daily"/>
        </q-card-section>
        <q-inner-loading :showing="notLoaded">
          <q-spinner-puff size="50px" color="primary" />
        </q-inner-loading>
        <q-card flat>
          <q-card-section class="q-pa-none">
            <ExploreLessonList label="" :slidesPerView="2.5"/>
          </q-card-section>
        </q-card>

        </q-card>

    </q-page>
  </q-page-container>
</template>

<script setup >
import { ref, onMounted, onActivated } from 'vue'
import { api } from '../services/index'
import DailyLessonSlider from '../components/DailyLessonSlider.vue'
import ExploreLessonList from '../components/ExploreLessonList.vue'

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
