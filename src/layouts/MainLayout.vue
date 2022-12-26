<template>
  <AppBackground/>
    <q-layout view="hHh LpR fFf">
      <q-page-container>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component"/>
            </keep-alive>
          </router-view>
      </q-page-container>
    </q-layout>
</template>

<script setup>
import AppBackground from 'components/AppBackground.vue'
import AppBottomBar from 'components/AppBottomBar.vue'

</script>
