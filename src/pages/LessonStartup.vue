<template>
  <q-page-container>
    <q-app-header class="transparent text-white rounded-b-md q-py-xs" >
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button" @click.stop="playAudio('click')"/>
        <q-toolbar-title></q-toolbar-title>
        <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.energy" dense no-caption size="24px" push
          @click="() => {if(user.active?.data.resources.energy.quantity == 0) router.push('/market')}"/>
    </q-app-header>
    <q-page class="full-width column justify-center" style="padding-top: 50px; overflow: hidden;">
      <q-card class="transparent no-shadow full-width q-desc-mx-quart" style="position: relative; z-index: 1;">
        <transition
          appear
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOutDown">
                    <LessonSatelliteSlider
                      v-if="transitionTrigger"
                        :slidesPerView="(lesson.active.satellites.length > 1) ? 1.3 : 1.15"
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
          >
          <q-img
          :src="(activeLesson.background_image) ? activeLesson.background_image : lesson.active.course_section?.background_image"
          class="absolute-top absolute-left full-width full-height"
          loading="lazy"
          spinner-color="white"
          />
      </q-page-sticky>

      <q-page-sticky v-if="activeLesson" class="fixed full-width text-white q-desc-mx-75" expand style="z-index: 1;">
        <transition
          appear
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOutDown">
          <q-card flat class="bg-transparent card-container rounded-b-0 full-width"  v-if="dialog && transitionTrigger">
            <q-card-section class="q-pb-sm" style="text-shadow: 0px 1px 2px black;">
                <div class="text-h5">
                  <q-icon v-if="activeLesson.is_blocked === true" name="lock"></q-icon>
                  <q-avatar v-if="activeLesson.is_quest === true" size="18px" font-size="12px" color="secondary" text-color="white" icon="priority_high" class="vertical-middle q-mr-xs"  style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;"/>
                  <b>{{activeLesson.title}}</b>
                </div>
                <div class="text-subtitle2 text-grey-3">
                  <b>{{ lesson.active.course_section?.title }}</b>
                </div>
                <div :class="`text-caption satellite-description ${(expandDescription) ? '': 'max-two-lines'}`" @click="expandDescription = !expandDescription">
                  {{activeLesson.description}}
                </div>
                <div class="text-caption" @click="expandDescription = !expandDescription"  @click.stop="playAudio('click')">
                  <b v-if="expandDescription">Свернуть <q-icon name="keyboard_arrow_up"></q-icon></b>
                  <b v-else>Показать ещё <q-icon name="keyboard_arrow_down"></q-icon></b>
                </div>
            </q-card-section>
            <q-card-section class="q-py-none" v-if="activeLesson?.is_blocked === false">
              <keep-alive>
                <lesson-progress-bar size="25px" dark :value="activeLesson.progress" :reward="activeLesson.reward" :exercise="activeLesson.exercise"/>
              </keep-alive>
            </q-card-section>
            <q-card-section class="q-pt-sm" v-else-if="activeLesson?.unblock">
              <div class="text-subtitle1"><b>Для разблокировки необходимо:</b></div>
              <div v-if="activeLesson.unblock?.lessons?.length > 0">
                <q-list>
                  <q-item clickable v-ripple class="text-left q-px-none"  v-for="(unblockLesson, unblockLessonIndex) in activeLesson.unblock.lessons" :key="`unblockLessonIndex-${unblockLessonIndex}`"
                    @click="goToSattelite(unblockLesson)" @click.stop="playAudio('click')">
                    <q-item-section avatar>
                        <q-img :src="unblockLesson.image"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption lines="1" class="text-white"><b>Изучить планету</b></q-item-label>
                      <q-item-label><b>"{{ unblockLesson.title }}"</b></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn v-if="unblockLesson.unblocked === '1'" size="12px" flat color="positive" dense round icon="check_circle" />
                      <q-btn v-else size="12px" flat dense round icon="chevron_right" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div v-if="activeLesson?.unblock?.skills?.length > 0">
                <q-list>
                  <q-item clickable v-ripple class="text-left q-px-none"  v-for="(unblockSkill, unblockSkillIndex) in activeLesson.unblock.skills" :key="`unblockLessonIndex-${unblockSkillIndex}`"
                    :to="{ path: '/skills', query: { target_id: unblockSkill.id, back_link: true } }" @click.stop="playAudio('click')">
                    <q-item-section avatar>
                        <q-img :src="unblockSkill.image"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption lines="1" class="text-white"><b>Исследовать технологию</b></q-item-label>
                      <q-item-label><b> "{{ unblockSkill.title }}"</b></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn v-if="unblockSkill.unblocked == '1'" size="12px" color="positive" flat dense round icon="check_circle" />
                      <q-btn v-else size="12px" flat dense round icon="chevron_right" />
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
                color="gradient-secondary"
                class="full-width"
                :loading="buttonLoading"
                @click="redo(activeLesson.id)"/>
              <q-btn v-else-if="activeLesson.exercise?.id"
                push
                label="Продолжить"
                icon-right="play_arrow"
                color="gradient-green"
                class="q-px-md full-width"
                :loading="buttonLoading"
                @click="open(activeLesson.id)"/>
              <q-spend-button v-else
                push
                color="gradient-primary"
                icon-right="play_arrow"
                class="full-width"
                :resources="activeLesson.cost ?? []"
                :loading="buttonLoading"
                @click="start(activeLesson.id)"></q-spend-button>
            </q-card-actions>
          </q-card>
        </transition>
      </q-page-sticky>
      <div v-if="lesson.active.satellites?.length > 0">
         <div v-for="(satelliteItem, index) in lesson.active.satellites" :key="`satelliteItemImage${index}`">
          <img :src="satelliteItem.image" width="0px"/>
        </div>
      </div>
    </q-page>
    <q-dialog v-model="lowEnergyDialog" position="bottom">
      <div class="full-width column">
        <div class="row">
          <div class="col-6">
            <transition
              appear
              enter-active-class="animated fadeInUp"
              leave-active-class="animated fadeOutDown">
              <img src="/images/characters/codex_full_low_energy.png" style="width: 130%; z-index: -1; margin-bottom: -20px; float: right;"/>
            </transition>
          </div>
        </div>
        <q-card class="bg-white rounded-b-0 full-width" style="overflow: visible;">
          <q-card-section>
              <div class="q-pb-md">
                <div class="text-subtitle1"><b>Внимание, не хватает энергии!</b></div>
                <div class="text-caption">Но она скоро появится! Энергия восстанавливается 1ед./час. Чтобы ускорить этот процесс можно изучить технологии в разделе "Энергетика", либо купить энергию в Космо-маркете</div>
              </div>
          </q-card-section>
          <q-card-actions class="flex justify-stretch items-start">
            <q-btn push class="full-width q-mb-sm"  color="gradient-blue" @click="openSkills()" @click.stop="playAudio('click')">К технологиям <q-icon name="biotech"></q-icon></q-btn>
            <q-btn push @click="openMarket()"  class="full-width" color="gradient-green" @click.stop="playAudio('click')">В Космо-маркет <q-icon name="shopping_cart"></q-icon></q-btn>
            <q-btn flat v-close-popup class="full-width q-mt-sm" @click.stop="playAudio('click')"><b>Я подожду</b></q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
  </q-page-container>
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
import { useLoader } from '../composables/useLoader'
import { playAudio } from 'src/services/audioService';



const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const { user } = useUserStore()
const { lesson, getItem, getSatelliteList, setTarget } = useLesson()
const { createItem, redoItem } = useExercise()
const { showLoader, hideLoader } = useLoader()

const lowEnergyDialog = ref(false)

const dialog = ref(false)
const activeIndex = ref(0)
const activeLesson = ref({})
const transitionTrigger = ref(false)
const expandDescription = ref(false)
const isDark = ref(false)
const buttonLoading = ref(false)

const change = (index, noAnimation = 0) => {
  if(!noAnimation) dialog.value = false
  expandDescription.value = false
  if(lesson.active.satellites) activeLesson.value = lesson.active.satellites[index]
  setTimeout(() => {
    dialog.value = true
  }, 250)

}
const start = async (lessonId) => {
  buttonLoading.value = true
  playAudio('click')
  const exerciseCreated = await createItem(lessonId)
  buttonLoading.value = false
  if (!exerciseCreated.error) {
    await useUserStore().getItem()
    router.push(`/lesson-${lessonId}`)
    dialog.value = false
  } else {
    if(exerciseCreated.messages.error == 'not_enough_resources')
    lowEnergyDialog.value = true
  }
}
const open = async (lessonId) => {
  playAudio('click')
  dialog.value = false
  buttonLoading.value = true
  router.push(`/lesson-${lessonId}`)
}
const redo = async (lessonId) => {
  dialog.value = false
  playAudio('click')
  buttonLoading.value = true
  const exerciseRedoCreated = await redoItem(lessonId)
  buttonLoading.value = false
  if (!exerciseRedoCreated.error) router.push(`/lesson-${lessonId}`)
}
const preload = () => {
    lesson.active = lesson.listExtended[route.params.lesson_id]
    transitionTrigger.value = true
    activeIndex.value = lesson.active.satellites?.findIndex((item) => item.id == lesson.target);
    if(activeIndex.value == -1){
      activeIndex.value = 0;
      setTarget(0);
    }
    change(activeIndex.value, true)
}
const load = async (isPartial = 0) => {
  if(!route.params.lesson_id) return false;
  let isFirstLoad = true
  isDark.value = false
  if(lesson.listExtended[route.params.lesson_id]){
    preload()
    isFirstLoad = false
    dialog.value = true
  }

  await getItem(route.params.lesson_id)
  if (lesson.active.error) {
    router.go(-1)
    return
  }
  await getSatelliteList()
  lesson.listExtended[route.params.lesson_id] = lesson.active

  if(isFirstLoad){
    activeIndex.value = lesson.active.satellites?.findIndex((item) => item.id == lesson.target);
    if(activeIndex.value == -1){
      activeIndex.value = 0;
      setTarget(0);
    }
  }
  change(activeIndex.value, !isFirstLoad)
}
const goToSattelite = (unblockLesson) => {
  if(unblockLesson.parent_id) {
    if(unblockLesson.parent_id == route.params.lesson_id) {
      activeIndex.value = lesson.active.satellites?.findIndex((item) => item.id == unblockLesson.id)
      change(activeIndex.value)
    } else {
      setTarget(unblockLesson.id)
      router.push(`lesson-startup-${unblockLesson.parent_id}`)
    }
  } else {
    setTarget(unblockLesson.id)
    router.push(`lesson-startup-${unblockLesson.id}`)
  }
}

const openSkills = () => {
  lowEnergyDialog.value = false
  setTimeout(() => {
    router.push('/skills')
  }, 100)

}
const openMarket = () => {
  lowEnergyDialog.value = false
  setTimeout(() => {
    router.push('/market')
  }, 100)
}
watch(() => activeLesson.value, () => {
  if(!activeLesson.value) return
  isDark.value = activeLesson.value.is_blocked
  activeIndex.value = lesson.active.satellites?.findIndex((item) => item.id == activeLesson.value.id)
})

watch(() => route.params.lesson_id, async () => {
  if(!transitionTrigger.value || route.name !== 'lesson-startup') return
  transitionTrigger.value = false
  setTimeout(async () => {
    await load()
    hideLoader()
    buttonLoading.value = false
    onImagesRendered(() => {
      transitionTrigger.value = true
    })
  }, 250)
})
onActivated(async () =>{
  transitionTrigger.value = false
  await load()
  hideLoader()
  buttonLoading.value = false
  onImagesRendered(() => {
    transitionTrigger.value = true
  })
})
onBeforeRouteLeave((to, from) => {
  if (lowEnergyDialog.value) {
    lowEnergyDialog.value = false
    return false
  }
  return true
})

const onImagesRendered = (callback) => {
  const images = [...document.querySelectorAll("img")];
  images.map(im=>new Promise(res=>
    im.onload = callback
  ))
}


</script>
<style lang="scss">
.card-container{
  position: relative;
  &:before{
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150%;
    background: linear-gradient(to top, #0000006b 35%, #0000 100%);
    pointer-events: none;
  }
}
.satellite-description{
}
.background-space{
  transition: 0.5s all ease;
}
.background-space.dark{
  filter: brightness(0.5) grayscale(1);
}
</style>
