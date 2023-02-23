<template>
    <swiper
      v-if="homework.list.length > 0"
      class="homeworkSlider"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :initialSlide="homework.list?.findIndex((homework) => homework.is_active)"
      :navigation="props.navigation"
    >
      <swiper-slide v-for="(homeworkItem, index) in homework.list" :key="index" class="text-center">
        <q-card
            class="q-ma-sm cursor-pointer"
            @click="router.push(`/homework-${homeworkItem.id}`)"
            flat>
            <q-card-section class="q-ma-xs q-pa-none rounded-md-important"
              :style="`background: ${homeworkItem.course_section.background_gradient}; transform: none`">
                <div  class="relative-position">
                  <q-img
                    :src="homeworkItem.course_section.background_image"
                    class="absolute-top absolute-left full-width full-height"
                    loading="lazy"
                    spinner-color="white"
                  />
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
                          :value="homeworkItem.exercise?.data.progress_percentage || 0"
                          size="50px"
                          :thickness="0.22"
                          color="white"
                          track-color="white-transparent1"
                          class="q-ma-none"
                          style="z-index: 50; left: 0; background: none;"
                      >
                          <b class="text-white ">{{ homeworkItem.exercise?.data.progress_percentage || 0 }}%</b>
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
                <div class="text-bold max-two-lines">{{homeworkItem.title}}</div>
                <div class="text-caption text-grey max-two-lines">{{homeworkItem.course_section.title}}</div>
            </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
    <BannerNotFound v-else
      title="Ooops..."
      description="There are no homeworks yet"
      default-image
    />
</template>
<script setup>
import { onMounted, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { useHomework } from '../composables/useHomework'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRouter } from 'vue-router'
import BannerNotFound from '../components/BannerNotFound.vue'

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
const { homework, getList, resetList } = useHomework()
onMounted(() => {
  getList({ page: 1, classroom_id: props.classroomId })
})
watch(() => props.classroomId, async (newData, oldData) => {
  resetList()
  getList({ page: 1, classroom_id: props.classroomId })
})
</script>
