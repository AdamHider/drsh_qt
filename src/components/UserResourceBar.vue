<template>
    <q-chip class="q-ma-none q-pa-none text-white bg-transparent">
        <q-icon :name="props.icon" size="35px" :color="props.iconColor" style="margin-right: -20px; z-index: 100;"></q-icon>
        <div class="relative-position full-width q-px-sm text-center"
          style="min-width: 70px; border: 2px solid transparent; border-radius: 100px; box-shadow: 0 0 0 2px var(--q-primary); filter: drop-shadow(1px 1px 1px #00000059);">
          <label class="relative-position" style="z-index: 100; text-shadow: 1px 1px 2px #154aac;">
            <b>{{ resource.quantity }}<span style="font-size: 11px;">{{ (resource.total) ? '/'+resource.total : '' }}</span></b>
          </label>
          <q-linear-progress rounded size="24px" :value="percentageCount/100" color="primary" class="absolute-top full-width full-height" />
          <div v-if="resource.is_restorable && resource.next_restoration > 0" class="absolute q-ma-none full-width" style="left: 0; bottom: -18px;">
            <q-chip
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
import { ref, watch, toRefs, onActivated, onDeactivated } from 'vue'
import { useUserStore } from '../stores/user'

const { getItem } = useUserStore()

const props = defineProps({
  resource: Object,
  icon: String,
  iconColor: String
})
const resource = toRefs(props).resource

const cancelCountdown = ref(false)
const timerCount = ref('0:00')
const percentageCount = ref(resource.value.percentage)

const countdown = () => {
  if (cancelCountdown.value) return
  if (resource.value.next_restoration >= 0) {
    setTimeout(async () => {
      resource.value.next_restoration -= 1
      timerCount.value = secondsFormat(resource.value.next_restoration)
      if (resource.value.next_restoration == 0) getItem()
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
  timerCount.value = secondsFormat(resource.value.next_restoration)
  cancelCountdown.value = false
  countdown()
})
onDeactivated(() => {
  cancelCountdown.value = true
  countdown()
})

watch(() => resource.value.next_restoration, () => {
  const data = resource.value
  percentageCount.value = (data.total_time_cost - data.next_restoration) * 100 / data.total_time_cost
})
</script>
