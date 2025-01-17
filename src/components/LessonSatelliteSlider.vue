<template>
    <swiper
      v-if="lesson.active.id"
      :modules="[Navigation]"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :navigation="props.navigation"
      effect="creative"
      :creativeEffect="{
          perspective: true,
          limitProgress: 3,
          prev: {
              translate: ['-90%', '20%', -100],
              rotate: [0, 0, -20],
              origin: 'bottom'
          },
          next: {
              translate: ['90%', '20%', -100],
              rotate: [0, 0, 20],
              origin: 'bottom'
          },
      }"
    >
      <swiper-slide v-for="(satelliteItem, index) in lesson.active.satellites?.list" :key="index" :class="'text-center'" @click="select(index)">
        <q-card flat class="transparent q-ma-sm"
            :disabled="satelliteItem.is_blocked ? true : null">
            <q-btn v-if="satelliteItem.is_blocked === true"
                color="white"
                text-color="dark"
                class="absolute-top"
                style="top: 10px; left: 10px; z-index: 5"
                round
                icon="lock"
            ></q-btn>
            <q-card-section class="q-pa-none transparent no-shadow text-center" style="min-height: 100px">
                <q-img
                    :src="satelliteItem.image"
                    loading="lazy"
                    spinner-color="white">
                </q-img>
            </q-card-section>
            <q-card-section class="text-center text-white q-pa-none">
                <div class="text-caption"><span>Изучено:</span> <b :class="(satelliteItem.progress > 0 && satelliteItem.progress < 100) ? 'text-warning': ''">{{satelliteItem.progress}}%</b></div>
                <div class="text-bold">{{satelliteItem.title}}</div>
            </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
</template>
<script setup>
import { useLesson } from '../composables/useLesson'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const emits = defineEmits(['select'])

const props = defineProps({
  slidesPerView: Number,
  centerAligned: Boolean,
  slideHeight: String,
  navigation: Boolean,
  captionMode: String
})

const { lesson } = useLesson()

const select = async (index) => {
  emits('select', index)
}
</script>
