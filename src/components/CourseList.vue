<template>
    <q-list v-if="user.active.data?.id"  >
      <q-item clickable v-ripple v-for="(courseItem, index) in course.list" :key="index"  @click="select(courseItem.id)"
        :class="`${(courseItem.is_active) ? 'active' : ''} q-ma-sm rounded-sm`"
        :style="`background-image: url(${courseItem.background_image}); background-size: cover;`">
        <q-item-section avatar>
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
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1" class="text-white"><b>{{ courseItem.title }}</b></q-item-label>
          <q-item-label caption lines="2" class="text-white">{{ courseItem.description }}</q-item-label>
        </q-item-section>
      </q-item>

    </q-list>
</template>
<script setup>
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import { useCourse } from '../composables/useCourse'
import { defineEmits } from 'vue'
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
