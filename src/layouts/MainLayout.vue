<template>
  <AppBackground/>
  <q-layout view="hHh LpR fFf">
    <q-header class="transparent text-white">
      <q-toolbar >
        <ClassroomToggle/>
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat round dense icon="emoji_events" class="q-mr-sm" to="/user/achievements"/>
        <q-btn flat round dense icon="settings" class="q-mr-sm"  to="/user/settings"/>
      </q-toolbar>
    </q-header>
    <q-footer bordered class="bg-white text-primary ">
      <BottomBar/>
    </q-footer>
    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppBackground from 'components/AppBackground.vue'
import BottomBar from 'components/BottomBar.vue'
import { useRoute } from 'vue-router'
import ClassroomToggle from '../components/ClassroomToggle.vue'

const route = useRoute()

const bottomBar = ref(true)
if (route.meta.noBottomBar) {
  bottomBar.value = false
}

watch(route, (currentValue, oldValue) => {
  if (currentValue.meta.noBottomBar) {
    bottomBar.value = false
  } else {
    bottomBar.value = true
  }
})
</script>
