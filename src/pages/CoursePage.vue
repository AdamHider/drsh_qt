<template>
    <q-app-header class="transparent text-white rounded-b-md" reveal>
        <CourseToggle/>
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat round dense class="q-mr-sm" icon="share"/>
        <q-btn flat round dense class="q-mr-sm"  icon="more_vert"/>
    </q-app-header>
    <q-page class="" style="padding-top: 50px">
        <LessonList/>
    </q-page>
</template>

<script setup>
import LessonList from '../components/LessonList.vue'
import CourseToggle from '../components/CourseToggle.vue'
import { ref, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { useCourse } from '../composables/useCourse'

const { user } = useUserStore()

const { course, getActive } = useCourse()

getActive()
watch(() => user.active?.data.profile?.active_course_id, async (newData, oldData) => {
  getActive()
})


</script>
