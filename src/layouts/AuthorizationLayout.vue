<template>
  <AppBackground/>
  <q-layout view="hHh LpR fFf">
    <q-header class="transparent text-white">
        <q-toolbar >
        <q-btn v-if="!isRootPage" flat round dense icon="arrow_back" v-on:click="$router.go(-1);"></q-btn>
        <q-toolbar-title></q-toolbar-title>
        </q-toolbar>
    </q-header>
    <q-page-container >
      <router-view v-slot="{ Component }" >
          <component :is="Component" ref="page"/>
      </router-view>
    </q-page-container >
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppBackground from 'components/AppBackground.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isRootPage = ref(true)

watch(route, (currentValue, oldValue) => {
  isRootPage.value = (currentValue.fullPath.split('/').length === 2)
})
</script>
