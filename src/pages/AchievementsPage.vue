<template>
  <q-page-wrapper>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title>Achievements</q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white q-pa-sm"  style="padding-top: 50px; padding-bottom: 48px;">
        <AchievementList/>
    </q-page>
  </q-page-wrapper>
</template>

<script setup >
import AchievementList from '../components/AchievementList.vue'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, onBeforeMount, onActivated, ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()
const startTime = ref();
const endTime = ref();


onBeforeMount(async () => {
  startTime.value = new Date()
})

onMounted(async () => {
  endTime.value = new Date();
  var timeDiff = endTime.value - startTime.value; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  console.log("Achievements: " + timeDiff + " mseconds");
})

onActivated(async () => {
  endTime.value = new Date();
  var timeDiff = endTime.value - startTime.value; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  console.log("Achievements: " + timeDiff + " mseconds");
})

watch(route, (to) => {
  startTime.value = new Date()
})

</script>
