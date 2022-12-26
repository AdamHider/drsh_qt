<template>
    <q-app-header class="transparent text-white rounded-b-md" reveal  ref="header">
      <CourseToggle v-bind:dialogOpened="dialog.active" v-on:update:dialogOpened="dialog.active = $event"/>
      <q-toolbar-title></q-toolbar-title>
      <q-btn flat round dense class="q-mr-sm" icon="share"/>
      <q-btn flat round dense class="q-mr-sm"  icon="more_vert"/>
    </q-app-header>
    <q-page  class=" items-end full-height full-width text-center" >
      <q-scroll-area class="absolute-top absolute-left full-width full-height"  
        :content-style="{
          display: 'flex',
          justifyContent: 'end',
          flexDirection: 'column'}"
        style="z-index: 10;" >
        <LessonList v-if="course.active?.id" :disable="dialog.active"/>
        <q-card flat class="transparent">
          <q-card-section v-if="course.active?.id" class="text-white" style="padding-top: 80px">
            <div class="text-h6">{{course.active?.title}}</div>
            <div class="text-caption">Investigate to the infinity</div>
          </q-card-section>
          <q-card-section v-else class="text-white" >
            <div class="text-h6">Choose course</div>
            <div class="text-caption">And start your investigation</div>
            <q-btn color="dark" @click="dialog.active=true">Choose</q-btn>
          </q-card-section>
        </q-card>
        <q-page-sticky position="bottom" style="margin-bottom: 20px;">
          <q-img :src="`${CONFIG.API_HOST}/images/dershane/robot/rocket.png`" width="50px"/>
        </q-page-sticky>
        <q-scroll-observer @scroll="onScroll" />
      </q-scroll-area>
    </q-page>
</template>

<script setup>
import LessonList from '../components/LessonList.vue'
import CourseToggle from '../components/CourseToggle.vue'
import CourseSlider from '../components/CourseSlider.vue'
import { ref, reactive, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { useCourse } from '../composables/useCourse'
import { CONFIG } from '../config.js'

const { user } = useUserStore()

const dialog = reactive({ active: false })
const header = ref(null)
const onScroll = function (event) { header.value.onScroll(event) }

const { course, getActive } = useCourse()

getActive()
watch(() => user.active?.data.profile?.active_course_id, async (newData, oldData) => {
  getActive()
})
</script>
