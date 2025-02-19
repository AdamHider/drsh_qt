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
          <q-spinner-orbit
            color="white"
            size="6em"
          />
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1"><b>Пожалуйста подождите...</b></div>
        </q-card-section>

      </q-card>
    </q-dialog>
</template>

<script setup>
import { onMounted, onBeforeMount, onActivated, ref, watch } from 'vue'

const dialog = ref(true)
</script>
