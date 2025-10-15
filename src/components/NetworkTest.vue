<template>
  <div class="speed-test-wrapper">
    <q-dialog v-model="slowNetworkDialog" position="bottom">
      <div class="full-width column">
        <div class="row">
          <div class="col-6">
            <transition
              appear
              enter-active-class="animated fadeInUp"
              leave-active-class="animated fadeOutDown">
              <img src="/images/characters/codex_full_loading.png" style="width: 130%; z-index: -1; margin-bottom: -20px; float: right;"/>
            </transition>
          </div>
        </div>
        <q-card class="bg-white rounded-b-0 full-width" style="overflow: visible;">
          <q-card-section>
              <div class="q-pb-md">
                <div class="text-subtitle1"><b>Внимание, низкая скорость!</b></div>
                <div class="text-caption">Кажется, твой космический корабль летит медленно! Всё дело в слабом соединеним с интернетом или активном VPN. <br>Это может вызвать зависания. Рекомендуем найти Wi-Fi для стабильной игры, а также выключить VPN.</div>
              </div>
          </q-card-section>
          <q-card-actions class="flex column">
            <q-btn push v-close-popup color="primary" class="full-width q-mb-sm" @click="finishTest()" @click.stop="playAudio('click')"><b>Окей</b></q-btn>
            <q-btn flat v-close-popup @click="runSpeedCheck" class="full-width" @click.stop="playAudio('click')"><b>Проверить ещё раз</b></q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { checkDownloadSpeed } from 'src/services/networkTest';
import { playAudio } from 'src/services/audioService';

const isSpeedTestComplete = ref(false);
const showLoading = ref(true);
const slowNetworkDialog = ref(false)
const speed = ref(0)

const runSpeedCheck = async () => {
  showLoading.value = true;
  isSpeedTestComplete.value = false;

  const { speedMbps, isSlow } = await checkDownloadSpeed();
  speed.value = speedMbps
  if (isSlow) {
    showLoading.value = false;
    slowNetworkDialog.value = true
  } else {
    isSpeedTestComplete.value = true;
    showLoading.value = false;
  }
};
const finishTest = () => {
  isSpeedTestComplete.value = true;
  showLoading.value = false;
  slowNetworkDialog.value = false
}
onMounted(() => {
  runSpeedCheck();
});
</script>
