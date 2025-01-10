<template>
  <q-page-wrapper>
    <q-app-header class="transparent text-white rounded-b-md" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title></q-toolbar-title>
        <UserResourceBar :resource="user.active?.data.resources.energy" dense no-caption size="28px" transparent/>
    </q-app-header>
    <q-page class="text-center full-width" style="padding-top: 50px" v-if="!lesson.active.is_blocked">
      <q-card class="transparent no-shadow full-width" style="position: relative; z-index: 1; height: 300px">
          <q-card-section>
              <transition
                  appear
                  enter-active-class="animated fadeInLeft animation-slow"
                  leave-active-class="animated fadeOutLeft">
                <q-img
                    v-if="transitionTrigger"
                    :src="lesson.active.image"
                    style="position: absolute; width: 500px; top: -25px; left: -150px;"
                    no-spinner
                />
              </transition>
          </q-card-section>
      </q-card>
      <transition
        appear
        enter-active-class="animated zoomIn animation-delay-1 "
        leave-active-class="animated zoomOut">
      <q-card flat class="relative text-white text-left transparent full-width " style="z-index: 1;"
        v-if="transitionTrigger">
          <q-card-section class="q-pb-sm">
              <div class="text-h5"><b>{{lesson.active.title}}</b></div>
              <div class="text-caption">{{lesson.active.description}}</div>
          </q-card-section>
          <q-card-section v-if="lesson.active.parent_id" class="q-pb-sm">
              <div class="text-caption">
                This lesson is sattelite of
                <router-link :to="`/lesson-startup-${lesson.active.parent_id}`">
                  {{ lesson.active.master_lesson.title }}
                </router-link>
              </div>
          </q-card-section>
          <q-card-section class="q-py-sm text-left"  v-if="!lesson.active?.is_blocked && lesson.active.exercise?.id" >
              <div class="row " >
                  <div class="col-12 self-end text-right">
                      <b>{{progressPercentage()*100 || 0 }}%</b>
                  </div>
              </div>
              <q-linear-progress
                  rounded size="20px" class="q-push"
                  :color="(progressPercentage()) >= 1 ? 'positive' : 'white'"
                  :value="progressPercentage() ?? 0"
              ></q-linear-progress>
          </q-card-section>
          <q-card-section v-if="lesson.active.exercise">
            <q-list bordered dark class="bg-dark-transparent rounded-sm">
              <q-expansion-item expand-separator>
                <template v-slot:header>
                  <q-item-section>
                    <q-item-label><b>Points gained</b></q-item-label>
                  </q-item-section>
                  <q-item-section side>
                      <q-item-label class="text-orange text-h6"><b>{{ lesson.active.exercise.data.totals.total }}</b> <q-icon name="star"></q-icon></q-item-label>
                  </q-item-section>
                </template>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Exercises</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-item-label class="text-orange"><b>{{ lesson.active.exercise.data.totals.exercises }}</b> <q-icon name="star"></q-icon></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Time bonus</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-item-label class="text-orange"><b>{{ lesson.active.exercise.data.totals.time }}</b> <q-icon name="star"></q-icon></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator dark/>
                  <q-item>
                    <q-item-section>
                      <q-item-label><b>Total</b></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-item-label class="text-orange text-h6"><b>{{ lesson.active.exercise.data.totals.total }}</b> <q-icon name="star"></q-icon></q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </q-list>
          </q-card-section>
          <q-card-actions class="text-right justify-end">
            <q-btn
                v-if="user.active.data.previleges.is_admin || user.active.data.previleges.is_editor"
                push
                label="Edit"
                icon-right="edit"
                color="dark"
                class="q-px-md"
                @click="edit(lesson.active.id)"/>
            <q-btn v-if="lesson.active.exercise?.finished_at"
              push
              label="Redo"
              icon="replay"
              color="gradient-orange"
              @click="redo(lesson.active.id)"/>
            <q-btn v-else-if="lesson.active.exercise?.id"
              push
              label="Continue"
              icon-right="play_arrow"
              color="gradient-green"
              class="q-px-md"
              @click="open(lesson.active.id)"/>
            <q-spend-button v-else
              push
              color="gradient-blue"
              icon-right="play_arrow"
              :resources="lesson.active.cost ?? {}"
              @click="start(lesson.active.id)"></q-spend-button>
          </q-card-actions>
          <q-card-section v-if="lesson.active.sattelites?.list.length > 0">
              <div class="text-h6">Sattelites</div>
          </q-card-section>
          <transition
            appear
            enter-active-class="animated zoomIn animation-delay-2"
            leave-active-class="animated zoomOut">
              <LessonSatteliteSlider
                  :slidesPerView=3.4
                  :centerAligned="false"
                  :withButton="false"
                  slideHeight="100"
                  :navigation="false"
                  captionMode="full"
                  @select="select"
              />
          </transition>
      </q-card>
      </transition>
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
      <q-dialog v-model="dialog">
        <q-card flat class="relative text-center" style="overflow: visible">
            <q-img
                class=""
                :src="activeSattelite.image"
                style="max-width: 250px; width: 180px; margin-top: -80px"
                no-spinner
            />
          <q-card-section class="text-left">
              <div class="text-h5"><b>{{activeSattelite.title}}</b></div>
              <div class="text-caption">{{activeSattelite.description}}</div>
          </q-card-section>
          <q-card-actions class="justify-end text-right">
            <q-btn v-if="activeSattelite.exercise?.finished_at"
              push
              label="Redo"
              icon-right="replay"
              color="gradient-orange"
              @click="redo(activeSattelite.id)"/>
            <q-btn v-else-if="activeSattelite.exercise?.id"
              push
              label="Continue"
              icon-right="play_arrow"
              color="gradient-green"
              @click="open(activeSattelite.id)"/>
            <q-spend-button v-else
              push
              color="gradient-blue"
              icon-right="play_arrow"
              :resources="activeSattelite.cost"
              @click="start(activeSattelite.id)"></q-spend-button>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-wrapper>
</template>

<script setup>
import { useLesson } from '../composables/useLesson'
import { useExercise } from '../composables/useExercise'
import LessonSatteliteSlider from '../components/LessonSatteliteSlider.vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '../stores/user'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const { user } = useUserStore()
const { lesson, getItem, getSatteliteList } = useLesson()
const { createItem, redoItem } = useExercise()
const dialog = ref(false)
const activeSattelite = ref({})
const transitionTrigger = ref(false)

const select = (index) => {
  activeSattelite.value = lesson.active.sattelites.list[index]
  dialog.value = true
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
const edit = async (lessonId) => {
  router.push(`/admin/lesson-edit-${lessonId}`)
}
const progressPercentage = () => {
  return lesson.active?.exercise?.data.current_page / lesson.active?.exercise?.data.total_pages
}

onMounted(async () => {
  await getItem(route.params.lesson_id)
  transitionTrigger.value = true
  if (lesson.active.error || lesson.active.is_blocked) {
    router.go(-1)
    return
  }
  getSatteliteList()
})

onBeforeRouteLeave((to, from, next) => {
  transitionTrigger.value = false
  console.log(transitionTrigger.value)
  setTimeout(() => {
    next()
  }, 250)
})
</script>
