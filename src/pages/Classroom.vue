<template>
    <q-page class="bg-white" :style="`padding-top: ${backgroundImageHeight - 50 - 15}px`">
      <q-img 
        :src="`${CONFIG.API_HOST}${classroom.active?.fulltext_image}`" 
        :style="`max-height: ${backgroundImageHeight}px; position: fixed; top: 0;`"
      />
      <q-card flat class="my-card" style="margin-top: -15px;">
        <q-card-section>
          <q-avatar
            size="60px"
            class="absolute"
            style="top: 0; left: 10%; transform: translateY(-70%);">
            <img :src="`${CONFIG.API_HOST}${classroom.active?.introimage}`"/>
          </q-avatar>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ classroom.active?.title }}
            </div>
            <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
              <q-icon name="place" />
              250 ft
            </div>
          </div>

          <q-rating v-model="stars" :max="5" size="32px" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            $・Italian, Cafe
          </div>
          <div class="text-caption text-grey">
            Small plates, salads & sandwiches in an intimate setting.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat round icon="event" />
          <q-btn flat color="primary">
            Reserve
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useClassroom } from '../composables/useClassroom'
import { CONFIG } from '../config.js'

const backgroundImageHeight = 200;

const { classroom } = useClassroom()

</script>
