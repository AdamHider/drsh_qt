<template>

  <q-chip class="rounded-sm" :color="`grey-3`" :text-color="`${(resource.is_restorable) ? 'white' : resource.color+'-9'}`" style="padding-right: 5px;">
    <q-avatar :color="`${resource.color}-9`" size="32px" class="relative-position rounded-md" :style="`z-index: 100; `">
      <q-icon :name="resource.icon" size="22px" color="white"></q-icon>
    </q-avatar>
    <div class="relative-position text-center" style="min-width: 50px; margin-left: -12px; ">
      <label class="relative-position " style="z-index: 100; ">
        <b>{{ resource.quantity }}<span style="font-size: 11px;">{{ (resource.restoration?.maxValue) ? '/' + resource.restoration?.maxValue : '' }}</span></b>
      </label>
      <q-linear-progress v-if="resource.is_restorable" track-color="grey-8"  size="24px" :value="percentageCount/100" :color="`${resource.color}`" class="rounded-xs absolute-top full-width full-height " />
      <div v-if="resource.is_restorable && resource.restoration?.nextRestoration > 0" class="absolute q-ma-none full-width" style="left: 0; bottom: -18px;">
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
    <q-tooltip>
      {{ resource.title }}
    </q-tooltip>
  </q-chip>
</template>

<script setup>
import { ref, watch, toRefs, onActivated, onDeactivated } from 'vue'
import { useUserStore } from '../stores/user'

const { getItem } = useUserStore()

const props = defineProps({
  resource: Object,
})
const resource = toRefs(props).resource

const cancelCountdown = ref(false)
const timerCount = ref('0:00')
const percentageCount = ref(100)

const countdown = () => {
  if (resource.value.restoration.nextRestoration >= 0) {
    setTimeout(async () => {
      if(!resource.value.restoration) return
      resource.value.restoration.nextRestoration -= 1
      timerCount.value = secondsFormat(resource.value.restoration.nextRestoration)
      if (resource.value.restoration.nextRestoration == 0) getItem()
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
  if (!resource.value.restoration) return
  if (cancelCountdown.value) return
  percentageCount.value = (resource.value.restoration.restorationTime - resource.value.restoration.nextRestoration) * 100 / resource.value.restoration.restorationTime
  timerCount.value = secondsFormat(resource.value.restoration.nextRestoration)
  cancelCountdown.value = false
  countdown()
})
onDeactivated(() => {
  cancelCountdown.value = true
  //countdown()
})

watch(() => resource.value.restoration, () => {
  if(!resource.value.restoration) return
  percentageCount.value = (resource.value.restoration.restorationTime - resource.value.restoration.nextRestoration) * 100 / resource.value.restoration.restorationTime
})
</script>
<style lang="scss" scoped>
.q-avatar {
  box-shadow: 0px 0px 0px 3px $grey-3;
}
</style>

