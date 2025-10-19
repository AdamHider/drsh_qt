<template>
  <q-page-wrapper>
    <q-app-header class="transparent text-white rounded-b-md q-py-xs" ref="header">
      <CourseToggle v-bind:dialogOpened="courseDialog" v-on:update:dialogOpened="courseDialog = $event" @onSelect="getItem($event)"/>
      <q-toolbar-title></q-toolbar-title>
      <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.energy" dense no-caption size="24px" push
          @click="() => {if(user.active?.data.resources.energy.quantity == 0) router.push('/market')}"/>
    </q-app-header>
    <q-page style="padding-top: 50px; padding-bottom: 48px;"  class="items-end full-height full-width text-center" >
        <LessonList v-if="course.active?.id" :reloadTrigger="lessonListReloadTrigger"/>

        <q-page-sticky position="top-left" style="z-index: 100" :offset="[0, 60]">
          <QuestListWidget active-only @onStart="lessonListReload()" @onClaim="lessonListReload()"/>
        </q-page-sticky>

        <q-page-sticky position="bottom-left" style="z-index: 100" :offset="[10, 60]">
          <q-btn class="bg-gradient-primary" round push size="20px" @click="courseDialog = true" @click.stop="playAudio('click')">
            <q-avatar size="60px"><q-img src="images/icons/map.png"/></q-avatar>
          </q-btn>
        </q-page-sticky>
        <q-page-sticky position="bottom-left" style="z-index: 100" :offset="[80, 60]">
          <ChestsWidget type="daily" color="primary"/>
        </q-page-sticky>
        <q-page-sticky position="bottom-left" style="z-index: 100" :offset="[140, 60]">
          <ChestsWidget type="personal" color="green"/>
        </q-page-sticky>


        <q-page-sticky position="bottom-right" style="z-index: 100" :offset="[10, 60]">
          <DailyLessonListWidget :reloadTrigger="lessonListReloadTrigger"/>
        </q-page-sticky>

    </q-page>
  </q-page-wrapper>
</template>

<script setup>
import LessonList from '../components/LessonList.vue'
import CourseToggle from '../components/CourseToggle.vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import QuestListWidget from '../components/QuestListWidget.vue'
import ChestsWidget from '../components/ChestsWidget.vue'

import DailyLessonListWidget from '../components/DailyLessonListWidget.vue'
import { ref, reactive, watch, onActivated, onDeactivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useCourse } from '../composables/useCourse'
import { playAudio } from 'src/services/audioService';



const { user } = useUserStore()
const route = useRoute()
const router = useRouter()

const lessonListReloadTrigger = ref(false)

const courseDialog = ref(false)
const header = ref(null)

const { course, getItem } = useCourse()

const lessonListReload = () => {
  lessonListReloadTrigger.value = true;
  setTimeout(() => {
    lessonListReloadTrigger.value = false
  }, 100)
}

onActivated(async () => {
  await getItem(route.params.course_id)
})
onDeactivated(async () => {
})
watch(() => route.params.course_id, (newData, oldData) => {
  setTimeout(() => {
    getItem(route.params.course_id)
  }, 0);
})
</script>
