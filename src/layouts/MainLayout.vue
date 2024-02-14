<template>
  <AppBackground/>
    <q-layout view="hHh LpR fFf">
      <router-view v-slot="{ Component, route }">
        <transition :name="`page-${route.meta.transition}`">
            <keep-alive :exclude="['LessonStartup', 'LessonItem', 'HomeworkPage', 'ChallengePage', 'ClassroomEdit', 'HomeworkEdit', 'ChallengeEdit']">
                <component :is="Component"/>
            </keep-alive>
        </transition>
      <transition :name="`page-${route.meta.transition}-bottombar`">
          <q-bottom-bar/>
      </transition>
      </router-view>
    </q-layout>
</template>

<script setup>
import AppBackground from 'components/AppBackground.vue'
</script>
