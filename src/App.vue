<template>
    <router-view/>
</template>

<script setup>
import { useUserStore } from './stores/user'
async function init () {
  const { autoSignIn } = useUserStore()
  await autoSignIn()
}
init()

</script>
