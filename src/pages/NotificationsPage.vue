<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-toolbar-title><b>Уведомления</b></q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white"  style="padding-top: 50px; padding-bottom: 48px;">
        <q-inner-loading :showing="notLoaded">
          <q-spinner-puff size="50px" color="primary" />
        </q-inner-loading>
        <q-list v-if="notifications.length > 0" class="q-my-md"  >
          <q-item v-for="(notification, notificationIndex) in notifications" :key="`notificationIndex-${notificationIndex}`" :to="notification.link">
            <q-item-section>
              <q-card class="q-push">
                <q-card-section>
                  <q-item-label caption>{{ notification.time_ago	}}</q-item-label>
                  <q-item-label class="text-subtitle1"><b>{{ notification.data.title }}</b></q-item-label>
                  <q-item-label class="text-caption">{{ notification.data.description }}</q-item-label>
                </q-card-section>
              </q-card>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else-if="!notLoaded" class="text-center q-pa-md">
          <div class="text-subtitle1"><b>Уведомлений пока нет</b></div>
          <div class="text-caption"><b>Но они обязательно появятся</b></div>
        </div>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { ref, onMounted, onActivated } from 'vue'
import { api } from '../services/index'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

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
