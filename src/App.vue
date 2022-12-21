<template>
  <router-view />
</template>

<script setup>
// Composables
import { useUserStore } from './stores/user'
import { useAppMessage } from './composables/useAppMessage'
async function init () {
  const { autoSignIn } = useUserStore()
  await autoSignIn()
}
init()

</script>
