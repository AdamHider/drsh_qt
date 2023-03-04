<template  withBackground="true">
  <div class="flex col justify-end">
    <q-chip class="no-shadow text-right bg-green-8 border-lg border-green-5" outline color="white" >
      <q-circular-progress
          show-value
          class="q-mr-sm"
          size="32px"
          :thickness="0.20"
          track-color="green-5"
          style="margin-left: -0.5em"
        >
          <q-avatar size="26px" style="margin: 0" color="green-8">
            <q-icon name="payments" size="18px" color="white"></q-icon>
          </q-avatar>
      </q-circular-progress>
      <b>{{ user.active?.data.consumables.credits.quantity }}</b>
    </q-chip>
    <q-chip class="no-shadow text-right bg-blue-9 border-lg border-blue-7" outline color="white" style="min-width: 65px">
        <q-circular-progress
          show-value
          class="q-mr-sm"
          :value="percentageCount"
          size="32px"
          :thickness="0.20"
          color="yellow"
          track-color="blue-7"
          style="margin-left: -0.5em"
        >
          <q-avatar size="26px" style="margin: 0" color="blue-9">
            <q-icon name="bolt" size="22px" ></q-icon>
          </q-avatar>
          <q-chip
            v-if="timerCount !== '0:00'"
            dense
            size="10px"
            text-color="white"
            class="absolute q-ma-none"
            style="bottom: -8px; max-width: none; background-color: #00000082"
          >
            <b>{{ timerCount }}</b>
          </q-chip>
        </q-circular-progress>
        <b>{{ user.active?.data.consumables.energy.quantity }}<span style="font-size: 11px;">/{{ user.active?.data.consumables.energy.total }}</span></b>
    </q-chip>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onActivated, onDeactivated } from 'vue'
import { useUserStore } from '../stores/user'

const { user, getItem } = useUserStore()

const cancelCountdown = ref(false)
const timerCount = ref('0:00')
const percentageCount = ref(user.active?.data.consumables.energy.percentage)

const countdown = () => {
  if (cancelCountdown.value) return
  if (user.active.data.consumables.energy.next_restoration >= 0) {
    setTimeout(async () => {
      user.active.data.consumables.energy.next_restoration -= 1
      timerCount.value = secondsFormat(user.active.data.consumables.energy.next_restoration)
      if (user.active.data.consumables.energy.next_restoration == 0) getItem()
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

onActivated(() => {
  timerCount.value = secondsFormat(user.active.data.consumables.energy.next_restoration)
  cancelCountdown.value = false
  countdown()
})
onDeactivated(() => {
  cancelCountdown.value = true
  countdown()
})

watch(() => user.active?.data.consumables.energy.next_restoration, () => {
  const data = user.active?.data.consumables.energy
  percentageCount.value = (data.total_time_cost - data.next_restoration) * 100 / data.total_time_cost
})
</script>
