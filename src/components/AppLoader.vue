<template>
    <q-dialog
      v-model="dialog"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-dark text-white text-center column justify-center">

        <q-card-section>
          <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="trailGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style="stop-color: #FFFFFF; stop-opacity:1" />
                <stop offset="100%" style="stop-color: #FFFFFF; stop-opacity:0" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="30" fill="#FFFFFF" />
            <g>
              <circle cx="100" cy="50" r="5" fill="#FFFFFF">
                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="50" r="3" fill="#FFFFFF">
                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="50" r="4" fill="#FFFFFF">
                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>

        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1"><b>Пожалуйста подождите...</b></div>
        </q-card-section>

      </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useLoader } from '../composables/useLoader'

const { loader } = useLoader()

const dialog = ref(false)

watch(() => loader.status, () => {
  dialog.value = loader.status
})
</script>
