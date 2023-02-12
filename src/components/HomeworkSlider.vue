<template>
    <swiper
      v-if="user.active.data?.id"
      class="homeworkSlider"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :initialSlide="homework.list?.findIndex((homework) => homework.is_active)"
      :navigation="props.navigation"
      @swiper="onSwiper"
    >
      <swiper-slide v-for="(homeworkItem, index) in homework.list" :key="index" class="text-center" @click="select(index)">
        <q-card
            class="q-ma-sm "
            flat>
            <q-card-section class="q-ma-xs q-pa-none rounded-md-important"
              :style="`background: ${homeworkItem.course_section.background_gradient}; transform: none`">
                <div  class="relative-position">
                  <q-img
                    :src="homeworkItem.course_section.background_image"
                    class="absolute-top absolute-left full-width full-height"
                    loading="lazy"
                    spinner-color="white"
                  >
                  </q-img>
                  <q-img
                    fit="contain"
                    :src="homeworkItem.image"
                    :style="`height: ${props.slideHeight}px; max-width: 120px;`"
                    >
                  </q-img>
                  <div class="absolute-top full-height text-left text-white flex flex-center">
                      <q-circular-progress v-if="homeworkItem.exercise_id && !homeworkItem.is_blocked"
                          rounded
                          show-value
                          :value="homeworkItem.exercise?.current_progress || 0"
                          size="50px"
                          :thickness="0.22"
                          color="orange"
                          track-color="white-transparent1"
                          class="q-ma-none"
                          style="z-index: 50; left: 0; background: none;"
                      >
                          <b class="text-white ">{{ homeworkItem.exercise?.current_progress || 0 }}%</b>
                      </q-circular-progress>
                    </div>
                </div>
                <div class="text-left">
                  <q-chip
                      v-if="homeworkItem.time_left_humanized"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      :color="((homeworkItem.time_left <= 3) ? 'red' : 'orange')"
                      icon="sports_score"
                      text-color="white">
                      <b>{{ homeworkItem.time_left_humanized }}</b>
                  </q-chip>
                </div>
            </q-card-section>
            <q-card-section  class="text-left q-pa-sm">
                <div class="text-bold max-two-lines">{{homeworkItem.description.title}}</div>
                <div class="text-caption text-grey max-two-lines">{{homeworkItem.course_section.description.title}}</div>
            </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
</template>
<script setup>
import { useUserStore } from '../stores/user'
import { useHomework } from '../composables/useHomework'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { defineEmits } from 'vue'

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

const { user } = useUserStore()
const { homework, getList } = useHomework()

if (user.active?.data.id) {
  getList(1)
}

const select = async (index) => {
  emits('select')
}

const onSwiper = (swiper) => {
}

</script>
