<template>
    <router-view ></router-view>
</template>

<script setup>
import { useUserStore } from './stores/user'
async function init () {
  const { autoSignIn } = useUserStore()
  const auto = await autoSignIn()
}
init()

</script>
