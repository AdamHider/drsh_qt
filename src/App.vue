<template>
  <router-view />
</template>

<script setup>
// Composables
import { watch } from 'vue'
import { useUserStore } from './stores/user'
import { useClassroom } from './composables/useClassroom'
import { useAppMessage } from './composables/useAppMessage'
async function init () {
  const { user, autoSignIn } = useUserStore()
  await autoSignIn()

  const { getActive, getList } = useClassroom()
  if (user.active.data.id) await getActive(); await getList()

  watch(() => user.active.data?.profile?.active_classroom_code, (newData, oldData) => {
    getActive()
    getList()
  })
}
init()

</script>
