<template>
    <swiper
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :initialSlide="courses?.findIndex((course) => course.is_active)"
      :navigation="props.navigation"
    >
      <swiper-slide v-for="(courseItem, index) in courses" :key="index" :class="'text-center'" @click="select(index)">
        <q-card :class="`q-ma-sm ${(courseItem.is_active) ? 'active' : ''}`" flat>
            <q-card-section class="q-pa-xs" >
              <q-img
                fit="cover"
                class="rounded-borders"
                :src="courseItem.background_image"
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
                    :color="((courseItem.is_active) ? 'orange' : 'grey')"
                    text-color="white"
                    icon-right="star" >
                    <b>{{ courseItem.progress.total_points }}</b>
                  </q-chip>
                </div>
              </q-img>
            </q-card-section>
            <q-card-section  class="text-left q-pa-sm">
                <div class="text-bold">{{courseItem.title}}</div>
                <div class="text-caption text-grey">{{courseItem.title_tag}}</div>
            </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
</template>
<script setup>
import { api } from '../services/index'
import { ref, onActivated, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { Swiper, SwiperSlide } from 'swiper/vue'

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

const { user, savesettings } = useUserStore()

const courses = ref([])

const load = async function () {
  const courseListResponse = await api.course.getList({ limit: 3 })
  if (!courseListResponse.error) {
    courses.value = courseListResponse
  }
}
onMounted(() => {
  load()
})
onActivated(() => {
  load()
})

const select = async (index) => {
  if (courses.value[index].id === user.active?.data.settings.course_id) {
    return false
  }
  emits('select')
  const activeIndex = courses.value.findIndex((course) => (course.id === user.active?.data.settings.course_id))
  if (activeIndex > -1) courses.value[activeIndex].is_active = false
  courses.value[index].is_active = true
  const data = {
    course_id: courses.value[index].id
  }
  await savesettings(data)
}

</script>
