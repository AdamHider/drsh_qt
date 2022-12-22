<template>
  <AppBackground/>
  <q-layout view="hhh LpR fFf">
    <q-header reveal class="transparent text-white rounded-b-md"  ref="header">
      <q-toolbar >
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat round dense class="q-mr-sm" icon="share"/>
        <q-btn flat round dense class="q-mr-sm"  icon="more_vert"/>
      </q-toolbar>
    </q-header>
    <q-footer bordered class="bg-white text-primary ">
      <AppBottomBar/>
    </q-footer>
    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" ref="page" />
        </keep-alive>
      </router-view>
    </q-page-container >
  </q-layout>
  <q-scroll-observer @scroll="onScroll" />
</template>

<script setup>
import AppBackground from 'components/AppBackground.vue'
import AppBottomBar from 'components/AppBottomBar.vue'
import { ref } from 'vue'
const header = ref(null)
const onScroll = (event) => {
  if (event.position.top > 0) {
    header.value.$el.classList.add('header-sticky')
  } else {
    header.value.$el.classList.remove('header-sticky')
  }
}
</script>
<style scoped>
.q-header{
  transition: 0.2s ease;
}
.q-header.header-sticky{
  background: #fff !important;
  color: var(--q-dark) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);

}
</style>
