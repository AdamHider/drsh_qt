<template>
  <q-page-wrapper>
  <q-app-header class=" rounded-b-md" reveal>
      <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
    <q-toolbar-title>Quest</q-toolbar-title>
  </q-app-header>
  <q-page class="text-center bg-white full-width" style="padding-top: 50px" >
    <transition
            appear
            enter-active-class="animated zoomIn animation-slow"
            leave-active-class="animated rubberBand  animation-delay-1" >
      <q-card v-if="transitionTrigger"
          class="transparent no-shadow full-width q-pa-md"
          style="position: relative; z-index: 1;"
        >
            <q-img
                :src="quest?.image"
                no-spinner
            />
      </q-card>
    </transition>
    <transition
      appear
      enter-active-class="animated zoomIn animation-delay-1"
      leave-active-class="animated zoomOut">
    <q-card flat class="relative text-left transparent full-width " style="z-index: 1;"
      v-if="transitionTrigger">
        <q-card-section>
            <div class="text-h5"><b>{{quest?.title}}</b></div>
            <div class="text-caption">{{quest?.description}}</div>
        </q-card-section>

    </q-card>
    </transition>
      <q-card flat class="relative text-left transparent full-width " style="z-index: 1;"
        v-if="transitionTrigger">
        <q-card-section class="q-py-sm">
          <q-list separator>
            <q-item class="q-px-none items-center">
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="ads_click" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ quest?.goal.title }}</q-item-label>
                <q-item-label caption lines="2">{{ quest?.goal.description }}</q-item-label>
              </q-item-section>
              <q-item-section side class="text-dark" v-if="quest?.goal.value">
                <b style="font-size: 16px">{{ quest?.goal.value }}</b>
              </q-item-section>
              <q-item-section v-if="quest?.lesson_id && !quest.is_completed && !quest.is_outdated" class="text-left">
                <q-btn class="full-width" label="Start" color="primary" icon="rocket" @click="router.push(`lesson-startup-${quest?.lesson_id}`)"></q-btn>
              </q-item-section>
            </q-item>

            <q-item class="q-px-none items-center">
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="timeline" />
              </q-item-section>
                <q-item-section >
                  <q-item-label>Reward</q-item-label>
                <q-item-label caption lines="2">What you will get.</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div>
                  <q-chip  v-if="quest?.reward.gems"  color="transparent" class="q-mt-none" text-color="purple" icon="diamond"><b>{{ quest?.reward.gems }}</b></q-chip>
                  <q-chip  v-if="quest?.reward.credits" color="transparent" text-color="positive" icon="payment"><b>{{ quest?.reward.credits }}</b></q-chip>
                  <q-chip  v-if="quest?.reward.experience" color="transparent" text-color="blue" icon="expand_less"><b>{{ quest?.reward.experience }}</b></q-chip>
                </div>
                <q-btn push color="primary" v-if="quest?.is_completed && !quest?.is_rewarded">Claim</q-btn>
              </q-item-section>
            </q-item>
            <q-item class="q-px-none items-center">
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="timeline" />
              </q-item-section>
                <q-item-section >
                  <q-item-label>Current progress</q-item-label>
                <q-item-label caption lines="2">How close to the edge you are.</q-item-label>
              </q-item-section>
              <q-item-section side class="text-dark">
                <b v-if="quest?.progress.percentage < 100" style="font-size: 16px">{{quest?.progress.percentage_text}}</b>
                <q-icon v-else name="task_alt" color="positive"></q-icon>
              </q-item-section>
            </q-item>
            <q-item class="q-px-none items-center" v-if="quest?.winner_left > 0">
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="people" />
              </q-item-section>
                <q-item-section >
                  <q-item-label>Winners left</q-item-label>
                <q-item-label caption lines="2">How much winners are left.</q-item-label>
              </q-item-section>
              <q-item-section side class="text-dark">
                <b style="font-size: 16px">{{quest?.winner_left }}</b>
              </q-item-section>
            </q-item>
            <q-item  v-if="quest?.date_start_humanized"  class="q-px-none items-center">
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="outlined_flag" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Start date</q-item-label>
                <q-item-label caption lines="2">The date quest starts.</q-item-label>
              </q-item-section>
              <q-item-section side class="text-dark">
                <b style="font-size: 16px">{{quest?.date_start_humanized}}</b>
              </q-item-section>
            </q-item>
            <q-item  v-if="quest?.date_end_humanized && !quest?.is_completed"  class="q-px-none items-center">
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="flag" />
              </q-item-section>
              <q-item-section>
                <q-item-label>End date</q-item-label>
                <q-item-label caption lines="2">The date quest finishes.</q-item-label>
              </q-item-section>
              <q-item-section side class="text-dark">
                <b style="font-size: 16px">{{quest?.date_end_humanized}}</b>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section class="q-py-sm text-left"  v-if="!quest?.is_blocked" >
        </q-card-section>
      </q-card>
    <q-card flat>
      <q-card-section  class="q-pa-none ">
        <LeaderboardTable
          :quest-id="route.params.quest_id"
        />
      </q-card-section>
    </q-card>
  </q-page>
  </q-page-wrapper>
</template>

<script setup>
import { api } from '../services/index'
import LeaderboardTable from '../components/LeaderboardTable.vue'
import { useRoute } from 'vue-router'
import { ref, onActivated, onMounted } from 'vue'

const route = useRoute()
const quest = ref({})
const transitionTrigger = ref(false)

const load = async function () {
  const questResponse = await api.quest.getItem({ quest_id: route.params.quest_id })
  if (questResponse.error) {
    quest.value = {}
    return
  }
  quest.value = questResponse
}
onMounted(async () => {
  await load()
  transitionTrigger.value = true
})
onActivated(async () => {
  await load()
  transitionTrigger.value = true
})
</script>
