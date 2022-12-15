<template>
  <AppBackground/>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-white text-black shadow-2">
        <q-toolbar>
            <q-btn flat icon="arrow_back" class="q-mr-sm" v-on:click="$router.go(-1);"/>
            <q-toolbar-title>Achievements</q-toolbar-title>
        </q-toolbar>
    </q-header>
    <q-footer bordered class="bg-white text-primary ">
      <BottomBar/>
    </q-footer>
    <q-page-container >
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container >
  </q-layout>
</template>

<script setup>
import AppBackground from 'components/AppBackground.vue'
import BottomBar from 'components/BottomBar.vue'

</script>
