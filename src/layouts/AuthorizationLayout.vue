<template>
  <AppBackground/>
  <q-layout view="hHh LpR fFf">
    <q-header class="transparent text-white">
        <q-toolbar >
        <q-btn flat round dense icon="arrow_back" v-on:click="$router.go(-1);"></q-btn>
        <q-toolbar-title></q-toolbar-title>
        </q-toolbar>
    </q-header>
    <q-footer bordered class="bg-white text-primary ">
      <BottomBar v-if="bottomBar"/>
    </q-footer>
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
import BottomBar from 'components/BottomBar.vue'
import { useRoute } from "vue-router";

const route = useRoute();
console.log(route);
const bottomBar = ref(true);
if(route.meta.noBottomBar){
  bottomBar.value = false;
}
//const isRootPage = 

watch(route, (currentValue, oldValue) => {
  console.log(currentValue.meta);
  if(currentValue.meta.noBottomBar){
    bottomBar.value = false;
  } else {
    bottomBar.value = true;
  }
});
</script>
