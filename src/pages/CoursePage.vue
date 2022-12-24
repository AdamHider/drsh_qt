<template>
    <q-app-header class="transparent text-white rounded-b-md" reveal>
      <CourseToggle v-bind:dialogOpened="dialog" v-on:update:dialogOpened="dialog = $event"/>
      <q-toolbar-title></q-toolbar-title>
      <q-btn flat round dense class="q-mr-sm" icon="share"/>
      <q-btn flat round dense class="q-mr-sm"  icon="more_vert"/>
    </q-app-header>
    <q-page  class="flex justify-center items-end full-height full-width text-center" style="padding-top: 50px" >
      <q-card flat class="transparent">
        <q-card-section v-if="course.active?.id">
          <div class="text-h6">{{course.active?.title}}</div>
        </q-card-section>
        <q-card-section class="text-white" v-else>
          <div class="text-h6">Choose course</div>
          <div class="text-caption">And start your investigation</div>
          <q-btn color="dark" @click="dialog=true">Choose</q-btn>
        </q-card-section>
      </q-card>
      <LessonList v-if="course.active?.id"/>
    </q-page>
</template>

<script setup>
import LessonList from '../components/LessonList.vue'
import CourseToggle from '../components/CourseToggle.vue'
import CourseSlider from '../components/CourseSlider.vue'
import { ref, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { useCourse } from '../composables/useCourse'

const { user } = useUserStore()

const dialog = ref(false)

const { course, getActive } = useCourse()

getActive()
watch(() => user.active?.data.profile?.active_course_id, async (newData, oldData) => {
  getActive()
})

</script>
