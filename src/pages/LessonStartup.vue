<template>
  <q-app-header class="transparent text-white rounded-b-md" reveal>
      <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
    <q-toolbar-title></q-toolbar-title>
  </q-app-header>
  <q-page class="text-center full-width" style="padding-top: 50px">
    <q-card class="transparent no-shadow full-width" style="position: relative; z-index: 1;">
        <q-card-section>
            <q-img
                :src="`${CONFIG.API_HOST}/${lesson.active.image}`"
                style="max-width: 250px; width: 230px;"
                no-spinner
            />
        </q-card-section>
    </q-card>
    <q-card flat class="relative text-white text-left transparent full-width " style="z-index: 1;">
        <q-card-section>
            <div class="text-h5"><b>{{lesson.active.intro?.subtitle}}</b></div>
            <div class="text-caption">{{lesson.active.intro?.description_text}}</div>
        </q-card-section>
        <q-card-section v-if="lesson.active.master_lesson?.id">
            <div class="text-caption">
              This lesson is sattelite of
              <router-link :to="`/lesson-startup-${lesson.active.master_lesson.id}`">
                {{ lesson.active.master_lesson.intro.subtitle }}
              </router-link>
            </div>
        </q-card-section>
        <q-card-actions class="text-right">
          <q-btn v-if="lesson.active.exercise?.finished_at" class="full-width" label="Redo" color="warning" @click="start(lesson.active.id)"></q-btn>
          <q-btn v-else-if="lesson.active.exercise?.id" class="full-width" label="Continue" color="positive" @click="start(lesson.active.id)"></q-btn>
          <q-btn v-else class="full-width" label="Start" color="primary" @click="start(lesson.active.id)"></q-btn>
        </q-card-actions>
        <q-card-section v-if="lesson.active.sattelites?.list.length > 0">
            <div class="text-h6">Sattelites</div>
        </q-card-section>
        <LessonSatteliteSlider
            :slidesPerView=3.4
            :centerAligned="false"
            :withButton="false"
            slideHeight="100"
            :navigation="false"
            captionMode="full"
            @select="select"
        />
    </q-card>
    <q-page-sticky
        class="fixed full-width full-height"
        :style="`background: ${lesson.active.parent_description?.background_gradient}; transform: none`"
        >
        <q-img
        :src="`${CONFIG.API_HOST}/${lesson.active.parent_description?.background_image}`"
        class="absolute-top absolute-left full-width full-height"
        loading="lazy"
        spinner-color="white"
        />
    </q-page-sticky>
    <q-dialog v-model="dialog">
      <q-card flat class="relative text-center" style="overflow: visible">
          <q-img
              class=""
              :src="`${CONFIG.API_HOST}/${activeSattelite.image}`"
              style="max-width: 250px; width: 180px; margin-top: -80px"
              no-spinner
          />
        <q-card-section class="text-left">
            <div class="text-h5"><b>{{activeSattelite.intro?.subtitle}}</b></div>
            <div class="text-caption">{{activeSattelite.intro?.description_text}}</div>
        </q-card-section>
        <q-card-actions class="text-right">
          <q-btn v-if="activeSattelite.exercise?.finished_at" class="full-width" label="Redo" color="warning" @click="start(activeSattelite.id)"></q-btn>
          <q-btn v-else-if="activeSattelite.exercise?.id" class="full-width" label="Continue" color="positive" @click="start(activeSattelite.id)"></q-btn>
          <q-btn v-else class="full-width" label="Start" color="primary" @click="start(activeSattelite.id)"></q-btn>
        </q-card-actions>
      </q-card>

    </q-dialog>
  </q-page>
</template>

<script setup>
import { useLesson } from '../composables/useLesson'
import { useExercise } from '../composables/useExercise'
import LessonSatteliteSlider from '../components/LessonSatteliteSlider.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, onActivated, watch } from 'vue'
import { CONFIG } from '../config.js'

const router = useRouter()
const route = useRoute()
const { lesson, getItem, getSatteliteList } = useLesson()
const { addItem } = useExercise()
const dialog = ref(false)
const activeSattelite = ref({})

const select = (index) => {
  activeSattelite.value = lesson.active.sattelites.list[index]
  dialog.value = true
}
const start = async (lessonId) => {
  const exerciseCreated = await addItem(lessonId)
  console.log(exerciseCreated)
  if (exerciseCreated) router.push(`/lesson-${lessonId}`)
}

onActivated(async () => {
  await getItem(route.params.lesson_id)
  getSatteliteList()
})

watch(() => route.params.lesson_id, async () => {
  await getItem(route.params.lesson_id)
  getSatteliteList()
})
</script>
