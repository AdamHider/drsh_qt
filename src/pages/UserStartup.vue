<template>
    <q-page-container>
        <q-page :class="`flex justify-center items-end  full-width text-center ${(tapped) ? 'zoomed' : ''}`">
          <q-card flat class="bg-transparent text-white">
              <q-card-section v-if="user.active?.data.id" class="d-flex flex-no-wrap justify-space-between align-center">
                  <h4 class="text-h6">{{user.active?.data.name}}</h4>
                  <q-btn push  @click="signOut()" color="white" @click.stop="playAudio('click')">Выйти</q-btn>
              </q-card-section>
              <div v-if="!tapped">
                  <div class="tap-overlay" @click="tapped = true" @click.stop="playAudio('click')"></div>
                  <q-btn flat class="full-width q-ma-sm q-mb-xl animation-flash" @click="tapped = true" @click.stop="playAudio('click')"><b>Нажмите, чтобы продолжить</b></q-btn>
              </div>
              <div v-else>
                <transition
                  appear
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut" >
                  <q-card-section class="q-pb-xl">
                    <div style="max-width: 200px;">
                      <q-btn push color="primary" @click="signIn()" class="full-width q-my-sm" @click.stop="playAudio('click')">Продолжить</q-btn>
                      <q-btn push color="secondary" @click="signUp()"  class="full-width  q-my-sm" @click.stop="playAudio('click')">Новая игра</q-btn>
                      <q-btn push color="primary" @click="closeDialog = true;" class="q-my-sm" @click.stop="playAudio('click')">Выйти из игры</q-btn>
                    </div>
                  </q-card-section>
                </transition>
              </div>
          </q-card>
          <q-dialog v-model="closeDialog"  transition-show="scale" transition-hide="scale">
            <q-card class="bg-white" style="width: 300px">
              <q-card-section>
                <div class="text-h6"><b>Выйти из игры</b></div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                Вы уверены? Вы можете вернуться к планете в любое время.
              </q-card-section>
              <q-card-actions align="center" class="bg-white text-teal">
                <q-btn flat class="col" color="grey" v-close-popup @click.stop="playAudio('click')"><b>Отмена</b></q-btn>
                <q-btn push class="col" color="primary" label="Выйти" @click="closeApp" @click.stop="playAudio('click')"/>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-page>
    </q-page-container>
</template>

<script setup>
import { ref, watch, onActivated, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { playAudio } from 'src/services/audioService';

const router = useRouter()

const { user } = useUserStore()

const tapped = ref(false)
const closeDialog = ref(false)
const closeConfirmed = ref(false)


onActivated(() => {
  if (user.id) return router.push('/user')
})
onMounted(() => {
  if (user.id) return router.push('/user')
})
const closeApp = () => {
  closeConfirmed.value = true
  window.close();
}
const signIn = () => {
  closeConfirmed.value = true
  return router.push('/authorization/sign-in')
}
const signUp = () => {
  closeConfirmed.value = true
  return router.push('/authorization/sign-up')
}
watch(() => user.active.data.id, (newValue, oldValue) => {
  if (user.active.data.id) return router.push('/user')
})
onBeforeRouteLeave((to, from) => {
  if (!closeConfirmed.value && to.fullPath !== '/user') {
    closeDialog.value = true
    return false
  }
  closeDialog.value = false
  return true
})
</script>
<style scoped>
.q-page{
  background-image: url('/images/splash_mobile.jpg');
  background-size: auto 100%;
  background-position: center center;
  transition: 0.3s all ease;
}
.desktop .q-page{
  background-image: url('/images/splash_desktop.jpg');
  background-size: auto 100%;
}
.q-page.zoomed{
  background-size: auto 110%;
}
.tap-overlay{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.animation-flash{
  animation: flash 2s ease infinite alternate;
}
@keyframes shake {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
