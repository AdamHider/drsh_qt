<template>
  <q-page-wrapper>
    <q-app-header class="transparent text-white rounded-b-md" ref="header">
      <CourseToggle v-bind:dialogOpened="dialog.active" v-on:update:dialogOpened="dialog.active = $event" @onSelect="getItem($event)"/>
      <q-toolbar-title></q-toolbar-title>
      <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.energy" dense no-caption size="28px" transparent/>
    </q-app-header>
    <q-page style="padding-top: 50px; padding-bottom: 48px;"  class="items-end full-height full-width text-center" >
        <LessonList v-if="course.active?.id" :disable="dialog.active"/>

        <q-page-sticky position="bottom" style="margin-bottom: 20px;">
          <q-img :src="`/images/dershane/robot/rocket.png`" width="50px"/>
        </q-page-sticky>

        <q-page-sticky position="top-left" style="z-index: 100" :offset="[0, 50]">
          <QuestListWidget active-only/>
        </q-page-sticky>
        <q-page-sticky position="bottom-left" style="z-index: 100" :offset="[10, 150]">
          <q-btn icon="map" color="secondary" round push size="20px"></q-btn>
        </q-page-sticky>
        <q-page-sticky position="bottom-right" style="z-index: 100" :offset="[10, 150]">
          <DailyLessonListWidget/>
        </q-page-sticky>

    </q-page>
  </q-page-wrapper>
</template>

<script setup>
import LessonList from '../components/LessonList.vue'
import CourseToggle from '../components/CourseToggle.vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import QuestListWidget from '../components/QuestListWidget.vue'
import DailyLessonListWidget from '../components/DailyLessonListWidget.vue'
import { ref, reactive, watch, onActivated, onDeactivated } from 'vue'
import { useUserStore } from '../stores/user'
import { useCourse } from '../composables/useCourse'
import { useRoute } from 'vue-router'

const { user } = useUserStore()
const route = useRoute()

const dialog = reactive({ active: false })
const header = ref(null)

const { course, getItem } = useCourse()

onActivated(async () => {
  await getItem(route.params.course_id)
})
onDeactivated(async () => {
})
watch(() => route.params.course_id, (newData, oldData) => {
  getItem(route.params.course_id)
})
</script>
