<template>
    <router-view ></router-view>
</template>

<script setup>
import { useUserStore } from './stores/user'
import { useLesson } from './composables/useLesson'
import { useCourse } from './composables/useCourse'
import { useLoader } from './composables/useLoader'
import { useNotification } from './composables/useNotification'

import { onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const { getList } = useLesson()
const { getItem } = useCourse()
const { showLoader, hideLoader } = useLoader()
const { initSSE, closeSSE } = useNotification()
const router = useRouter()
const route = useRoute()

async function init () {
  //showLoader()
  const { user, autoSignIn } = useUserStore()
  await autoSignIn()
  await initSSE()
  /*
  router.push('/courses')
  router.push('/user')
  await getList(1)
  await getItem(user.active.data.settings.courseId.value)*/
  //hideLoader()
}
async function dismount () {
  closeSSE()
}
onMounted(() => init())
onUnmounted(() => dismount() )




</script>
