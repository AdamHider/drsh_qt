<template>
    <swiper
      v-if="achievements.length > 0"
      :modules="[Navigation]"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :navigation="props.navigation"
    >
      <swiper-slide v-for="(achievementItem, index) in achievements" :key="index" :class="'text-center'">
        <q-card flat class="q-ma-sm">
          <q-card-section class="q-pa-xs">
              <q-img
                fit="cover"
                class="rounded-borders"
                :src="achievementItem.image"
                :style="`height: ${props.slideHeight}px; background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)`"
                >
              </q-img>
            </q-card-section>
            <q-card-section  class="text-center q-pa-sm">
                <div class="text-bold">{{achievementItem.title}}</div>
                <div class="text-caption text-grey">{{achievementItem.description}}</div>
            </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
    <BannerNotFound v-else
      title="Ooops..."
      description="There are no achievements yet"
      default-image
    />
</template>
<script setup>
import { ref } from 'vue'
import { useAchievement } from '../composables/useAchievement'
import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import BannerNotFound from './BannerNotFound.vue'

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

const { getListByUser } = useAchievement()
const achievements = ref([])

const load = async function () {
  const achievementListResponse = await getListByUser()
  if (!achievementListResponse.error) {
    achievements.value = achievementListResponse
  }
}
load()
</script>
