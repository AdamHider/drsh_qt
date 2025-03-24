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
            :class="`fixed full-width full-height background-space ${(isDark) ? 'dark': ''}`"
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
                  <div class="text-caption" @click="expandDescription = !expandDescription">
                    <b v-if="expandDescription">Свернуть <q-icon name="keyboard_arrow_up"></q-icon></b>
                    <b v-else>Показать ещё <q-icon name="keyboard_arrow_down"></q-icon></b>
                  </div>
              </q-card-section>
              <q-card-section class="q-py-none" v-if="activeLesson.is_blocked === false">
                <lesson-progress-bar size="25px" dark :value="activeLesson.progress" :reward="activeLesson.reward" :exercise="activeLesson.exercise"/>
              </q-card-section>
              <q-card-section class="q-pt-sm" v-else-if="activeLesson.unblock">
                <div class="text-subtitle1"><b>Для разблокировки необходимо:</b></div>
                <div v-if="activeLesson.unblock?.lessons?.length > 0">
                  <q-list>
                    <q-item clickable v-ripple class="text-left q-px-none"  v-for="(unblockLesson, unblockLessonIndex) in activeLesson.unblock.lessons" :key="`unblockLessonIndex-${unblockLessonIndex}`"
                      @click="goToSattelite(unblockLesson)">
                      <q-item-section avatar>
                          <q-img :src="unblockLesson.image"/>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption lines="1" class="text-white"><b>Изучить планету</b></q-item-label>
                        <q-item-label><b>"{{ unblockLesson.title }}"</b></q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn size="12px" flat dense round icon="chevron_right" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <div v-if="activeLesson.unblock?.skills?.length > 0">
                  <q-list>
                    <q-item clickable v-ripple class="text-left q-px-none"  v-for="(unblockSkill, unblockSkillIndex) in activeLesson.unblock.skills" :key="`unblockLessonIndex-${unblockSkillIndex}`"
                      :to="`/skills`">
                      <q-item-section avatar>
                          <q-img :src="unblockSkill.image"/>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption lines="1" class="text-white"><b>Исследовать технологию</b></q-item-label>
                        <q-item-label><b> "{{ unblockSkill.title }}"</b></q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn size="12px" flat dense round icon="chevron_right" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-card-section>
              <q-card-section v-else>
                <div class="text-subtitle1 text-center"><b>Заблокировано</b></div>
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
import { ref, onActivated, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const { user } = useUserStore()
const { lesson, getItem, getSatelliteList, setTarget, getTarget } = useLesson()
const { createItem, redoItem } = useExercise()
const dialog = ref(false)
const activeIndex = ref(0)
const activeLesson = ref({})
const transitionTrigger = ref(false)
const expandDescription = ref(false)
const isDark = ref(false)

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

onActivated( () => {
  load()
})
const load = async () => {
  isDark.value = false
  dialog.value = false
  await getItem(route.params.lesson_id)
  transitionTrigger.value = true
  if (lesson.active.error) {
    router.go(-1)
    return
  }
  await getSatelliteList()
  activeIndex.value = 0;
  if(lesson.target){
    activeIndex.value = lesson.active.satellites?.list.findIndex((item) => item.id == lesson.target)
    if(activeIndex.value == -1){
      activeIndex.value = 0;
      setTarget(null);
    }
  }
  change(activeIndex.value)
}
const goToSattelite = (unblockLesson) => {
  if(unblockLesson.parent_id) {
    if(unblockLesson.parent_id == route.params.lesson_id) {
      activeIndex.value = lesson.active.satellites?.list.findIndex((item) => item.id == unblockLesson.id)
      change(activeIndex.value)
    } else {
      setTarget(unblockLesson.id)
      router.replace(`lesson-startup-${unblockLesson.parent_id}`)
    }
  } else {
    setTarget(unblockLesson.id)
    router.replace(`lesson-startup-${unblockLesson.id}`)
  }
}
onBeforeRouteLeave((to, from, next) => {
  transitionTrigger.value = false
  isDark.value = false
  setTimeout(() => {
    setTarget(null)
    next()
  }, 250)
})
watch(() => activeLesson.value, () => {
  if(!activeLesson.value) return
  isDark.value = activeLesson.value.is_blocked
  activeIndex.value = lesson.active.satellites?.list.findIndex((item) => item.id == activeLesson.value.id)
})
watch(() => route.params.lesson_id, () => {
  load()
})


</script>
<style lang="scss">
.satellite-description{
}
.background-space{
  transition: 0.5s all ease;
}
.background-space.dark{
  filter: brightness(0.5) grayscale(1);
}
</style>
