<template>
  <AppBackground/>
  <q-layout view="hHh LpR fFf">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
    <q-footer bordered class="bg-white text-primary ">
      <AppBottomBar/>
    </q-footer>
  </q-layout>
</template>

<script setup>
import AppBackground from 'components/AppBackground.vue'
import AppBottomBar from 'components/AppBottomBar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
if (route.meta.noBottomBar) {}

</script>
