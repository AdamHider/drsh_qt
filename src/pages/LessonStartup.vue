<template>
  <q-page-wrapper>
    <q-app-header class="transparent text-white rounded-b-md" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title></q-toolbar-title>
        <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.energy" dense no-caption size="28px" transparent/>
    </q-app-header>
    <q-page class="full-width" style="padding-top: 50px; overflow: hidden;">
      <q-card class="transparent no-shadow full-width " style="position: relative; z-index: 1;">
            <transition
              appear
              enter-active-class="animated fadeIn animation-delay-2"
              leave-active-class="animated fadeOut">
                <LessonSatelliteSlider
                    v-if="transitionTrigger"
                    :slidesPerView=1.3
                    :centerAligned="true"
                    :withButton="false"
                    slideHeight="100"
                    :navigation="false"
                    captionMode="full"
                    @change="change"
                    :activeSlide="activeIndex"
                />
            </transition>
      </q-card>

        <q-page-sticky
            class="fixed full-width full-height"
            :style="`background: ${lesson.active.course_section?.background_gradient}; transform: none`"
            >
            <q-img
            :src="lesson.active.course_section?.background_image"
            class="absolute-top absolute-left full-width full-height"
            loading="lazy"
            spinner-color="white"
            />
        </q-page-sticky>
        <q-page-sticky class="fixed full-width text-white" expand style="z-index: 1;">
          <transition
            appear
            enter-active-class="animated fadeInUp"
            leave-active-class="animated fadeOutDown">
            <q-card flat class="bg-transparent rounded-b-0 full-width"  v-if="transitionTrigger && dialog">
              <q-card-section class="q-pb-sm">
                  <div class="text-h5"><q-icon v-if="activeLesson.is_blocked === true" name="lock"></q-icon> <b>{{activeLesson.title}}</b></div>
                  <div :class="`text-caption satellite-description ${(expandDescription) ? '': 'max-two-lines'}`" @click="expandDescription = !expandDescription">
                    {{activeLesson.description}}
                  </div>
                  <div @click="expandDescription = !expandDescription">
                    <b v-if="expandDescription">Свернуть</b>
                    <b v-else>Показать ещё</b>
                  </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <lesson-progress-bar size="25px" dark :value="activeLesson.progress" :reward="activeLesson.reward" :exercise="activeLesson.exercise"/>
              </q-card-section>
              <q-card-actions class="text-right justify-end q-pa-md" v-if="!activeLesson.is_blocked">
                <q-btn v-if="activeLesson.exercise?.finished_at"
                  push
                  label="Заново"
                  icon="replay"
                  color="gradient-orange"
                  class="full-width"
                  @click="redo(activeLesson.id)"/>
                <q-btn v-else-if="activeLesson.exercise?.id"
                  push
                  label="Продолжить"
                  icon-right="play_arrow"
                  color="gradient-green"
                  class="q-px-md full-width"
                  @click="open(activeLesson.id)"/>
                <q-spend-button v-else
                  push
                  color="gradient-blue"
                  icon-right="play_arrow"
                  class="full-width"
                  :resources="activeLesson.cost ?? {}"
                  @click="start(activeLesson.id)"></q-spend-button>
              </q-card-actions>
              <q-card-actions class="text-right justify-end q-pa-md" v-else>
                <q-btn
                  push
                  label="Заблокировано"
                  icon="lock"
                  color="grey-8"
                  class="full-width"/>
              </q-card-actions>
            </q-card>
          </transition>
        </q-page-sticky>
    </q-page>
  </q-page-wrapper>
</template>

<script setup>
import { useLesson } from '../composables/useLesson'
import { useExercise } from '../composables/useExercise'
import LessonSatelliteSlider from '../components/LessonSatelliteSlider.vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import LessonProgressBar from '../components/LessonProgressBar.vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, onActivated } from 'vue'
import { useUserStore } from '../stores/user'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const { user } = useUserStore()
const { lesson, getItem, getSatelliteList } = useLesson()
const { createItem, redoItem } = useExercise()
const dialog = ref(false)
const activeIndex = ref(0)
const activeLesson = ref({})
const transitionTrigger = ref(false)
const expandDescription = ref(false)

const change = (index) => {
  dialog.value = false
  expandDescription.value = false
  activeLesson.value = lesson.active.satellites?.list[index]
  setTimeout(() => {
    dialog.value = true
  }, 250)

}
const start = async (lessonId) => {
  const exerciseCreated = await createItem(lessonId)
  if (!exerciseCreated.error) {
    await useUserStore().getItem()
    router.push(`/lesson-${lessonId}`)
    dialog.value = false
  } else {
    $q.notify({
      message: exerciseCreated.messages.error,
      type: 'negative'
    })
  }
}
const open = async (lessonId) => {
  dialog.value = false
  router.push(`/lesson-${lessonId}`)
}
const redo = async (lessonId) => {
  dialog.value = false
  const exerciseRedoCreated = await redoItem(lessonId)
  if (!exerciseRedoCreated.error) router.push(`/lesson-${lessonId}`)
}

onActivated(async () => {
  dialog.value = false
  await getItem(route.params.lesson_id)
  transitionTrigger.value = true
  if (lesson.active.error) {
    router.go(-1)
    return
  }
  await getSatelliteList()
  activeIndex.value = 0;
  if(route.params.prev_lesson_id){
    activeIndex.value = lesson.active.satellites?.list.findIndex((item) => item.id == route.params.prev_lesson_id)
  }
  change(activeIndex.value)
})

onBeforeRouteLeave((to, from, next) => {
  transitionTrigger.value = false
  setTimeout(() => {
    next()
  }, 250)
})
</script>
<style lang="scss">
.satellite-description{
}
</style>
