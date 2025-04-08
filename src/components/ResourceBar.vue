<template>
     <q-item :class="`${(resource.quantity >= resource.quantity_cost) ? `bg-light-gradient-${resource?.color} text-white` : 'bg-grey-4 text-red'} text-left rounded-sl q-item--push`" >
        <q-item-section avatar style="min-width: unset;">
            <q-img width="25px" :src="resource.image" style="filter: drop-shadow(1px 3px 3px #00000075 );"/>
        </q-item-section>
        <q-item-section>
            <q-item-label>
              <span class="text-subtitle2"><b>{{resource.quantity}}</b></span>
              <span class="text-caption"><b>/{{ resource.quantity_cost }}</b></span>
            </q-item-label>
        </q-item-section>
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

