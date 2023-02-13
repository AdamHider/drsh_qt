<template>
  <AppBackground/>
    <q-layout view="hHh LpR fFf">
      <q-page-container>
          <router-view v-slot="{ Component }">
            <keep-alive :exclude="['LessonStartup', 'LessonItem', 'HomeworkPage', 'ChallengePage']">
              <component :is="Component"/>
            </keep-alive>
          </router-view>
      </q-page-container>
      <q-footer v-if="bottomBar" bordered class="bg-white text-primary ">
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
const bottomBar = ref(false)
provide('redirectedFrom', route.redirectedFrom)
isRootPage.value = (route.fullPath.split('/').length === 2)
bottomBar.value = route.meta.noBottomBar !== true

watch(route, (currentValue, oldValue) => {
  isRootPage.value = (currentValue.fullPath.split('/').length === 2)
  bottomBar.value = route.meta.noBottomBar !== true
})
</script>
