<template>
    <q-page-sticky :class="`q-app-header ${props.class}`"  ref="header" style="z-index: 100" expand position="top">
      <q-toolbar>
        <slot name="back-button"></slot>
        <slot/>
      </q-toolbar>
    </q-page-sticky>
    <q-scroll-observer @scroll="onScroll" />
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  reveal: Boolean,
  class: String
})

const header = ref(null)
let revealOffset = 0
const onScroll = (event) => {
  if (event.position.top > 0) {
    header.value.$el.classList.add('header-sticky')
    if (props.reveal) {
      checkReveal(event)
    }
  } else {
    header.value.$el.classList.remove('header-sticky')
  }
}
const checkReveal = (event) => {
  console.log(revealOffset)
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

</script>
<style scoped>
.q-app-header{
  transition: 0.2s ease;
}
.q-app-header.header-sticky{
  background: #fff !important;
  color: var(--q-dark) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.q-app-header.header-sticky.header-reveal{
  transform: translateY(-52px) !important;
}
</style>
