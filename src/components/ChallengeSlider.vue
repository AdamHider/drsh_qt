<template>
    <swiper
      v-if="user.active.data?.id"
      class="challengeSlider"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :initialSlide="challenge.list?.findIndex((challenge) => challenge.is_active)"
      :navigation="props.navigation"
    >
      <swiper-slide v-for="(challengeItem, index) in challenge.list" :key="index">
        <q-card
          :class="`q-ma-sm cursor-pointer ${(challengeItem.is_active) ? 'active' : ''}`"
          @click="router.push(`challenge-${challengeItem.id}`)"
          flat
        >
            <q-card-section class="q-pa-xs" >
              <q-img
                fit="cover"
                class="rounded-borders"
                :src="challengeItem.image"
                :style="`height: ${props.slideHeight}px;`"
                >
                <div :class="`absolute-${captionMode} text-left text-white flex flex-center`" v-if="challengeItem.progress.value > 0">
                  <q-circular-progress
                    show-value
                    class="text-white text-bold q-ma-md"
                    :value="challengeItem.progress.percentage"
                    track-color="grey-5"
                    size="60px"
                    color="white"
                  >
                  {{ challengeItem.progress.percentage }}%
                  </q-circular-progress>
                </div>
                <div class="absolute-bottom transparent q-pa-none-important text-left">
                  <q-chip
                      v-if="challengeItem.time_left_humanized && !challengeItem.is_finished"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      :color="((challengeItem.time_left <= 3) ? 'red' : 'orange')"
                      icon="sports_score"
                      text-color="white">
                      <b>{{ challengeItem.time_left_humanized }}</b>
                  </q-chip>
                  <q-chip
                      v-else-if="!challengeItem.is_finished"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      :color="'red'"
                      icon="sports_score"
                      text-color="white">
                      <b>Hurry up!</b>
                  </q-chip>
                  <q-chip
                      v-if="challengeItem.is_finished"
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
                      v-if="challengeItem.value"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      icon="ads_click"
                      icon-right="star"
                      color="primary"
                      text-color="white">
                      <b>{{ challengeItem.value }}</b>
                  </q-chip>
                </div>
              </q-img>
            </q-card-section>
            <q-card-section  class="text-left q-pa-sm">
                <div class="text-bold max-two-lines">{{challengeItem.description.title}}</div>
                <div class="text-caption text-grey max-two-lines">{{challengeItem.description.description}}</div>
                <div class="text-caption text-grey max-one-lines" v-if="challengeItem.winner_left && challengeItem.winner_left > 0">Winners left: {{challengeItem.winner_left}}</div>
            </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
</template>
<script setup>
import { onMounted, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { useChallenge } from '../composables/useChallenge'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRouter } from 'vue-router'

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

const { user } = useUserStore()
const { challenge, getList } = useChallenge()
onMounted(() => {
  getList({ page: 1, classroom_id: props.classroomId })
})
watch(() => props.classroomId, async (newData, oldData) => {
  getList({ page: 1, classroom_id: props.classroomId })
})

</script>
