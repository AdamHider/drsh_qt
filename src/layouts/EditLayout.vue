<template>
  <AppBackground/>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-white text-black shadow-2" height-hint="60">
        <q-toolbar>
            <q-btn flat icon="arrow_back"  @click="$router.go(-1);"/>
            <q-toolbar-title>User Edit</q-toolbar-title>
            <q-btn flat icon="check" @click="onSave()"/>
        </q-toolbar>
    </q-header>
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
import { ref } from 'vue'
import AppBackground from 'components/AppBackground.vue'

const page = ref(null)
const onSave = () => {
  page.value.saveChanges()
}
</script>
