<template>
      <q-item :dense="props.dense" clickable
        :class="`q-push relative text-white bg-light-gradient-${resource?.color} q-px-xs rounded-md`" style="padding-top: 6px;">
          <q-item-section avatar style="z-index: 3" class="absolute-left" :style="`min-width: ${props.size};`">
            <q-avatar :class="`bg-light-gradient-${resource?.color}`" size="42px" style="box-shadow: inset 0px 0px 0px 2px #ffffff2b;">
                <q-avatar class="allow-overflow" style="background: rgba(0, 0, 0, 0.31);" size="32px">
                  <q-img :width="props.size" :src="resource?.image" style="filter: drop-shadow(rgba(0, 0, 0, 0.44) 0px 2px 2px); scale: 1.2; min-height: 32px" no-spinner/>
                </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section style="z-index: 2; text-shadow: 0px 1px 2px #00000094;" class="q-pl-md">
            <div class="flex full-height q-mr-sm" :style="`gap: 4px; margin-left: ${props.size}`">
              <div v-for="(bar, barIndex) in bars" :key="`barIndex${barIndex}`" style="flex: 1" >
                <q-chip :class="`q-push bg-${(bar.isFilled) ? 'light-gradient-'+resource?.color : 'grey'} full-height full-width rounded-xs q-my-none  q-pa-none`" ></q-chip>
              </div>
            </div>
          </q-item-section>




          <q-item-section v-if="false"  style="z-index: 2; text-shadow: 0px 1px 2px #00000094;">
              <q-item-label :class="`${(props.dense) ? '' : 'text-h7'} `">
                  <span class=""><b>{{resource?.quantity}}</b></span>
                  <span v-if="resource.is_restorable"><b>{{ (resource.restoration?.maxValue) ? '/' + resource.restoration?.maxValue : '' }}</b></span>
                  <span v-if="resource.quantity_cost" class="text-caption"><b>/{{ resource.quantity_cost }}</b></span>
              </q-item-label>
              <q-item-label v-if="!props.noCaption" caption lines="1" class="text-white text-sm"><b>{{ resource?.title }}</b></q-item-label>
          </q-item-section>


          <div v-if="resource.is_restorable"
            size="24px" :class="`absolute-top ${(props.dense) ? 'rounded-sm': 'rounded-sl'} full-width full-height overflow-hidden q-pa-xs`">
            <div :class="`absolute-top full-width full-height bg-light-gradient-${resource?.color}`"></div>
            <div :class="`relative-position ${(props.dense) ? 'q-py-xs ': ''} full-height`" style="z-index: 1; background: rgba(0, 0, 0, 0.31); border-radius: 11px;"></div>
          </div>
          <transition appear
            enter-active-class="animated fadeInDown animation-delay-2"
            leave-active-class="animated fadeOutUp">
            <div v-if="resource.is_restorable && percentageCount < 100">
              <div  class="absolute text-center q-ma-none full-width" style="left: 0; bottom: -18px;">
                <q-chip  dense size="10px" text-color="white" color="dark" class="q-ma-none"
                  :style="`max-width: none; background-color: ${(transparent) ? '#0000006c' : ''}`">
                  <span v-if="showCountdown"><b>{{ timerCount }}</b></span>
                  <span v-else-if="percentageCount < 100"><q-spinner-dots color="white" size="2em" /></span>
                </q-chip>
              </div>
            </div>
          </transition>
      </q-item>
</template>

<script setup>
import { ref, watch, toRefs, computed, onActivated, onDeactivated, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { playAudio } from 'src/services/audioService';

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

const bars = computed(() => {
  const result = []
  const totalBars = props.resource.max_quantity ??  props.resource.quantity
  for(var i = 1; i <= totalBars; i++){
    result.push({
      index: i,
      isFilled: (i <= props.resource.quantity)
    })
  }
  return result
})


const resource = toRefs(props).resource

const showCountdown = ref(false)
const timerCount = ref('0:00')
const percentageCount = ref(100)
const activeCountdown = ref(false)

const calculateRestoration = () => {
  if(!resource.value.restoration) return
  percentageCount.value = (resource.value.restoration.restorationTime - resource.value.restoration.nextRestoration) * 100 / resource.value.restoration.restorationTime
  timerCount.value = secondsFormat(resource.value.restoration.nextRestoration)
}

const countdown = () => {
  if (resource.value.restoration?.nextRestoration >= 0) {
    setTimeout(async () => {
      if(!resource.value.restoration || !activeCountdown.value) return
      resource.value.restoration.nextRestoration -= 1
      calculateRestoration()
      if (resource.value.restoration.nextRestoration == 0) getItem()
      showCountdown.value = true
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

onActivated(async () => {
  showCountdown.value = false
  if (!resource.value.restoration) return
  await getItem()
  calculateRestoration()
  if(!activeCountdown.value) activeCountdown.value = true
  countdown()

})
onMounted(async () => {
  showCountdown.value = false
  if (!resource.value.restoration) return
  await getItem()
  calculateRestoration()
  if(!activeCountdown.value) activeCountdown.value = true

})
onDeactivated(() => {
  activeCountdown.value = false
  showCountdown.value = false
})

watch(() => resource.value?.restoration, () => {
  if(!resource.value.restoration) return
  percentageCount.value = (resource.value.restoration.restorationTime - resource.value.restoration.nextRestoration) * 100 / resource.value.restoration.restorationTime
})
</script>
<style lang="scss" scoped>

</style>

