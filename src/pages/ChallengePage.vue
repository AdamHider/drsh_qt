<template>
  <q-app-header class="transparent text-white rounded-b-md" reveal>
      <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
    <q-toolbar-title></q-toolbar-title>
  </q-app-header>
  <q-page class="text-center full-width" style="padding-top: 50px" v-if="!challenge.active.is_blocked">
    <q-card class="transparent no-shadow full-width" style="position: relative; z-index: 1;">
        <q-card-section>
            <transition
                appear
                enter-active-class="animated zoomIn animation-slow"
                leave-active-class="animated rubberBand  animation-delay-1" >
              <q-img
                  v-if="transitionTrigger"
                  :src="challenge.active.image"
                  style="max-width: 250px; width: 230px;"
                  no-spinner
              />
            </transition>
        </q-card-section>
    </q-card>
    <transition
      appear
      enter-active-class="animated zoomIn animation-delay-1"
      leave-active-class="animated zoomOut">
    <q-card flat class="relative text-white text-left transparent full-width " style="z-index: 1;"
      v-if="transitionTrigger">
        <q-card-section>
            <div class="text-h5"><b>{{challenge.active.description?.title}}</b></div>
            <div class="text-caption">{{challenge.active.description?.description}}</div>
        </q-card-section>
        <q-card-section v-if="challenge.active.parent_id">
            <div class="text-caption">
              This challenge is sattelite of
              <router-link :to="`/challenge-startup-${challenge.active.parent_id}`">
                {{ challenge.active.master_challenge.title }}
              </router-link>
            </div>
        </q-card-section>
        <q-card-actions class="text-right">
          <q-btn class="full-width" label="Start" color="primary" icon="play_arrow" @click="start(challenge.active.id)"></q-btn>
        </q-card-actions>
    </q-card>
    </transition>
  </q-page>
</template>

<script setup>
import { useChallenge } from '../composables/useChallenge'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()
const { challenge, getItem } = useChallenge()
const transitionTrigger = ref(false)

onMounted(async () => {
  await getItem(route.params.challenge_id)
  transitionTrigger.value = true
  if (challenge.active.is_blocked) {
    router.go(-1)
  }
})
</script>
