<template>
  <AppBackground/>
    <q-layout view="hHh LpR fFf">
      <router-view v-slot="{ Component, route }">
        <transition :name="`page-${route.meta.transition}`">
            <keep-alive :exclude="['LessonStartup', 'LessonItem', 'HomeworkPage', 'ChallengePage', 'ClassroomEdit', 'HomeworkEdit', 'ChallengeEdit']">
                <component :is="Component"/>
            </keep-alive>
        </transition>
      </router-view>
      <q-footer v-if="bottomBarEnabled" bordered class="bg-white text-primary ">
        <AppBottomBar/>
      </q-footer>
    </q-layout>
</template>

<script setup>
import { ref, provide, watch } from 'vue'
import AppBackground from 'components/AppBackground.vue'
import AppBottomBar from 'components/AppBottomBar.vue'

import { useRoute } from 'vue-router'
const route = useRoute()
const isRootPage = ref(false)
const bottomBarEnabled = ref(false)

provide('redirectedFrom', route.redirectedFrom)
isRootPage.value = (route.fullPath.split('/').length === 2)
bottomBarEnabled.value = route.meta.bottomBarEnabled === true

watch(route, (currentValue, oldValue) => {
  isRootPage.value = (currentValue.fullPath.split('/').length === 2)
  bottomBarEnabled.value = route.meta.bottomBarEnabled === true
})
</script>
