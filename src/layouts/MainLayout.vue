<template>
  <div class="fixed-full">
    <AppBackground/>
  </div>
  <q-layout view="hHh LpR fFf">
      <router-view v-slot="{ Component }">
        <keep-alive :exclude="['LessonItem', 'LessonFinish']">
            <component :is="Component"/>
        </keep-alive>
      </router-view>
      <q-bottom-bar/>
      <AppNotifications/>
      <UserNewLevelDialog/>
  </q-layout>
  <AppLoader/>
</template>

<script setup>
import AppBackground from 'components/AppBackground.vue'
import AppLoader from 'components/AppLoader.vue'
import AppNotifications from 'components/AppNotifications.vue'
import UserNewLevelDialog from 'components/UserNewLevelDialog.vue'



</script>
