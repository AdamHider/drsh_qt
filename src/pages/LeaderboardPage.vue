<template>
  <q-page-container>
        <q-page class="column justify-center content-start text-center full-width" style="padding-top: 50px; padding-bottom: 35px;">
          <div class="page-background fixed-top full-width"  style="height: 300px; background-image: url('/images/leaderboard/main_background.jpg'); background-size: cover;"></div>

            <q-card flat class=" relative text-left q-pt-md q-pb-md rounded-borders rounded-b-0 full-width" style="flex: 1;">
                <q-card-section class="q-pa-none">
                    <LeaderboardTable :allowed-filters="['time_period']"/>
                </q-card-section>
            </q-card>
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
