<template>
    <swiper
      v-if="quests.length > 0"
      class="questSlider"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :navigation="props.navigation"
    >
      <swiper-slide v-for="(questItem, index) in quests" :key="index">
        <q-card
          :class="`q-ma-sm cursor-pointer ${(questItem.is_active) ? 'active' : ''}`"
          @click="router.push(`quest-${questItem.id}`)"
          flat
        >
            <q-card-section class="q-pa-xs" >
              <q-img
                fit="cover"
                class="rounded-borders"
                :src="questItem.image"
                :style="`height: ${props.slideHeight}px;`"
                >
                <div :class="`absolute-${captionMode} text-left text-white flex flex-center`" v-if="questItem.progress.value > 0">
                  <q-circular-progress
                    show-value
                    class="text-white text-bold q-ma-md"
                    :value="questItem.progress.percentage"
                    track-color="grey-5"
                    size="60px"
                    color="white"
                  >
                  {{ questItem.progress.percentage }}%
                  </q-circular-progress>
                </div>
                <div class="absolute-bottom transparent q-pa-none-important text-left">
                  <q-chip
                      v-if="questItem.time_left_humanized && !questItem.is_finished"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      :color="((questItem.time_left <= 3) ? 'red' : 'orange')"
                      icon="sports_score"
                      text-color="white">
                      <b>{{ questItem.time_left_humanized }}</b>
                  </q-chip>
                  <q-chip
                      v-else-if="!questItem.is_finished"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      :color="'red'"
                      icon="sports_score"
                      text-color="white">
                      <b>Hurry up!</b>
                  </q-chip>
                  <q-chip
                      v-if="questItem.is_finished"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      icon="check"
                      color="positive"
                      text-color="white">
                      <b>Done</b>
                  </q-chip>
                </div>
                <div class="absolute-bottom transparent q-pa-none-important text-right">
                  <q-chip
                      v-if="questItem.value"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      icon="ads_click"
                      icon-right="star"
                      color="primary"
                      text-color="white">
                      <b>{{ questItem.value }}</b>
                  </q-chip>
                </div>
              </q-img>
            </q-card-section>
            <q-card-section  class="text-left q-pa-sm">
                <div class="text-bold max-two-lines">{{questItem.title}}</div>
                <div class="text-caption text-grey max-two-lines">{{questItem.description}}</div>
                <div class="text-caption text-grey max-one-lines" v-if="questItem.winner_left && questItem.winner_left > 0">Winners left: {{questItem.winner_left}}</div>
            </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
    <BannerNotFound v-else
      title="Ooops..."
      description="There are no homeworks yet"
      default-image
    />
</template>
<script setup>
import { api } from '../services/index'
import { onMounted, ref, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRouter } from 'vue-router'
import BannerNotFound from '../components/BannerNotFound.vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const props = defineProps({
  classroomId: String,
  slidesPerView: Number,
  centerAligned: Boolean,
  withButton: Boolean,
  slideHeight: String,
  navigation: Boolean,
  captionMode: String
})

const router = useRouter()
const quests = ref([])

const load = async function () {
  const questListResponse = await api.quest.getList({ limit: 3, classroom_id: props.classroomId })
  if (questListResponse.error) {
    quests.value = []
    return
  }
  quests.value = questListResponse
}
onMounted(async () => {
  load()
})
watch(() => props.classroomId, (newData, oldData) => {
  load()
})
</script>
