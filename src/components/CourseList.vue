<template>
    <q-list>
      <q-item clickable v-ripple v-for="(courseItem, index) in course.list" :key="index"  @click="select(courseItem.id)"
        :class="`${(courseItem.is_active) ? 'active' : ''} q-ma-sm rounded-md q-push`"
        :style="`background-image: url(${courseItem.background_image}); background-size: cover;`">
        <q-item-section avatar>
          <q-avatar size="60px">
            <q-img :src="courseItem.image" width="60px" no-spinner/>
          </q-avatar>
        </q-item-section>
        <q-item-section class="text-white">
          <q-item-label lines="1"><b>{{ courseItem.title }}</b></q-item-label>
          <q-item-label caption lines="2" class="text-white">{{ courseItem.description }}</q-item-label>
          <div class="flex justify-between text-caption q-ma-xs">
            <div><b>Исследовано:</b></div>
            <div><b>{{ courseItem.progress.percentage }}%</b></div>
          </div>
          <q-progress-bar :value="courseItem.progress.percentage" size="20px" color="primary" dark/>
        </q-item-section>
      </q-item>

    </q-list>
</template>
<script setup>
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import { useCourse } from '../composables/useCourse'
import { CONFIG } from '../config.js'

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
    await getItem()
    emits('select')
  }
}
</script>
