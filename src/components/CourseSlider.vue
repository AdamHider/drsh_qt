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
      <swiper-slide v-for="(courseItem, index) in course.list" :key="index" :class="'text-center'" @click="select(index)">
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
                <div class="text-bold">{{courseItem.description.title}}</div>
                <div class="text-caption text-grey">{{courseItem.description.title_tag}}</div>
            </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
</template>
<script setup>
import { useUserStore } from '../stores/user'
import { useCourse } from '../composables/useCourse'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { defineEmits } from 'vue'
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

const { user, saveItemSettings } = useUserStore()
const { course, getList, getActive } = useCourse()

if (user.active?.data.id) {
  getList()
}

const select = async (index) => {
  if (course.list[index].id === user.active?.data.settings.course_id) {
    return false
  }
  const activeIndex = course.list.findIndex((course) => (course.id === user.active?.data.settings.course_id))
  if (activeIndex > -1) course.list[activeIndex].is_active = false
  course.list[index].is_active = true
  const data = {
    course_id: course.list[index].id
  }
  await saveItemSettings(user.active?.data.settings)
  emits('select')
}

const onSwiper = (swiper) => {
}

</script>

<style scoped lang="scss">
.q-card > .q-card__section:first-child{
  border: 3px solid rgba(0, 0, 0, 0.12);
  border-radius: $huge-border-radius;
}
.q-card.active > .q-card__section:first-child{
  border-color: $positive;
}
</style>
