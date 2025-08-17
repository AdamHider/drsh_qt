<template>
  <div class="fixed-full">
    <AppBackground/>
  </div>
  <q-layout view="lHh LpR lFf" class="app-layout">
      <router-view v-slot="{ Component }">
        <keep-alive :exclude="['LessonItem', 'LessonFinish']">
            <component :is="Component"/>
        </keep-alive>
      </router-view>
      <AppNotifications/>
      <UserNewLevelDialog/>
      <q-drawer
        side="left"
        show-if-above
        v-model="drawer"
        bordered
      >
        <q-bottom-bar-desktop/>
      </q-drawer>
  </q-layout>
  <AppLoader/>
</template>

<script setup>
import AppBackground from 'components/AppBackground.vue'
import AppLoader from 'components/AppLoader.vue'
import AppNotifications from 'components/AppNotifications.vue'
import UserNewLevelDialog from 'components/UserNewLevelDialog.vue'
import { ref } from 'vue'

const drawer = ref(1)

</script>
<style scoped>
  .q-drawer-container aside{
    width: 25%;
  }
</style>
