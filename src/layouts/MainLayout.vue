<template>
  <q-layout :view="(Platform.is.mobile) ? 'hHh LpR fFf' : 'lHh LpR fFf'" class="app-layout bg-app-background-gradient-primary">
      <router-view v-slot="{ Component }">
        <keep-alive :exclude="['LessonItem', 'LessonFinish']">
            <component :is="Component"/>
        </keep-alive>
      </router-view>

      <q-bottom-bar v-if="Platform.is.mobile" @onTabSelected="selectTab"/>
      <q-bottom-bar-desktop v-else/>
      <AppNotifications/>
      <UserNewLevelDialog/>
      <PWAInstallDialog/>
      <PWASWDialog/>
      <NetworkTest/>

      <q-drawer
        v-model="skillsDialog"
        no-swipe-close
        no-swipe-open
        overlay
        elevated
      >
        <SkillsPageWidget/>
      </q-drawer>
  </q-layout>
  <AppLoader/>



</template>

<script setup>
import { onMounted, ref} from 'vue';
import AppLoader from 'components/AppLoader.vue'
import AppNotifications from 'components/AppNotifications.vue'
import UserNewLevelDialog from 'components/UserNewLevelDialog.vue'
import PWAInstallDialog from 'components/PWAInstallDialog.vue'
import PWASWDialog from 'components/PWASWDialog.vue'
import PushSubscribeDialog from 'components/PushSubscribeDialog.vue'
import NetworkTest from 'components/NetworkTest.vue'
import { loadAudio } from 'src/services/audioService';
import { Platform } from 'quasar'
import SkillsPageWidget from '../components/SkillsPageWidget.vue'

const skillsDialog = ref(false)

const selectTab = (tab) => {
  if(tab == 'skills'){
    skillsDialog.value = true
  }
}

onMounted(async () => {
  // Загружаем все необходимые звуки заранее
  await loadAudio('/audio/click.mp3', 'click');
  await loadAudio('/audio/swoosh.mp3', 'swoosh');
  await loadAudio('/audio/gain.mp3', 'gain');
  await loadAudio('/audio/page_success.mp3', 'page_success');
  await loadAudio('/audio/page_fail.mp3', 'page_fail');
  await loadAudio('/audio/lesson_success.mp3', 'lesson_success');
  await loadAudio('/audio/lesson_fail.mp3', 'lesson_fail');
});
</script>
