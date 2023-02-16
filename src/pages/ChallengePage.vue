<template>
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
          :style="`background: ${challenge.active?.course_section?.background_gradient}; `">
              <q-img
                :src="challenge.active?.course_section?.background_image"
                class="absolute-top absolute-left full-width full-height"
                loading="lazy"
                spinner-color="white"
              />
                <q-img
                    :src="challenge.active?.image"
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
            <div class="text-h5"><b>{{challenge.active?.description?.title}}</b></div>
            <div class="text-caption">{{challenge.active?.description?.description}}</div>
        </q-card-section>

    </q-card>
    </transition>
      <q-card flat class="relative text-left transparent full-width " style="z-index: 1;"
        v-if="transitionTrigger">
        <q-card-section class="q-py-sm">
            <div><b>Start date:</b> {{challenge.active?.date_start_humanized}}</div>
            <div><b>End date:</b> {{challenge.active?.date_end_humanized}}</div>
        </q-card-section>
        <q-card-section class="q-py-sm text-left"  v-if="!challenge.active?.is_blocked" >
            <div class="row q-my-sm" >
                <div class="col-12 self-end text-right">
                    <b>{{challenge.active?.progress.percentage || 0 }}%</b>
                </div>
            </div>
            <q-linear-progress
                :color="(challenge.active?.progress.percentage/100) >= 1 ? 'positive' : 'primary'"
                :value="(challenge.active?.progress.percentage / 100) || 0"
                size="12px"
                rounded
            ></q-linear-progress>
        </q-card-section>
      </q-card>
    <q-card flat>
      <q-card-section  class="q-pa-none ">
        <LeaderboardTable
          :allowed-filters="['time_period']"
          by-classroom
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useChallenge } from '../composables/useChallenge'
import LeaderboardTable from '../components/LeaderboardTable.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()
const { challenge, getItem } = useChallenge()
const transitionTrigger = ref(false)

onMounted(async () => {
  await getItem(route.params.challenge_id)
  transitionTrigger.value = true
})
</script>
