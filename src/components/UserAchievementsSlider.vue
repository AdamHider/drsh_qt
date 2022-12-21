<template>
    <swiper
      v-if="user.active.data.id"
      :modules="[Navigation]"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :navigation="props.navigation"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(achievementItem, index) in achievements" :key="index" :class="'text-center'" @click="select(index)">
        <q-card flat class="q-ma-sm">
          <q-card-section class="q-pa-xs" >
              <q-img
                fit="cover"
                class="rounded-borders"
                :src="(CONFIG.API_HOST+achievementItem.image)"
                :style="`height: ${props.slideHeight}px; background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)`"
                >
              </q-img>
            </q-card-section>
            <q-card-section  class="text-center q-pa-sm">
                <div class="text-bold">{{achievementItem.description.title.ru}}</div>
                <div class="text-caption text-grey">{{achievementItem.description.description.ru}}</div>
            </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useAchievement } from '../composables/useAchievement'
import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { CONFIG } from '../config.js'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const props = defineProps({
  slidesPerView: Number,
  centerAligned: Boolean,
  slideHeight: String,
  navigation: Boolean,
  captionMode: String
})

const { user } = useUserStore()
const { getListByUser } = useAchievement()
const achievements = ref([])

const load = async function () {
  achievements.value = await getListByUser()
}
load()

const onSwiper = (swiper) => {
}
const onSlideChange = (swiper) => {
}
</script>
