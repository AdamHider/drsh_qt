<template>
  <q-page-wrapper>
    <q-app-header class="transparent text-white rounded-b-md q-py-xs" ref="header">
      <CourseToggle v-bind:dialogOpened="courseDialog" v-on:update:dialogOpened="courseDialog = $event" @onSelect="getItem($event)"/>
      <q-toolbar-title></q-toolbar-title>
      <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.energy" dense no-caption size="24px" push/>
    </q-app-header>
    <q-page style="padding-top: 50px; padding-bottom: 48px;"  class="items-end full-height full-width text-center" >
        <LessonList v-if="course.active?.id" :disable="courseDialog" :reloadTrigger="lessonListReloadTrigger"/>

        <q-page-sticky position="bottom" style="margin-bottom: 20px;">
          <q-img :src="`/images/dershane/robot/rocket.png`" width="50px"/>
        </q-page-sticky>

        <q-page-sticky position="top-left" style="z-index: 100" :offset="[0, 60]">
          <QuestListWidget active-only @onStart="lessonListReload()" @onClaim="lessonListReload()"/>
        </q-page-sticky>
        <q-page-sticky position="bottom-left" style="z-index: 100" :offset="[10, 60]">
          <q-btn class="bg-gradient-primary" round push size="20px" @click="courseDialog = true" @click.stop="playAudio('click')">
            <q-avatar size="60px"><q-img src="images/icons/map.png"/></q-avatar>
          </q-btn>
        </q-page-sticky>
        <q-page-sticky position="bottom-left" style="z-index: 100" :offset="[80, 60]">

          <q-btn class="bg-gradient-primary" round push size="17px" @click="dailyChestDialogStatus = true" @click.stop="playAudio('click')">
            <q-avatar size="45px"><q-img src="images/icons/chest.png"/></q-avatar>
          </q-btn>
        </q-page-sticky>


        <q-page-sticky position="bottom-right" style="z-index: 100" :offset="[10, 60]">
          <DailyLessonListWidget :reloadTrigger="lessonListReloadTrigger"/>
        </q-page-sticky>

        <q-dialog v-model="dailyChestDialogStatus" transition-show="fade" transition-hide="fade" maximized persistent backdrop-filter="blur(4px)">
          <DailyChestWidget/>
        </q-dialog>
    </q-page>
  </q-page-wrapper>
</template>

<script setup>
import LessonList from '../components/LessonList.vue'
import CourseToggle from '../components/CourseToggle.vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import QuestListWidget from '../components/QuestListWidget.vue'
import DailyChestWidget from '../components/DailyChestWidget.vue'
import DailyLessonListWidget from '../components/DailyLessonListWidget.vue'
import { ref, reactive, watch, onActivated, onDeactivated } from 'vue'
import { useUserStore } from '../stores/user'
import { useCourse } from '../composables/useCourse'
import { useRoute } from 'vue-router'
import { playAudio } from 'src/services/audioService';



const { user } = useUserStore()
const route = useRoute()

const lessonListReloadTrigger = ref(false)
const dailyChestDialogStatus = ref(false)

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
  getItem(route.params.course_id)
})
</script>
