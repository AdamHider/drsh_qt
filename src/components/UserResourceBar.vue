<template>
      <q-item :dense="props.dense"
        :class="`relative bg-light-gradient-${resource?.color} text-white ${(props.dense) ? 'q-py-xs q-pl-sm rounded-sl': 'rounded-md'} ${(transparent) ? 'bg-dark-transparent' : ''} ${(props.push) ? 'q-push': ''} ${props.class ?? ''}`" >
          <q-item-section avatar  style="z-index: 1"  :style="`min-width: ${props.size}`">
              <q-img :width="props.size" :src="resource?.image" style="filter: hue-rotate(0deg) drop-shadow(1px 3px 3px #00000075 )"/>
          </q-item-section>
          <q-item-section style="z-index: 1">
              <q-item-label :class="`${(props.dense) ? '' : 'text-h7'}`">
                  <span class=""><b>{{resource?.quantity}}</b></span>
                  <span v-if="resource.is_restorable"><b>{{ (resource.restoration?.maxValue) ? '/' + resource.restoration?.maxValue : '' }}</b></span>
              </q-item-label>
              <q-item-label v-if="!props.noCaption" caption lines="1" class="text-white text-sm"><b>{{resource?.title}}</b></q-item-label>
          </q-item-section>
          <q-linear-progress v-if="resource.is_restorable"
            size="24px"
            :color="resource?.color"
            :value="percentageCount/100"
            :class="`rounded-borders absolute-top rounded-sl full-width full-height`" style="background-color: rgba(0, 0, 0, 0.2)"/>
          <div v-if="resource.is_restorable && resource.restoration?.nextRestoration > 0" class="absolute text-center q-ma-none full-width" style="left: 0; bottom: -18px;">
            <q-chip
              dense
              size="10px"
              text-color="white"
              color="dark"
              class="q-ma-none"
              :style="`max-width: none; background-color: ${(transparent) ? '#0000006c' : ''}`"
            >
              <b>{{ timerCount }}</b>
            </q-chip>
          </div>
          <div v-if="props.withBadge">
            <div v-if="props.dense" class="absolute" style="right: -12px">
              <q-btn dense round push size="10px" icon="add" color="isonit" :to="props.badgeLink"/>
            </div>
            <div v-else class="absolute" style="top: -8px; right: -8px">
              <q-btn dense round push icon="add" color="isonit" :to="props.badgeLink"/>
            </div>
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
  push: Boolean,
  noCaption: Boolean,
  dense: Boolean,
  transparent: Boolean,
  withBadge: Boolean,
  badgeLink: String
})
const resource = toRefs(props).resource

const cancelCountdown = ref(false)
const timerCount = ref('0:00')
const percentageCount = ref(100)

const countdown = () => {
  if (resource.value.restoration.nextRestoration >= 0) {
    setTimeout(async () => {
      if(!resource.value.restoration) return
      if (cancelCountdown.value) return
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
  cancelCountdown.value = false
  if (!resource.value.restoration) return
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

