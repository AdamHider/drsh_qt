<template>
      <q-item :dense="props.dense" clickable
        :class="`relative text-dark q-px-xs rounded-md`" >
          <q-item-section side class="q-pa-none"  :style="`min-width: ${props.size};`">
            <q-circular-progress
              show-value
              :value="speedPercentage"
              size="60px"
              :thickness="0.28"
              :color="`blue`"
              track-color="grey-1"
              class="bg-grey-4"
              style="box-shadow: 0px 0px 0px 4px #e3e3e3; border-radius: 100%;"
            >
            <q-avatar  size="38px" class="bg-dark-gradient-cosmic energy-avatar" style="z-index: 3">
              <q-img class="absolute-bottom" width="38px" :src="`/images/resources/energy${(speed.quantity > 0) ? speed.quantity : ''}.png`" style="filter: drop-shadow(rgba(0, 0, 0, 0.44) 0px 2px 2px); scale: 1.2; min-height: 32px; z-index: 2" no-spinner/>
            </q-avatar>
            <div class="blinking-speed-marks">
              <div :class="`blinking-speed-${speed.quantity}`"></div>
            </div>
            <div >
              <div class="absolute-full delimiter delimiter-1">
                <div class="delimiter-container"><div class="delimiter-value "></div></div>
              </div>
              <div class="absolute-full delimiter delimiter-2">
                <div class="delimiter-container"><div class="delimiter-value "></div></div>
              </div>
              <div class="absolute-full delimiter delimiter-3">
                <div class="delimiter-container"><div class="delimiter-value "></div></div>
              </div>
              <div class="absolute-full delimiter delimiter-4">
                <div class="delimiter-container"><div class="delimiter-value "></div></div>
              </div>
            </div>
            </q-circular-progress>
          </q-item-section>
          <q-item-section>
            <div class="flex justify-between full-width">
              <div class="text-caption"><b>Энергия: {{ energy.quantity }}/{{ energy.max_quantity }}</b> </div>
              <div class="text-caption text-grey-8" v-if="timer.energy"><b>До пополнения: {{ timer.energy }}</b></div>
            </div>
            <div class="flex q-px-md q-pt-xs q-pb-sm bg-grey-4 rounded-md rounded-l-0" :style="`gap: 4px; margin-left: -10px`">
              <div v-for="(energyBar, energyBarIndex) in energyBars" :key="`barIndex${energyBarIndex}`" style="flex: 1" >
                <q-chip :class="`q-push bg-${(energyBar.isFilled) ? (energyBar.isForsage) ? 'gradient-gold' : 'light-gradient-'+energy?.color : 'grey'} full-height full-width rounded-xs q-my-none  q-pa-none`" >
                  <div v-if="energyBar.isCurrentlyRestorating" class="text-caption full-width text-center">
                    <b>{{ timer.energy }}</b>
                  </div>
                </q-chip>
              </div>
            </div>
            <div class="flex justify-between full-width q-pr-sm">
              <div class="text-caption text-grey-8"><b>Скорость: {{speed.quantity}}/{{speed.max_quantity}}</b></div>
              <div class="text-caption text-grey-8"><b>До снижения: {{ timer.speed }}</b></div>
            </div>
          </q-item-section>
      </q-item>
</template>

<script setup>
import { ref, watch, reactive, toRefs, computed, onActivated, onDeactivated, onMounted } from 'vue'
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

const speedPercentage = computed(() => {
  return Math.round(props.speed.quantity * 100 / props.speed.max_quantity)
})
const energyBars = computed(() => {
  const result = []
  const totalBars = props.energy.max_quantity ??  props.energy.quantity
  let isForsage = false
  let isFilled = true
  let isCurrentlyRestorating = false
  for(var i = 1; i <= totalBars; i++){
    isCurrentlyRestorating = false
    if(i > 3) isForsage = true
    if((i > props.energy.quantity)){
      isFilled = false
    }
    if(!isFilled && i - props.energy.quantity == 1) isCurrentlyRestorating = true
    result.push({
      index: i,
      isFilled: isFilled,
      isCurrentlyRestorating: isCurrentlyRestorating,
      isForsage: isForsage
    })
  }
  return result
})


const energy = toRefs(props).energy
const speed = toRefs(props).speed

const showCountdown = ref(false)
const speedTimerCount = ref('0:00')
const timer = reactive({
  energy: '',
  speed: ''
})
const percentageCount = ref(100)
const activeCountdown = ref(false)

const calculateRestoration = (resourse, code) => {
  if(!resourse.restoration) return
  percentageCount.value = (resourse.restoration.restorationTime - resourse.restoration.nextRestoration) * 100 / resourse.restoration.restorationTime
  timer[code] = secondsFormat(resourse.restoration.nextRestoration)
}

const countdown = (resourse, code) => {
  if (resourse.restoration?.nextRestoration >= 0) {
    setTimeout(async () => {
      if(!resourse.restoration || !activeCountdown.value) return
      resourse.restoration.nextRestoration -= 1
      calculateRestoration(resourse, code)
      if (resourse.restoration.nextRestoration == 0) getItem()
      showCountdown.value = true
      countdown(resourse, code)
    }, 1000)
  }
}
const secondsFormat = (timeLeft) => {
  let totalSeconds = ++timeLeft;
  let seconds = totalSeconds % 60;
  if (seconds < 10) seconds = '0' + seconds;
  const totalMinutes = parseInt(totalSeconds / 60, 10);
  const minutes = totalMinutes % 60;
  const formattedMinutes = (totalMinutes >= 60 && minutes < 10) ? '0' + minutes : String(minutes);

  const hours = parseInt(totalMinutes / 60, 10);
  if (hours > 0) {
    const formattedHours = hours < 10 ? '0' + hours : String(hours);
    return `${formattedHours}:${formattedMinutes}:${seconds}`;
  } else {
    return `${formattedMinutes}:${seconds}`;
  }
}

onActivated(async () => {
  showCountdown.value = false
  await getItem()
  if(!activeCountdown.value) activeCountdown.value = true
  if (speed.value.restoration){
    calculateRestoration(speed.value, 'speed')
    countdown(speed.value, 'speed')
  }
  if (energy.value.restoration){
    calculateRestoration(energy.value, 'energy')
    countdown(energy.value, 'energy')
  }
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
.delimiter{
  position: absolute;
  top: 0;
  left: 0;
  .delimiter-container{
    position: absolute;
    top: 0;
    left: calc(50% - 6px);
    height: 9px;
    width: 12px;
    overflow: hidden;
    .delimiter-value{
    }
    &:after{
      content: "";
      position: absolute;
      top: 1px;
      right: -5px;
      height: 100%;
      width: 9px;
      box-shadow: 0px 0px 0px 4px #e0e0e0;
      border-radius: 100%;
      rotate: 30deg;
    }
    &:before{
      content: "";
      position: absolute;
      top: 1px;
      left: -5px;
      height: 100%;
      width: 9px;
      box-shadow: 0px 0px 0px 4px #e0e0e0;
      border-radius: 100%;
      rotate: -30deg;
    }
  }
  &.delimiter-2{
    transform: rotate(90deg);
  }
  &.delimiter-3{
    transform: rotate(180deg);
  }
  &.delimiter-4{
    transform: rotate(270deg);
  }
}
.blinking-speed-marks{
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  > div{
    position: absolute;
    background: $grey-3;
    &.blinking-speed-1{
      width: 50%;
      height: 50%;
      left: 50%;
      top: 0;
      animation: pulseSpeedMarkRight 1.7s ease infinite ;
    }
    &.blinking-speed-2{
      width: 50%;
      height: 50%;
      left: 50%;
      top: 50%;
      animation: pulseSpeedMarkRight 1.7s ease infinite ;
    }
    &.blinking-speed-3{
      width: 50%;
      height: 50%;
      left: 0;
      top: 50%;
      animation: pulseSpeedMarkLeft 1.7s ease infinite ;
    }
  }
}
.energy-avatar{
  box-shadow: 0px 0px 0px 2px $grey-3;
}
@keyframes pulseSpeedMarkRight {
  0% {
    opacity: 0.7;
    transform: translateY(0) scaleY(1);
  }
  100% {
    transform: translateY(-50%) scaleY(0);
    opacity: 0;
  }
}
@keyframes pulseSpeedMarkLeft {
  0% {
    opacity: 0.7;
    transform: translateY(0) scaleY(1);
  }
  100% {
    transform: translateY(50%) scaleY(0);
    opacity: 0;
  }
}
</style>

