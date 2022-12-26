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
        <q-card-section>
            <div class="text-h6">Sattelites</div>
        </q-card-section>
        <LessonSatteliteSlider
            :slidesPerView=3.4
            :centerAligned="false"
            :withButton="false"
            slideHeight="100"
            :navigation="false"
            captionMode="full"
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
    <q-page-sticky position="bottom" class="q-pa-md">
        <q-btn class="full-width" label="Start" color="primary"></q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useLesson } from '../composables/useLesson'
import LessonSatteliteSlider from '../components/LessonSatteliteSlider.vue'
import { useRoute, useRouter } from 'vue-router'
import { onActivated } from 'vue'
import { CONFIG } from '../config.js'

const { lesson, getItem, getSatteliteList } = useLesson()
const { user, signOut } = useUserStore()
const router = useRouter()
const route = useRoute()

onActivated(async () => {
    await getItem(route.params.lesson_id)
    
    getSatteliteList()
})
const exitUser = async function () {
  await signOut()
  return router.push('/authorization')
}

</script>
