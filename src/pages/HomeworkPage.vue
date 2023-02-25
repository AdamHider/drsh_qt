<template>
  <q-page-container>
    <q-app-header class=" rounded-b-md" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
      <q-toolbar-title>Task</q-toolbar-title>
    </q-app-header>
    <q-page class="text-center bg-white full-width" style="padding-top: 50px" >
      <transition
              appear
              enter-active-class="animated zoomIn animation-slow"
              leave-active-class="animated rubberBand  animation-delay-1" >
        <q-card v-if="transitionTrigger"
            class="transparent no-shadow full-width"
            style="position: relative; z-index: 1;"
          >
            <q-card-section
            class="q-ma-md"
            :style="`background: ${homework.active?.course_section?.background_gradient}; `">
                <q-img
                  :src="homework.active?.course_section?.background_image"
                  class="absolute-top absolute-left full-width full-height"
                  loading="lazy"
                  spinner-color="white"
                />
                  <q-img
                      :src="homework.active?.image"
                      style="max-width: 200px; width: 150px;"
                      no-spinner
                  />
            </q-card-section>
        </q-card>
      </transition>
      <transition
        appear
        enter-active-class="animated zoomIn animation-delay-1"
        leave-active-class="animated zoomOut">
      <q-card flat class="relative text-left transparent full-width " style="z-index: 1;"
        v-if="transitionTrigger">
          <q-card-section>
              <div class="text-h6"><b>You need to complete:</b></div>
              <div class="text-h5"><b>{{homework.active?.title}}</b></div>
              <div class="text-caption">{{homework.active?.description}}</div>
          </q-card-section>

      </q-card>
      </transition>
      <q-tabs
          v-model="tab"
          inline-label
        >
          <q-tab name="main" icon="list" label="Details" />
          <q-tab name="leaderboard" icon="bar_chart" label="Score" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel name="main" class="q-px-none" >
            <q-card flat class="relative text-left transparent full-width " style="z-index: 1;"
              v-if="transitionTrigger">
              <q-card-section class="q-py-sm">
                  <q-list separator>
                    <q-item class="q-px-none">
                      <q-item-section top avatar>
                        <q-avatar color="primary" text-color="white" icon="ads_click" />
                      </q-item-section>
                      <q-item-section v-if="!homework.active?.is_blocked" class="text-left">
                        <q-item-label>Complete lesson</q-item-label>
                        <q-item-label caption lines="2">Just complete lesson within a.</q-item-label>
                      </q-item-section>
                      <q-item-section v-else class="text-left">
                        <q-item-label>This lesson is not yet available for you</q-item-label>
                        <q-item-label caption lines="2">Please, complete previous lessons first.</q-item-label>
                      </q-item-section>
                      <q-item-section v-if="!homework.active?.is_blocked && !homework.active?.is_finished" class="text-left">
                        <q-btn v-if="!homework.active?.exercise?.finished_at" class="full-width" label="Start" color="primary" icon="rocket" @click="router.push(`lesson-startup-${homework.active?.lesson_id}`)"></q-btn>
                        <q-btn v-else class="full-width" label="Done" color="positive" icon="check" @click="router.push(`lesson-startup-${homework.active?.lesson_id}`)"></q-btn>
                      </q-item-section>
                      <q-item-section v-else-if="homework.active?.is_blocked" class="text-left">
                        <q-btn flat class="full-width" label="Go to the previous" icon="rocket" @click="router.push(`lesson-startup-${homework.active?.unblock_after}`)"></q-btn>
                      </q-item-section>
                    </q-item>
                    <q-item  v-if="homework.active?.date_start_humanized"  class="q-px-none">
                      <q-item-section top avatar>
                        <q-avatar color="primary" text-color="white" icon="outlined_flag" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Start date</q-item-label>
                        <q-item-label caption lines="2">The date challenge starts.</q-item-label>
                      </q-item-section>
                      <q-item-section side class="text-dark">
                        <b style="font-size: 16px">{{homework.active?.date_start_humanized}}</b>
                      </q-item-section>
                    </q-item>
                    <q-item  v-if="homework.active?.date_end_humanized"  class="q-px-none">
                      <q-item-section top avatar>
                        <q-avatar color="primary" text-color="white" icon="flag" />
                      </q-item-section>
                      <q-item-section v-if="!homework.active?.is_finished">
                        <q-item-label>End date</q-item-label>
                        <q-item-label caption lines="2">The date challenge finishes.</q-item-label>
                      </q-item-section>
                      <q-item-section v-else>
                        <q-item-label>This challenge is finished</q-item-label>
                      </q-item-section>
                      <q-item-section side class="text-dark">
                        <b style="font-size: 16px">{{homework.active?.date_end_humanized}}</b>
                      </q-item-section>
                    </q-item>
                  </q-list>
              </q-card-section>
              <q-card-section class="q-py-sm text-left"  v-if="!homework.active?.is_blocked && !homework.active?.is_finished" >
                  <div class="row q-my-sm" >
                      <div class="col-12 self-end text-right">
                          <b>{{homework.active?.exercise?.data.progress_percentage || 0 }}%</b>
                      </div>
                  </div>
                  <q-linear-progress
                      :color="(homework.active?.exercise?.data.progress_percentage/100) >= 1 ? 'positive' : 'primary'"
                      :value="(homework.active?.exercise?.data.progress_percentage / 100) || 0"
                      size="12px"
                      rounded
                  ></q-linear-progress>
              </q-card-section>
            </q-card>
          </q-tab-panel>
        <q-tab-panel name="leaderboard" class="q-px-none" >
          <q-card flat>
            <q-card-section  class="q-pa-none ">
              <LeaderboardTable
                :allowed-filters="['time_period']"
                by-classroom
                :lesson-id="homework.active?.lesson_id"
              />
            </q-card-section>
          </q-card>
        </q-tab-panel>
        </q-tab-panels>
    </q-page>
  </q-page-container>
</template>

<script setup>
import { useHomework } from '../composables/useHomework'
import LeaderboardTable from '../components/LeaderboardTable.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()
const { homework, getItem } = useHomework()
const transitionTrigger = ref(false)
const tab = ref('main')

onMounted(async () => {
  const homeworkResponse = await getItem(route.params.homework_id)
  if (homeworkResponse.error) {
    return router.go(-1)
  }
  transitionTrigger.value = true
})
</script>
