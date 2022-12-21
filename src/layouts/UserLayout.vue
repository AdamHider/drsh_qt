<template>
  <AppBackground/>
  <q-layout view="hHh LpR fFf">
    <q-header reveal class="transparent text-white rounded-b-md"  ref="header">
      <q-toolbar >
        <UserToggle/>
        <q-toolbar-title></q-toolbar-title>
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
  <q-scroll-observer @scroll="onScroll" />
</template>

<script setup>
import AppBackground from 'components/AppBackground.vue'
import BottomBar from 'components/BottomBar.vue'
import { useRoute } from 'vue-router'
import UserToggle from '../components/UserToggle.vue'
import { ref } from 'vue'

const header = ref(null)

const route = useRoute()
if (route.meta.noBottomBar) {}

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
