<template>
  <AppBackground/>
  <q-layout view="hhh LpR fFf">
    <q-footer bordered class="bg-white text-primary ">
      <BottomBar/>
    </q-footer>
    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" ref="page" />
        </keep-alive>
      </router-view>
    </q-page-container >
  </q-layout>
</template>

<script setup>
import AppBackground from 'components/AppBackground.vue'
import BottomBar from 'components/BottomBar.vue'

</script>
