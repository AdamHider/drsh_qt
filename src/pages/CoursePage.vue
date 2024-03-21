<template>
  <q-page-wrapper>
    <q-app-header class="transparent text-white rounded-b-md" ref="header">
      <CourseToggle v-bind:dialogOpened="dialog.active" v-on:update:dialogOpened="dialog.active = $event"/>
      <q-toolbar-title></q-toolbar-title>
      <UserResourceBar :resource="user.active?.data.resources.energy" dense no-caption size="28px"/>
    </q-app-header>
    <q-page style="padding-top: 50px; padding-bottom: 35px;"  class="items-end full-height full-width text-center" >
      <q-scroll-area class="absolute-top absolute-left full-width full-height"
        :content-style="{
          display: 'flex',
          justifyContent: 'end',
          flexDirection: 'column', paddingBottom: '48px'}"
        style="z-index: 10;" >
        <LessonList v-if="course.active?.id" :disable="dialog.active"/>
        <q-card flat class="transparent">
          <q-card-section v-if="course.active?.id" class="text-white" >
            <div class="text-subtitle"><b>{{course.active?.title}}</b></div>
            <div class="text-caption">{{course.active?.description}}</div>
          </q-card-section>
          <q-card-section v-else class="text-white" >
            <div class="text-subtitle"><b>Choose course</b></div>
            <div class="text-caption">And start your investigation</div>
            <q-btn color="dark" @click="dialog.active=true">Choose</q-btn>
          </q-card-section>
        </q-card>
        <q-page-sticky position="bottom" style="margin-bottom: 20px;">
          <q-img :src="`/images/dershane/robot/rocket.png`" width="50px"/>
        </q-page-sticky>
        <q-scroll-observer @scroll="onScroll" />
      </q-scroll-area>
        <q-page-sticky position="right" :offset="[12, 12]" style="z-index: 100">
          <div class="q-my-sm">
            <q-btn
              padding="10px"
              size="md"
              icon="task_alt"
              color="primary"
              to="/quests"/>
          </div>
          <div class="q-my-sm">
            <q-btn
              padding="10px"
              size="md"
              icon="emoji_events"
              color="primary"
              to="/achievements"/>
          </div>
        </q-page-sticky>
    </q-page>
  </q-page-wrapper>
</template>

<script setup>
import LessonList from '../components/LessonList.vue'
import CourseToggle from '../components/CourseToggle.vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import { ref, reactive, watch, onActivated } from 'vue'
import { useUserStore } from '../stores/user'
import { useCourse } from '../composables/useCourse'
import { useRoute } from 'vue-router'

const { user } = useUserStore()
const route = useRoute()

const dialog = reactive({ active: false })
const header = ref(null)
const onScroll = function (event) { header.value.onScroll(event) }

const { course, getItem } = useCourse()

onActivated(async () => {
  await getItem(route.params.course_id)
})
watch(() => route.params.course_id, (newData, oldData) => {
  getItem(route.params.course_id)
})
</script>
