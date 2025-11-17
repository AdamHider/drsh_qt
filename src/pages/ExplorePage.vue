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
          <q-card-section class="text-white text-left q-pb-none"  style="text-shadow: 2px 2px 5px black;">
            <div class="text-subtitle1"><b>Ежедневные планеты</b></div>
          </q-card-section>
          <q-card-section class="q-pa-none" >
            <DailyLessonSlider :slidesPerView="3.5" type="daily"/>
          </q-card-section>
      </q-card>
      <q-card flat class="q-main-card relative text-left q-pt-md q-pb-md rounded-borders rounded-b-0 full-width" style="flex: 1; min-height: 50vh; margin-top: 50px;">
        <q-card-section style="margin-top: -70px">
          <ExploreTrainingWidget/>
        </q-card-section>
        <q-card-section class="q-py-none">
          <div class="text-h6"><b>Созвездия</b></div>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <ExploreLessonList :slidesPerView="2.5"/>
        </q-card-section>
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
import ExploreTrainingWidget from '../components/ExploreTrainingWidget.vue'
import UserResourceBar from '../components/UserResourceBar.vue'


const { user } = useUserStore()

const notifications = ref([])
const error = ref({})
const notLoaded = ref(true)
const tab = ref('galaxies')


</script>
