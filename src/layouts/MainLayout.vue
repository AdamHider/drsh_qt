<template>
  <q-layout :view="(Platform.is.mobile) ? 'hHh LpR fFf' : 'lHh LpR lFf'" class="app-layout bg-app-background-gradient-primary">
      <router-view v-slot="{ Component }">
        <keep-alive :exclude="['LessonItem', 'LessonFinish']">
            <component :is="Component"/>
        </keep-alive>
      </router-view>

      <q-bottom-bar v-if="Platform.is.mobile"/>
      <q-bottom-bar-desktop v-else/>
      <AppNotifications/>
      <UserNewLevelDialog/>
      <PWAInstallDialog/>
  </q-layout>
  <AppLoader/>
  <audio id="audio_click_short" src="/audio/click_short.mp3" preload="auto"></audio>
  <audio id="audio_click_tiny" src="/audio/click_tiny.mp3" preload="auto"></audio>
  <audio id="audio_click_tiny_positive" src="/audio/click_tiny_positive.mp3" preload="auto"></audio>
  <audio id="audio_swing_long" src="/audio/swing_long.mp3" preload="auto"></audio>
  <audio id="audio_swing_short" src="/audio/swing_short.mp3" preload="auto"></audio>
  <audio id="audio_click_planet" src="/audio/click_planet.mp3" preload="auto"></audio>
  <audio id="audio_page_success" src="/audio/page_success.mp3" preload="auto"></audio>
  <audio id="audio_page_fail" src="/audio/page_fail.mp3" preload="auto"></audio>
  <audio id="audio_lesson_success" src="/audio/lesson_success.mp3" preload="auto"></audio>
  <audio id="audio_lesson_fail" src="/audio/lesson_fail.mp3" preload="auto"></audio>
  <audio id="audio_dialog_show" src="/audio/dialog_show.mp3" preload="auto"></audio>
  <audio id="audio_dialog_hide" src="/audio/dialog_hide.mp3" preload="auto"></audio>


</template>

<script setup>
import AppLoader from 'components/AppLoader.vue'
import AppNotifications from 'components/AppNotifications.vue'
import UserNewLevelDialog from 'components/UserNewLevelDialog.vue'
import PWAInstallDialog from 'components/PWAInstallDialog.vue'

import { Platform } from 'quasar'


</script>
