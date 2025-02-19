<template>
  <q-page-container>
        <q-page class="flex justify-center content-end  text-center full-width" style="padding-top: 50px; padding-bottom: 35px;">
          <q-card class="text-center transparent no-shadow full-width" style="position: relative; z-index: 1;">
              <q-card-section class="q-pa-lg q-pb-xl text-white">
                <div class="text-h6"><b>Рейтинг лучших</b></div>
                <div class="text-caption">Только вверх, к звёздам!</div>
              </q-card-section>
          </q-card>
            <q-card flat class="relative text-left q-pt-md q-pb-md rounded-borders rounded-b-0 full-width">
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
