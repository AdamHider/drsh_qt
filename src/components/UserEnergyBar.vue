<template>
      <q-item :dense="props.dense" clickable
        :class="`q-push relative text-white bg-light-gradient-${energy?.color} q-px-xs rounded-md`" >
          <q-item-section avatar style="z-index: 3" class="absolute-left" :style="`min-width: ${props.size};`">
            <q-circular-progress
              rounded
              show-value
              :value="50"
              size="56px"
              :thickness="0.3"
              :color="energy?.color"
              track-color="grey-3"
            >
            <q-avatar  size="42px" style="background: #ad7014;">
              <q-img class="absolute-bottom" width="46px" src="/images/resources/energy1.png" style="filter: drop-shadow(rgba(0, 0, 0, 0.44) 0px 2px 2px); scale: 1.2; min-height: 32px; z-index: 2" no-spinner/>
            </q-avatar>
            </q-circular-progress>
          </q-item-section>
          <q-item-section style="z-index: 2; text-shadow: 0px 1px 2px #00000094;" class="q-pl-md">
            <div class="flex full-height q-mr-sm" :style="`gap: 4px; margin-left: ${props.size}`">
              <div v-for="(energyBar, energyBarIndex) in energyBars" :key="`barIndex${energyBarIndex}`" style="flex: 1" >
                <q-chip :class="`q-push bg-${(energyBar.isFilled) ? 'light-gradient-'+energy?.color : 'grey'} full-height full-width rounded-xs q-my-none  q-pa-none`" ></q-chip>
              </div>
            </div>
          </q-item-section>

          <div
            size="24px" :class="`absolute-top ${(props.dense) ? 'rounded-sm': 'rounded-sl'} full-width full-height overflow-hidden q-pa-xs`">
            <div :class="`absolute-top full-width full-height bg-light-gradient-${energy?.color}`"></div>
            <div :class="`relative-position ${(props.dense) ? 'q-py-xs ': ''} full-height`" style="z-index: 1; background: rgba(0, 0, 0, 0.31); border-radius: 11px;"></div>
          </div>
      </q-item>
</template>

<script setup>
import { ref, watch, toRefs, computed, onActivated, onDeactivated, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { playAudio } from 'src/services/audioService';

const { getItem } = useUserStore()

const props = defineProps({
  energy: Object,
  speed: Object,
  size: String,
  push: Boolean,
  noCaption: Boolean,
  dense: Boolean,
  transparent: Boolean,
  withBadge: Boolean,
  badgeLink: String
})

const energyBars = computed(() => {
  const result = []
  const totalBars = props.energy.max_quantity ??  props.energy.quantity
  for(var i = 1; i <= totalBars; i++){
    result.push({
      index: i,
      isFilled: (i <= props.energy.quantity)
    })
  }
  return result
})


const energy = toRefs(props).energy
const speed = toRefs(props).speed

const showCountdown = ref(false)
const timerCount = ref('0:00')
const percentageCount = ref(100)
const activeCountdown = ref(false)

const calculateRestoration = () => {
  if(!energy.value.restoration) return
  percentageCount.value = (energy.value.restoration.restorationTime - energy.value.restoration.nextRestoration) * 100 / energy.value.restoration.restorationTime
  timerCount.value = secondsFormat(energy.value.restoration.nextRestoration)
}

const countdown = () => {
  if (energy.value.restoration?.nextRestoration >= 0) {
    setTimeout(async () => {
      if(!energy.value.restoration || !activeCountdown.value) return
      energy.value.restoration.nextRestoration -= 1
      calculateRestoration()
      if (energy.value.restoration.nextRestoration == 0) getItem()
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
  if (!energy.value.restoration) return
  await getItem()
  calculateRestoration()
  if(!activeCountdown.value) activeCountdown.value = true
  countdown()

})
onMounted(async () => {
  showCountdown.value = false
  if (!energy.value.restoration) return
  await getItem()
  calculateRestoration()
  if(!activeCountdown.value) activeCountdown.value = true

})
onDeactivated(() => {
  activeCountdown.value = false
  showCountdown.value = false
})

watch(() => energy.value?.restoration, () => {
  if(!energy.value.restoration) return
  percentageCount.value = (energy.value.restoration.restorationTime - energy.value.restoration.nextRestoration) * 100 / energy.value.restoration.restorationTime
})
</script>
<style lang="scss" scoped>

</style>

