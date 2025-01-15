<template>
    <swiper
      v-if="user.active.data?.id"
      class="courseSlider"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :initialSlide="course.list?.findIndex((course) => course.is_active)"
      :navigation="props.navigation"
      @swiper="onSwiper"
    >
      <swiper-slide v-for="(courseItem, index) in course.list" :key="index" :class="'text-center'" @click="select(courseItem.id)">
        <q-card :class="`q-ma-sm overflow-hidden ${(courseItem.is_active) ? 'active' : ''}`" flat>
            <q-card-section class="q-pa-none" >
              <q-img
                fit="cover"
                :src="courseItem.background_image"
                :style="`height: ${props.slideHeight}px;`"
                >
                <div class="absolute-full column justify-center items-center">
                  <q-circular-progress
                    show-value
                    class="text-white text-bold q-ma-md"
                    :value="courseItem.progress.percentage"
                    track-color="grey-5"
                    size="60px"
                    color="white"
                  >
                    {{ courseItem.progress.percentage }}%
                  </q-circular-progress>
                  <div class="text-bold text-left">{{courseItem.title}}</div>
                </div>
              </q-img>
            </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
</template>
<script setup>
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import { useCourse } from '../composables/useCourse'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { CONFIG } from '../config.js'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const props = defineProps({
  slidesPerView: Number,
  centerAligned: Boolean,
  withButton: Boolean,
  slideHeight: String,
  navigation: Boolean,
  captionMode: String
})

const emits = defineEmits(['select'])

const { user, getItem } = useUserStore()
const { course, getList, getActive } = useCourse()

if (user.active?.data.id) {
  getList()
}

const select = async function (courseId) {
  const linkItemResponse = await api.course.linkItem({ id: courseId })
  if (!linkItemResponse.error) {
    emits('select', courseId)
  }
}

const onSwiper = (swiper) => {
}

</script>
