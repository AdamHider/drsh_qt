<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title>Achievements</q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white "  style="padding-top: 50px; padding-bottom: 48px;">
        <div v-for="(achievementGroup, achievementGroupIndex) in achievements" :key="achievementGroupIndex">
          <div class="text-h4">{{achievementGroupIndex}}</div>
          <div>
            <swiper
                :slides-per-view="1.2"
                :centeredSlides="false"
                :navigation="false"
              >
                <swiper-slide v-for="(achievementItem, achievementIndex) in achievementGroup" :key="achievementIndex">
                  <q-card>
                    <q-card-section >
                      <q-item class="q-pa-none bg-white">
                          <q-item-section avatar>
                              <q-avatar size="80px">
                                  <q-img
                                    :src="achievementItem.image"
                                    loading="lazy"
                                    spinner-color="white"/>
                              </q-avatar>
                          </q-item-section>
                          <q-item-section class="text-left">
                              <div class="text-bold">{{achievementItem.title}}</div>
                              <div class="text-grey">{{achievementItem.description}}</div>
                              <div class="row q-ma-sm">
                                  <div class="col text-left"></div>
                                  <div class="col text-right">
                                      <b>{{achievementItem.progress.current}}/{{achievementItem.progress.target}}</b>
                                  </div>
                              </div>
                              <q-linear-progress
                                  :color="(achievementItem.progress.percentage/100) >= 1 ? 'positive' : 'primary'"
                                  :value="(achievementItem.progress.percentage/100)"
                                  size="12px"
                                  rounded
                              ></q-linear-progress>
                          </q-item-section>
                      </q-item>
                    </q-card-section >
                  </q-card>
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
