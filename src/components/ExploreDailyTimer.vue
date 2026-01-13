<template>
  <q-chip class="q-mx-none q-mb-none" color="gradient-secondary" text-color="white" size="11px" icon="timer">
    <b class="q-ml-xs">{{ timeLeft }}</b>
  </q-chip>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const timeLeft = ref('')

const updateGlobalTimer = () => {
  const now = new Date();
  const deadline = new Date();
  deadline.setHours(23, 0, 0, 0);
  if (now > deadline) deadline.setDate(deadline.getDate() + 1);

  const diff = deadline - now;
  const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
  const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
  const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');

  timeLeft.value = `${h}:${m}:${s}`;
};

let timerInterval;

onUnmounted(() => clearInterval(timerInterval));

onMounted(() => {
  updateGlobalTimer();
  timerInterval = setInterval(updateGlobalTimer, 1000);
})
</script>
