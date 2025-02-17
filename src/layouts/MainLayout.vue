<template>
  <AppBackground/>
    <q-layout view="hHh LpR fFf">
        <router-view v-slot="{ Component }">
          <keep-alive :exclude="['LessonItem', 'LessonFinish']">
              <component :is="Component"/>
          </keep-alive>
        </router-view>
          <q-bottom-bar/>
    </q-layout>
</template>

<script setup>
import AppBackground from 'components/AppBackground.vue'
</script>
