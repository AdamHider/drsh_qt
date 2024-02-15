<template>
  <AppBackground/>
    <q-layout view="hHh LpR fFf">
      <router-view v-slot="{ Component, route }">
            <keep-alive :exclude="['LessonStartup', 'LessonItem', 'HomeworkPage', 'ChallengePage', 'ClassroomEdit', 'HomeworkEdit', 'ChallengeEdit']">
                <component :is="Component"/>
            </keep-alive>
      </router-view>
          <q-bottom-bar/>
    </q-layout>
</template>

<script setup>
import AppBackground from 'components/AppBackground.vue'
</script>
