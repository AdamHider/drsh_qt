<template>
      <q-item :dense="props.dense" :class="`relative bg-light-gradient-${resource?.color} text-white rounded-borders ${(props.dense) ? 'q-py-xs q-pl-sm': ''}`" >
          <q-item-section avatar  style="z-index: 1">
              <q-img :width="props.size" :src="resource?.image" style="filter: hue-rotate(0deg) drop-shadow(1px 3px 3px #00000075 );;"/>
          </q-item-section>
          <q-item-section style="z-index: 1">
              <q-item-label :class="`${(props.dense) ? '' : 'text-h7'}`">
                <b>
                  {{resource?.quantity}}
                  <span  v-if="resource.is_restorable">{{ (resource.restoration?.maxValue) ? '/' + resource.restoration?.maxValue : '' }}</span>
                </b>
              </q-item-label>
              <q-item-label v-if="!props.noCaption" caption lines="1" class="text-white text-sm"><b>{{resource?.title}}</b></q-item-label>
          </q-item-section>
          <q-linear-progress v-if="resource.is_restorable"
            track-color="grey-8"
            size="24px"
            :color="resource?.color"
            :value="percentageCount/100"
            class="rounded-borders absolute-top full-width full-height" />
          <div v-if="resource.is_restorable && resource.restoration?.nextRestoration > 0" class="absolute text-center q-ma-none full-width" style="left: 0; bottom: -18px;">
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
      </q-item>
</template>

<script setup>
import { ref, watch, toRefs, onActivated, onDeactivated } from 'vue'
import { useUserStore } from '../stores/user'

const { getItem } = useUserStore()

const props = defineProps({
  resource: Object,
  size: String,
  noCaption: Boolean,
  dense: Boolean
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

watch(() => resource.value?.restoration, () => {
  if(!resource.value.restoration) return
  percentageCount.value = (resource.value.restoration.restorationTime - resource.value.restoration.nextRestoration) * 100 / resource.value.restoration.restorationTime
})
</script>
<style lang="scss" scoped>
.q-avatar {
  box-shadow: 0px 0px 0px 3px $grey-3;
}
</style>

