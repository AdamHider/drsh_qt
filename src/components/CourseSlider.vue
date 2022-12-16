<template>
    <swiper
      v-if="user.active.data.id"
      ref="classroomSlider"
      :modules="[Navigation, Pagination, Scrollbar, A11y]"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :initialSlide="course.list.findIndex((course) => course.id == user.active.data.profile.active_course_id)"
      :navigation="props.navigation"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(courseItem, index) in course.list" :key="index" :class="'text-center'" @click="select(index)">
        <q-card class="q-ma-md" flat>
            <q-card-section class="q-pa-none">
              <q-img
                fit="cover"
                class="rounded-borders"
                :src="(CONFIG.API_HOST+courseItem.image)"
                :style="`height: ${props.slideHeight}px;`"
                >
                <div :class="`absolute-${captionMode} text-left text-white flex flex-center  `">
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
                </div>
                <div class="absolute-bottom transparent">
                  <q-chip 
                    dense 
                    class="absolute-bottom-left q-ma-sm"
                    color="orange" 
                    text-color="white" 
                    icon-right="star" >
                    <b>{{ courseItem.progress.total_points }}</b>
                  </q-chip>
                    <q-icon v-if="courseItem.id == user.active.data.profile.active_course_id" 
                      class="absolute-bottom-right" 
                      size="32px" 
                      name="check" 
                      color="white" 
                      style="bottom: 8px; right: 8px">
                      <q-tooltip>
                        Tooltip
                      </q-tooltip>
                    </q-icon>
                </div>
              </q-img>
            </q-card-section>
            <q-card-section  class="text-left q-pa-sm">
                <div class="text-bold">{{courseItem.data.title}}</div>
                <div class="text-caption text-grey">{{courseItem.data.title_tag}}</div>
            </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
    <q-btn v-if="props.withButton" color="primary" rounded="lg" @click="select()" :disabled="(courseItem.id == user.active.data.profile.active_course_id)">
      <template v-if="(activeItem.id !== 0)">
        Enter {{activeItem.title}}
      </template>
      <template v-else>
        {{activeItem.title}}
      </template>
    </q-btn>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useCourse } from '../composables/useCourse'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
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

const router = useRouter()
const { user, signIn , save} = useUserStore()
const { course, getList } = useCourse()

if (user.active.data.id) {
  getList()
}

const activeItem = ref({})
const classroomSlider = ref(null)
const joinSlide = {
  id: 0,
  code: '',
  title: 'Join classroom'
}

const select = async (index) => {
  if (index !== false) {
    activeItem.value = course.list[index]
    // classroomSlider.slideTo(index);
  } else {
    return router.push('/classroom/join')
  }
  if (activeItem.value.id === user.active.data.activeCourse) {
    return false
  }
  
  const fields = {
      active_course_id: activeItem.value.id
  }
  await save({fields: fields});

  return router.push('/user')
}

const onSwiper = (swiper) => {
  if (course.list[swiper.activeIndex]) {
    activeItem.value = course.list[swiper.activeIndex]
  } else {
    activeItem.value = joinSlide
  }
}
const onSlideChange = (swiper) => {
  if (course.list[swiper.activeIndex]) {
    activeItem.value = course.list[swiper.activeIndex]
  } else {
    activeItem.value = joinSlide
  }
}
</script>
