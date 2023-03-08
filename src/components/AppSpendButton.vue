<template>
    <q-btn :push="props.push" dense :class="`${props.class}`" :color="props.color" style="overflow: hidden; padding: 0" >
      <div class="flex justify-between ">
        <div class="col q-py-xs q-px-md">Start</div>
        <q-chip v-if="props.sideLabel" square :text-color="props.sideLabelColor" style="background-color: #00000038; border-radius: 0"  class="col-3 q-ma-none q-pa-none q-py-xs q-px-sm" >
          <q-icon :name="props.sideIcon" color="yellow"></q-icon>
          {{ props.sideLabel }}
        </q-chip>
      </div>
    </q-btn>
</template>

<script setup>
import { ref, onActivated, defineExpose } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const props = defineProps({
  class: String,
  color: String,
  sideIcon: String,
  sideLabel: String,
  sideLabelColor: String,
  push: Boolean
})
const header = ref(null)
let revealOffset = 0
const onScroll = (event) => {
  if (event.position.top > 0) {
    if (props.reveal) {
      header.value.$el.classList.add('header-sticky')
      checkReveal(event)
    }
  } else {
    revealOffset = 0
    header.value.$el.classList.remove('header-sticky')
  }
}
const checkReveal = (event) => {
  if (event.direction == 'down') {
    if (revealOffset > 150) {
      header.value.$el.classList.add('header-reveal')
    }
    revealOffset += event.delta.top
  } else {
    header.value.$el.classList.remove('header-reveal')
    revealOffset = 0
  }
}
defineExpose({
  onScroll
})
onActivated(() => {
  revealOffset = 0
  header.value.$el.classList.remove('header-reveal')
})

</script>
<style scoped>
.q-app-header{
  transition: 0.2s ease;
}
.q-app-header.bordered{
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.12);
}
.q-app-header.header-sticky{
  background: #fff !important;
  color: var(--q-dark) !important;
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.12);
}
.q-app-header.header-sticky.header-reveal{
  transform: translateY(-52px) !important;
}
</style>
