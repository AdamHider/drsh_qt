<template>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title>Achievements</q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
        <AchievementList/>
    </q-page>
</template>

<script setup >
import AchievementList from '../components/AchievementList.vue'
</script>
<style>
.scale-slide-enter-active,
.scale-slide-leave-active {
  transition: 0.1s ;
  background-color: white;
}
.scale-slide-enter-from {
  opacity: 0;
}
.scale-slide-enter-to {
  opacity: 1;
}
.scale-slide-leave-from {
  opacity: 1;
}
.scale-slide-leave-to {
  opacity: 0;
}
</style>
