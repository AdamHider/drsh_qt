<template>
    <swiper
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :initialSlide="classrooms.findIndex((classroom) => classroom.is_active)"
      :navigation="props.navigation"
    >
      <swiper-slide v-for="(classroomItem, index) in classrooms" :key="index" :class="'text-center'" @click="select(index)">
        <q-card flat :class="`q-ma-sm ${(classroomItem.is_active) ? 'active' : ''}`" >
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
import { api } from '../services/index'
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
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

const router = useRouter()
const { user, saveItemSettings } = useUserStore()

const classrooms = ref([])

const load = async function () {
  const classroomListResponse = await api.classroom.getList({ mode: 'by_user', limit: 3 })
  if (!classroomListResponse.error) {
    classrooms.value = classroomListResponse
  }
}

onMounted(() => {
  load()
})
onActivated(() => {
  load()
})

const activeItem = ref({})

const select = async (index) => {
  activeItem.value = classrooms.value[index]
  if (activeItem.value.is_active) {
    return false
  }
  const activeIndex = classrooms.value.findIndex((classroom) => (classroom.id === user.active.data.settings.classroom_id))
  if (activeIndex > -1) classrooms.value[activeIndex].is_active = false
  classrooms.value[index].is_active = true
  const data = {
    classroom_id: activeItem.value.id
  }
  await saveItemSettings(data)
}
</script>
