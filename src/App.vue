<template>
    <router-view ></router-view>
</template>

<script setup>
import { useUserStore } from './stores/user'
import { useRoute } from 'vue-router'
const route = useRoute()
async function init () {
  const { autoSignIn } = useUserStore()
  await autoSignIn()
}
init()

</script>
