<template>
    <q-list v-if="user.active.data?.id" bordered >
      <q-item clickable v-ripple v-for="(courseItem, index) in course.list" :key="index"  @click="select(courseItem.id)"
        :class="`${(courseItem.is_active) ? 'active' : ''}`">
        <q-item-section avatar>
          <q-avatar>
            <img :src="courseItem.image">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1"><b>{{ courseItem.title }}</b></q-item-label>
          <q-item-label caption lines="2" color="white">{{ courseItem.description }}</q-item-label>
          <div class="row q-my-sm justify-between items-end" >
            <div class="col text-right">
                <b>{{ courseItem.progress.percentage }}%</b>
            </div>
          </div>
          <q-linear-progress
              :color="(courseItem.progress.percentage/100) >= 1 ? 'positive' : 'white'"
              :value="(courseItem.progress.percentage/100)"
              size="12px"
              rounded
          ></q-linear-progress>
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
