<template>
  <swiper
    :slides-per-view="props.slidesPerView"
    :centeredSlides="props.centerAligned"
    :navigation="props.navigation"
  >
    <swiper-slide v-for="(feedItem, index) in classroomFeed" :key="index" :class="'text-center'"
      @click="router.push(`classroom-${classroomFeedItem.id}`)">

      <q-item
        :key="index" class="cursor-pointer text-left"
        clickable
        @click="router.push(`${feedItem.code}-${feedItem.item_id}`)">
        <q-item-section avatar>
          <q-avatar>
            <img :src="feedItem.classroom_image">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label><b>{{ feedItem.classroom_title }}</b></q-item-label>
          <q-item-label caption>{{ feedItem.title }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{ feedItem.date_start_humanized }}</q-item-label>
        </q-item-section>
      </q-item>
    </swiper-slide>
  </swiper>
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

const classroomFeed = ref([])

const load = async function () {
  const classroomFeedListResponse = await api.classroom.getFeed({ mode: 'by_user', limit: 5 })
  if (!classroomFeedListResponse.error) {
    classroomFeed.value = classroomFeedListResponse
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
  activeItem.value = classroomFeed.value[index]
  if (activeItem.value.is_active) {
    return false
  }
  const activeIndex = classroomFeed.value.findIndex((classroom) => (classroom.id === user.active.data.settings.classroom_id))
  if (activeIndex > -1) classroomFeed.value[activeIndex].is_active = false
  classroomFeed.value[index].is_active = true
  const data = {
    classroom_id: activeItem.value.id
  }
  await saveItemSettings(data)
}
</script>
