<template>
    <swiper
      v-if="lesson.active.id"
      :modules="[Navigation]"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :navigation="props.navigation"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(satelliteItem, index) in lesson.active.sattelites?.list" :key="index" :class="'text-center'" @click="select(index)">
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
            <q-card-section class="q-pa-none transparent no-shadow text-center" style="width: 100px; min-height: 100px">
                <div class="absolute-top flex justify-center items-center full-width full-height">
                    <q-circular-progress v-if="!satelliteItem.is_blocked"
                        rounded
                        show-value
                        :value="satelliteItem.exercise?.current_progress || 0"
                        size="40px"
                        :thickness="0.22"
                        color="orange"
                        track-color="white-transparent1"
                        class="q-ma-none"
                        style="z-index: 50; left: 0; background: none;"
                    >
                        <b class="text-white ">{{ satelliteItem.exercise?.current_progress || 0 }}%</b>
                    </q-circular-progress>
                </div>
                <q-img
                    :src="satelliteItem.image"
                    loading="lazy"
                    spinner-color="white">
                </q-img>
            </q-card-section>
            <q-card-section class="text-center text-white q-pa-none">
                <div class="text-bold">{{satelliteItem.description?.title}}</div>
                <div class="row q-ma-sm">
                    <div class="col text-left"></div>
                    <div class="col  text-right">
                        <b>{{satelliteItem.exercise?.current_page}}</b>
                    </div>
                </div>
            </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
</template>
<script setup>
import { defineEmits } from 'vue'
import { useLesson } from '../composables/useLesson'
import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { CONFIG } from '../config.js'

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

const onSwiper = (swiper) => {
}
const onSlideChange = (swiper) => {
}
</script>
