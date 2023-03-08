<template  withBackground="true">
    <q-chip class="q-ma-none q-pa-none text-white bg-transparent">
        <q-icon name="bolt" size="35px" color="yellow" style="margin-right: -20px; z-index: 100;"></q-icon>
        <div class="relative-position full-width q-px-sm text-center bg-blue-10" style="min-width: 70px; border: 2px solid #1976d2; border-radius: 100px;">
          <label class="relative-position" style="z-index: 100; text-shadow: 1px 1px 2px #154aac;">
            <b>{{ user.active?.data.resources.energy.quantity }}<span style="font-size: 11px;">/{{ user.active?.data.resources.energy.total }}</span></b>
          </label>
          <q-linear-progress rounded size="26px" :value="percentageCount/100" color="primary" class="absolute-top full-width full-height border-md border-blue-10" />
          <div class="absolute q-ma-none full-width" style="left: 0; bottom: -18px;">
            <q-chip
              v-if="timerCount !== '0:00'"
              dense
              size="10px"
              text-color="white"
              class="q-ma-none"
              style="max-width: none; background-color: #00000082"
            >
              <b>{{ timerCount }}</b>
            </q-chip>
          </div>
        </div>
    </q-chip>
</template>

<script setup>
import { ref, watch, onMounted, onActivated, onDeactivated } from 'vue'
import { useUserStore } from '../stores/user'

const { user, getItem } = useUserStore()

const cancelCountdown = ref(false)
const timerCount = ref('0:00')
const percentageCount = ref(user.active?.data.resources.energy.percentage)

const countdown = () => {
  if (cancelCountdown.value) return
  if (user.active.data.resources.energy.next_restoration >= 0) {
    setTimeout(async () => {
      user.active.data.resources.energy.next_restoration -= 1
      timerCount.value = secondsFormat(user.active.data.resources.energy.next_restoration)
      if (user.active.data.resources.energy.next_restoration == 0) getItem()
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
  timerCount.value = secondsFormat(user.active.data.resources.energy.next_restoration)
  cancelCountdown.value = false
  countdown()
})
onDeactivated(() => {
  cancelCountdown.value = true
  countdown()
})

watch(() => user.active?.data.resources.energy.next_restoration, () => {
  const data = user.active?.data.resources.energy
  percentageCount.value = (data.total_time_cost - data.next_restoration) * 100 / data.total_time_cost
})
</script>
