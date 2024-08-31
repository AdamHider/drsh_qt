<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md " reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title>Settings</q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
      <q-card flat bordered v-for="lesson in lessons" :key="lesson.id" class="q-my-sm" >
        <q-item >
          <q-item-section avatar>
            <q-avatar>
              <img :src="lesson.image">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ lesson.title }}</q-item-label>
            <q-item-label caption>
              {{ lesson.course_title }} -> {{ lesson.course_section_title }}
            </q-item-label>
          </q-item-section>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn class="gt-xs" size="12px" flat round icon="settings" :to="`/admin/lesson-edit-${lesson.id}`"/>
                  <q-btn class="gt-xs" size="12px" flat round icon="delete" color="negative" @click="deleteLesson(lesson.id)"/>
                </div>
        </q-item>

        <q-separator />

        <q-card-section horizontal class="q-pl-md">
          <q-list class="full-width">
            <q-item v-for="satellite in lesson.satellites" :key="satellite.id"  dense class="q-my-sm">
              <q-item-section avatar>
                <q-avatar  text-color="white">
                  <img :src="satellite.image" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ satellite.title }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn class="gt-xs" size="12px" flat round icon="settings" :to="`/admin/lesson-edit-${satellite.id}`"/>
                  <q-btn class="gt-xs" size="12px" flat round icon="delete" color="negative" @click="deleteLesson(satellite.id)"/>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { useUserStore } from '../../stores/user'
import { useRouter } from 'vue-router'
import { reactive, ref, watch, onActivated } from 'vue'
import { api } from '../../services/index'

const { user, signOut } = useUserStore()
const router = useRouter()

const lessons = ref({})

const load = async function (filter) {
  const lessonListResponse = await api.admin.lesson.getList({ })
  if (lessonListResponse.error) {
    error.value = lessonListResponse
    lessons.value = {}
    return {}
  }
  lessons.value = lessonListResponse
}
const deleteLesson = async function (lesson_id) {
  const lessonDeleteResponse = await api.admin.lesson.deleteItem({ lesson_id })
  if (lessonDeleteResponse.error) {
    error.value = lessonDeleteResponse
    return {}
  }
}
onActivated(() => {
  load()
})
</script>
