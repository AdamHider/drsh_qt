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
</template>

<script setup>
import AppLoader from 'components/AppLoader.vue'
import AppNotifications from 'components/AppNotifications.vue'
import UserNewLevelDialog from 'components/UserNewLevelDialog.vue'
import PWAInstallDialog from 'components/PWAInstallDialog.vue'

import { Platform } from 'quasar'


</script>
