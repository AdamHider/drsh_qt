<template>
    <q-header reveal class="transparent text-white rounded-b-md"  ref="header">
      <q-toolbar>
        <slot/>
      </q-toolbar>
    </q-header>
    <q-scroll-observer @scroll="onScroll" />
</template>

<script setup>
import { ref } from 'vue'

const header = ref(null)

const onScroll = (event) => {
  if (event.position.top > 0) {
    header.value.$el.classList.add('header-sticky')
  } else {
    header.value.$el.classList.remove('header-sticky')
  }
}
</script>
<style scoped>
.q-header{
  transition: 0.2s ease;
}
.q-header.header-sticky{
  background: #fff !important;
  color: var(--q-dark) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);

}
</style>