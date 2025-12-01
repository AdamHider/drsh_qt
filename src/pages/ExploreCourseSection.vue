<template>
  <q-page-container>
    <q-app-header class="transparent text-white rounded-b-md q-py-xs" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button" @click.stop="playAudio('click')"/>
        <q-toolbar-title></q-toolbar-title>
        <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.energy" dense no-caption size="24px" push
          @click="() => {if(user.active?.data.resources.energy.quantity == 0) router.push('/market')}"/>
    </q-app-header>
    <q-page class="bg-white"  style="padding-top: 50px; padding-bottom: 48px;">
      <div class="page-background fixed-top full-width"  :style="`height: 400px; background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)), url('${courseSection.background_image}'); background-size: cover;`"></div>
      <q-card class="text-center transparent no-shadow full-width justify-center column " style="position: relative; min-height: 150px">
          <q-card-section class="text-white text-left q-pb-none"  style="text-shadow: 2px 2px 5px black;">
            <div class="text-subtitle1"><b>{{ courseSection.title }}</b></div>
            <div :class="`text-caption satellite-description ${(expandDescription) ? '': 'max-two-lines'}`" @click="expandDescription = !expandDescription">
              {{courseSection.description}}
            </div>
            <div class="text-caption" @click="expandDescription = !expandDescription"  @click.stop="playAudio('click')">
              <b v-if="expandDescription">Свернуть <q-icon name="keyboard_arrow_up"></q-icon></b>
              <b v-else>Показать ещё <q-icon name="keyboard_arrow_down"></q-icon></b>
            </div>
            <div class="flex justify-between text-caption q-ma-xs">
              <div><b>Исследовано:</b></div>
              <div><b>{{ courseSection.progress?.percentage }}%</b></div>
            </div>
            <q-progress-bar :value="courseSection.progress?.percentage" size="20px" color="orange" dark/>
          </q-card-section>
      </q-card>
      <q-card flat class="q-main-card relative text-left q-pt-md q-pb-md rounded-borders rounded-b-0 full-width" style="flex: 1; min-height: 50vh; margin-top: 20px;">
        <q-card-section class="q-py-none">
          <div class="text-subtitle1"><b>Планеты:</b></div>
        </q-card-section>
        <q-card-section class="q-pa-none" v-if="courseSectioneLssons.length > 0">
          <q-list class="q-px-md">
            <q-item v-for="(lessonItem, lessonItemIndex) in courseSectioneLssons" :key="`lessonItemIndex-${lessonItemIndex}`" clickable v-ripple
              :class="`q-push q-mt-sm relative-position rounded-md  text-white text-shadow ${lessonItem.is_blocked ? 'is-blocked' : ''}`" @click="router.push(`/lesson-startup-${lessonItem.id}`)"
              :style="`border-color: rgba(0, 0, 0, 0.7); background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)), url(${(lessonItem.background_image) ? lessonItem.background_image : lessonItem.course_section.background_image}); background-size: cover; background-position: center;`">
              <q-item-section avatar>
                <q-img class="planet-image allow-overflow" :src="lessonItem.image" width="80px" style="filter: drop-shadow(rgba(53, 173, 244, 0.62) 0px 5px 10px);" no-spinner/>
              </q-item-section>
              <q-item-section>
                <div class="text-subtitle1"><b>{{ lessonItem.title }}</b></div>
                <div class="text-sm max-two-lines">{{ lessonItem.description }}</div>
                <div>
                  <q-chip v-if="lessonItem.progress > 0" class="q-ma-none" size="sm" text-color="white" color="dark-transparent-50"><b>Изучено: <span :class="lessonItem.progress > 0 ? ((lessonItem.progress == 100) ? 'text-positive' : 'text-warning') : ''">{{ lessonItem.progress }}%</span></b></q-chip>
                  <q-chip v-else-if="lessonItem.is_blocked" class="q-ma-none" size="sm" text-color="white" color="dark-transparent-50"><b>Премиум-планета</b></q-chip>
                  <q-chip v-else class="q-ma-none" size="sm" text-color="white" color="dark-transparent-50"><b>Не изучено</b></q-chip>
                </div>
              </q-item-section>
              <q-btn v-if="lessonItem.is_blocked" round class="absolute-top-right" color="dark" icon="lock" push style="top: -5px; right: -5px; rotate: 15deg"></q-btn>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { ref, onMounted, onActivated } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import { playAudio } from 'src/services/audioService';
import { useRoute, useRouter } from 'vue-router'
import UserResourceBar from '../components/UserResourceBar.vue'

const route = useRoute()
const router = useRouter()
const { user } = useUserStore()

const courseSection = ref([])
const courseSectioneLssons = ref([])
const error = ref({})
const expandDescription = ref(false)

const load = async function () {
  const lessonListResponse = await api.explore.getList({course_section_id: route.params.course_section_id})
  if (lessonListResponse.error) {
    error.value = lessonListResponse
    courseSection.value = []
    return
  }
  courseSection.value = lessonListResponse[0].course_section
  courseSectioneLssons.value = lessonListResponse.sort((a, b) => a.is_blocked ? 1 : -1);
}


onMounted(() => {
  load()
})
onActivated(() => {
  courseSection.value = {}
  load()
})

</script>

<style scoped lang="scss">
.is-blocked{
  filter: grayscale(1) brightness(0.9);
}

</style>
