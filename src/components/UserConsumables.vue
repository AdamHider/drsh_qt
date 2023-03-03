<template  withBackground="true">
    <q-chip class="no-shadow" color="primary" text-color="white"
        clickable
        @click="dialog = true"
    >

        <q-circular-progress
          show-value
          font-size="10px"
          class="q-mr-sm"
          :value="percentageCount"
          size="32px"
          :thickness="0.20"
          color="yellow"
          track-color="blue-6"
          style="margin-left: -0.45em"
        >
          <q-avatar size="26px" style="margin: 0">
            <q-icon name="bolt" size="20px" ></q-icon>
          </q-avatar>
          <q-chip dense size="11px" icon="schedule" color="grey-8" text-color="white" floating class="absolute q-ma-none" style="top: 100%; max-width: none;"><b>{{ timerCount }}</b></q-chip>
        </q-circular-progress>

        <b>{{ user.active?.data.consumables.energy.quantity }} / {{ user.active?.data.consumables.energy.total }}</b>
    </q-chip>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '../stores/user'

const { user } = useUserStore()

const timerCount = ref('')
const percentageCount = ref(0)

const countdown = () => {
  if (user.active.data.consumables.energy.next_restoration > 0) {
    setTimeout(() => {
      user.active.data.consumables.energy.next_restoration -= 1
      timerCount.value = secondsFormat(user.active.data.consumables.energy.next_restoration)
      countdown()
    }, 1000)
  }
}
const secondsFormat = (timeLeft) => {
  let seconds = ++timeLeft % 60
  if (seconds < 10) seconds = '0' + seconds
  const minutes = parseInt(timeLeft / 60, 10) % 60
  return `${minutes}:${seconds}`
}
const dialog = ref(false)

countdown()

watch(() => user.active?.data.consumables.energy.next_restoration, () => {
  const data = user.active?.data.consumables.energy
  percentageCount.value = (data.total_time_cost - data.next_restoration) * 100 / data.total_time_cost
  console.log(percentageCount.value)
})
</script>
