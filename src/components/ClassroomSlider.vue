<template>
    <swiper
      v-if="user.active.data.id"
      ref="classroomSlider"
      :modules="[Navigation]"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :initialSlide="classroom.list?.findIndex((classroom) => classroom.is_active)"
      :navigation="props.navigation"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(classroomItem, index) in classroom.list" :key="index" :class="'text-center'" @click="select(index)">
        <q-card flat :class="`q-ma-sm ${(classroomItem.is_active) ? 'active' : ''}`">
          <q-card-section class="q-pa-xs">
            <q-img
              fit="cover"
              class="rounded-borders"
              :src="classroomItem.background_image"
              :style="`height: ${props.slideHeight}px`"
              >
              <div :class="`absolute-${captionMode} text-center text-white flex flex-center`">
                <div>
                  <div class="text-bold">{{classroomItem.title}}</div>
                  <div class="subtitle">{{classroomItem.code}}</div>
                  <div class="text-caption">{{classroomItem.description}}</div>
                </div>
              </div>
            </q-img>
          </q-card-section>
        </q-card>
      </swiper-slide>
      <swiper-slide :class="'text-center'" @click="select(false)">
        <q-card flat class="q-ma-sm">
          <q-card-section class="q-pa-xs">
            <q-img
              class="rounded-borders"
              :style="`height: ${props.slideHeight}px;`">
              <div class="absolute-full text-center text-white flex flex-center">
                <q-icon size="30px" name="add"></q-icon>
              </div>
            </q-img>
          </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
    <q-btn v-if="props.withButton" color="primary" rounded="lg" @click="select()" :disabled="(activeItem.is_active)">
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
import { useClassroom } from '../composables/useClassroom'
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
  withButton: Boolean,
  slideHeight: String,
  navigation: Boolean,
  captionMode: String
})

const router = useRouter()
const { user, saveItemSettings } = useUserStore()
const { classroom, getList, getItem } = useClassroom()

getList()

const activeItem = ref({})
const classroomSlider = ref(null)
const joinSlide = {
  id: 0,
  code: '',
  title: 'Join classroom'
}

const select = async (index) => {
  if (index !== false) {
    activeItem.value = classroom.list[index]
    // classroomSlider.slideTo(index);
  } else {
    return router.push('/classroom/join')
  }
  if (activeItem.value.is_active) {
    return false
  }

  const activeIndex = classroom.list.findIndex((classroom) => (classroom.id === user.active.data.settings.classroom_id))
  if (activeIndex > -1) classroom.list[activeIndex].is_active = false
  classroom.list[index].is_active = true

  const data = {
    classroom_id: activeItem.value.id
  }
  await saveItemSettings(data)
  return router.push(`/classroom-${data.classroom_id}`)
}

const onSwiper = (swiper) => {
  if (classroom.list.length == 0) return
  if (classroom.list[swiper.activeIndex]) {
    activeItem.value = classroom.list[swiper.activeIndex]
  } else {
    activeItem.value = joinSlide
  }
}
const onSlideChange = (swiper) => {
  if (classroom.list.length == 0) return
  if (classroom.list[swiper.activeIndex]) {
    activeItem.value = classroom.list[swiper.activeIndex]
  } else {
    activeItem.value = joinSlide
  }
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
