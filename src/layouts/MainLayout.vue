<template>
  <AppBackground/>
    <q-layout view="hHh LpR fFf">
      <q-page-container>
          <router-view v-slot="{ Component, route }">
                <transition name="slide-in">
                  <div :key="route.path">
                    <keep-alive :exclude="['LessonStartup', 'LessonItem', 'HomeworkPage', 'ChallengePage', 'ClassroomEdit', 'HomeworkEdit', 'ChallengeEdit']">
                        <component :is="Component"/>
                    </keep-alive>
                  </div>
                </transition>
          </router-view>
      </q-page-container>
      <q-footer v-if="bottomBarEnabled" bordered class="bg-white text-primary ">
        <AppBottomBar/>
      </q-footer>
    </q-layout>
</template>

<script setup>
import { ref, provide, watch, onActivated } from 'vue'
import AppBackground from 'components/AppBackground.vue'
import AppBottomBar from 'components/AppBottomBar.vue'

import { useRoute } from 'vue-router'
const route = useRoute()
const isRootPage = ref(false)
const transitionTrigger = ref(false)
const bottomBarEnabled = ref(false)

provide('redirectedFrom', route.redirectedFrom)
isRootPage.value = (route.fullPath.split('/').length === 2)
bottomBarEnabled.value = route.meta.bottomBarEnabled === true

watch(route, (currentValue, oldValue) => {
  isRootPage.value = (currentValue.fullPath.split('/').length === 2)
  bottomBarEnabled.value = route.meta.bottomBarEnabled === true
})
</script>
<style>
.slide-in-enter-active,
.slide-in-leave-active {
  transition: 0.3s ;
  position: absolute;
  width: 100%;
  z-index: 10000
}
.slide-in-enter-from {
  transform: translateX(100%);
}
.slide-in-enter-to {
  transform: translateX(0%);
}
.slide-in-leave-from {
  transform: scale(1);
}
.slide-in-leave-to {
  transform: scale(1);
}
</style>
