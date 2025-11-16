<template>
  <q-page-container>
    <q-app-header class="transparent text-white rounded-b-md q-py-xs" reveal>
        <q-toolbar-title><b>Открытия</b></q-toolbar-title>
        <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.energy" dense no-caption size="24px" push
          @click="() => {if(user.active?.data.resources.energy.quantity == 0) router.push('/market')}"/>
    </q-app-header>
    <q-page class="bg-white"  style="padding-top: 50px; padding-bottom: 48px;">
      <div class="page-background fixed-top full-width"  style="height: 300px; background-image: url('https://core.mektepium.com/image/index.php/backgrounds/daily_chat_1.jpg'); background-size: cover;"></div>
      <q-card class="text-center transparent no-shadow full-width justify-center column " style="position: relative;">
          <q-card-section class="text-white text-left q-py-none"  style="text-shadow: 2px 2px 5px black;">
            <div class="text-subtitle1"><b>Ежедневные планеты</b></div>
          </q-card-section>
          <q-card-section class="q-pa-none" >
            <DailyLessonSlider :slidesPerView="3.5" type="daily"/>
          </q-card-section>
      </q-card>
      <q-card flat class="q-main-card relative text-left q-pt-md q-pb-md rounded-borders rounded-b-0 full-width" style="flex: 1; margin-top: 30px;">
        <q-tabs
          v-model="tab"
          dense
          content-class="justify-center"
          indicator-color="transparent"
          style="margin-top: -30px;"
        >
          <q-tab name="galaxies" :ripple="false"  style="opacity: 1;">
            <q-item  :class="`q-push full-width rounded-sm ${(tab == 'galaxies') ? 'bg-gradient-primary text-white' : 'bg-white'}`">
              <q-item-section>
                <div class="text-caption"><b>Созвездия</b></div>
              </q-item-section>
            </q-item>
          </q-tab>
          <q-tab name="training" :ripple="false" style="opacity: 1;">
            <q-item  :class="`q-push full-width rounded-sm ${(tab == 'training') ? 'bg-gradient-primary text-white' : 'bg-white'}`">
              <q-item-section>
                <div class="text-caption"><b>Тренировка</b></div>
              </q-item-section>
            </q-item>
          </q-tab>
        </q-tabs>
        <q-inner-loading :showing="notLoaded">
          <q-spinner-puff size="50px" color="primary" />
        </q-inner-loading>
        <q-card flat>
          <q-card-section class="q-pt-sm q-pb-none">
            <div class="text-h6"><b>Созвездия</b></div>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <ExploreLessonList :slidesPerView="2.5"/>
          </q-card-section>
        </q-card>

        </q-card>

    </q-page>
  </q-page-container>
</template>

<script setup >
import { ref, onMounted, onActivated } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import DailyLessonSlider from '../components/DailyLessonSlider.vue'
import ExploreLessonList from '../components/ExploreLessonList.vue'
import UserResourceBar from '../components/UserResourceBar.vue'

const { user } = useUserStore()

const notifications = ref([])
const error = ref({})
const notLoaded = ref(true)
const tab = ref('galaxies')

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
