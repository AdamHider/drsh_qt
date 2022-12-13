<template>
  <AppBackground/>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
    <q-footer bordered class="bg-white text-primary ">
      <BottomBar v-if="bottomBar"/>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppBackground from 'components/AppBackground.vue'
import BottomBar from 'components/BottomBar.vue'
import { useRoute } from "vue-router";

const route = useRoute();

const bottomBar = ref(true);
  if(route.meta.noBottomBar){
    bottomBar.value = false;
  }

watch(route, (currentValue, oldValue) => {
  console.log(currentValue.meta);
  if(currentValue.meta.noBottomBar){
    bottomBar.value = false;
  } else {
    bottomBar.value = true;
  }
});
</script>
