<template>
  <q-dialog v-model="showInstallDialog" v-if="canInstall && isInstallable" persistent>
    <q-card class="q-push">
      <q-card-section>
        <div class="text-h6">Хочешь установить Mektepium?</div>
        <div class="text-subtitle2">Это даст тебе мгновенный доступ к заданиям и прогрессу.</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat v-close-popup ><b>Нет, спасибо</b></q-btn>
        <q-btn flat @click="handleInstall" color="primary"><b>Да, установить</b></q-btn>
      </q-card-actions>
    </q-card>
      </q-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { canInstallPWA, deferredPrompt, isInstallable } from '../composables/PWAInstall.js';

const showInstallDialog = ref(false);

const canInstall = computed(() => canInstallPWA.value);

function handleInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('installed');
      } else {
        console.log('cancelled');
      }
      canInstallPWA.value = false;
      localStorage['PWAInstallerShown'] = true
    });
  }
}
onMounted(() => {
  if(!localStorage['PWAInstallerShown']){
    setTimeout(() => {
      showInstallDialog.value = true;
    }, 1000);
  }
})
</script>
