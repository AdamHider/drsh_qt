<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title><b>Достижения</b></q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white "  style="padding-top: 50px; padding-bottom: 48px;">
        <div v-for="(achievementGroup, achievementGroupIndex) in achievements" :key="`achievementGroup-${achievementGroupIndex}`">
          <div class="q-ma-md">
            <div class="text-subtitle1"><b>{{achievementGroup.title}}</b></div>
            <div class="text-grey text-caption">{{achievementGroup.description}}</div>
          </div>
          <div>
            <swiper
                :slides-per-view="2.4"
                :centeredSlides="false"
                :navigation="false"
              >
                <swiper-slide v-for="(achievementItem, achievementIndex) in achievementGroup.list" :key="achievementIndex">
                  <div class="text-center">
                    <q-circular-progress
                      show-value
                      font-size="10px"
                      class="q-ma-md"
                      :color="(achievementItem.progress.percentage) >= 1 ? 'positive' : 'primary'"
                      :value="(achievementItem.progress.percentage)"
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
                      <div class="text-bold">{{achievementItem.title}}</div>
                      <div class="text-grey text-caption">{{achievementItem.description}}</div>
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
  achievements.value = composeList(achievementListResponse)
}
const composeList = function (achievementList) {
  return achievementList.reduce((result, obj) => {
    result[obj.group_id] = result[obj.group_id] || {
        title: obj.group.title,
        description: obj.group.description,
        list: []
      };
      result[obj.group_id].list.push(obj);
      return result;
  }, {})
}


onMounted(() => {
  load()
})

</script>
