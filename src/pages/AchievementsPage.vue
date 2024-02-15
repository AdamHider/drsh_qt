<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title>Achievements</q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white "  style="padding-top: 50px; padding-bottom: 48px;">
        <div v-for="(achievementGroup, achievementGroupIndex) in achievements" :key="achievementGroupIndex">
          <div class="q-ma-md text-h6">{{achievementGroupIndex}}</div>
          <div>
            <swiper
                :slides-per-view="2.4"
                :centeredSlides="false"
                :navigation="false"
              >
                <swiper-slide v-for="(achievementItem, achievementIndex) in achievementGroup" :key="achievementIndex">
                  <div class="text-center">
                    <q-circular-progress
                      show-value
                      font-size="10px"
                      class="q-ma-md"
                      :color="(achievementItem.progress.percentage/100) >= 1 ? 'positive' : 'primary'"
                      :value="(achievementItem.progress.percentage/100)"
                      size="110px"
                      :thickness="0.2"
                      track-color="grey-3"
                    >
                      <q-avatar size="102px">
                        <img :src="achievementItem.image">
                      </q-avatar>
                    </q-circular-progress>
                    <div>
                      <b>{{achievementItem.progress.current}}/{{achievementItem.progress.target}}</b>
                      <div class="text-bold">{{achievementItem.params.title.ru}}</div>
                      <div class="text-grey text-caption">{{achievementItem.params.description.ru}}</div>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>
            </div>
        </div>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { ref, onMounted } from 'vue'
import { api } from '../services/index'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const achievements = ref([])
const error = ref({})

const load = async function () {
  const achievementListResponse = await api.achievement.getList({})
  if (achievementListResponse.error) {
    error.value = achievementListResponse
    return []
  }
  achievements.value = achievementListResponse
}

onMounted(() => {
  load()
})

</script>
