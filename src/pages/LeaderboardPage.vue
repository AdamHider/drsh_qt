<template>
  <q-page-container>
        <q-app-header class="bg-white rounded-b-md ">
            <q-toolbar-title><b>Рейтинг</b></q-toolbar-title>
        </q-app-header>
        <q-page class="column justify-center content-start text-center full-width" style="padding-top: 50px; padding-bottom: 35px;">
          <div class="page-background fixed-top full-width"></div>
            <LeaderboardTable :allowed-filters="['resource']"/>
        </q-page>
  </q-page-container>
</template>

<script setup >
import LeaderboardTable from '../components/LeaderboardTable.vue'
</script>

<style scoped>
.q-main-card:before{
  content: "";
  position: absolute;
  z-index: 1;
  background: white;
  top: 100%;
  left: 0;
  width: 100%;
  height: 100px;
}
</style>
