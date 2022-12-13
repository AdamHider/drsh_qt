<template>
    <q-header class="bg-white text-black shadow-2">
        <q-toolbar>
            <q-btn flat round dense icon="arrow_left" class="q-mr-sm" to="/user-achievements" v-on:click="$router.go(-1);"/>
            <q-toolbar-title>Achievements</q-toolbar-title>
        </q-toolbar>
    </q-header>
  <q-page class="bg-white q-pa-sm" >
      <AchievementList/>
  </q-page>
</template>

<script setup >
import AchievementList from '../components/AchievementList.vue'
console.log('opened');

</script>