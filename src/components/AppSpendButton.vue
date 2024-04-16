<template>
    <q-btn :push="props.push" dense :class="`${props.class}`" :color="props.color" style="padding-right: 2px;">
      <div class="flex justify-between items-center">
        <span class="block">Start</span>
        <q-icon :name="props.iconRight"/>
        <div class="q-ma-xs" style="background-color: #00000038; border-radius: 8px">
          <q-chip  v-for="(resource, index) in props.resources" :key="index"
            square :text-color="(resource.quantity > resource.quantity_cost) ? 'white' : 'red'"
            color="transparent"
            class="q-ma-none q-px-xs" >
            <q-img class="q-mr-sm" width="20px" :src="resource.image" style="filter: hue-rotate(0deg) drop-shadow(1px 3px 3px #00000075 );"/>
            <b>{{ resource.quantity_cost }}</b>
          </q-chip>
        </div>
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
  resources: Array,
  iconRight: String,
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
