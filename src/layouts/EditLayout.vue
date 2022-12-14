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

const bottomBar = ref(true);
if(route.meta.noBottomBar){
  bottomBar.value = false;
}
const page = ref(null);
const onSave = () => {
  page.value.saveChanges();
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
