<template>
  <div>
    <div class="flex column">
      <q-avatar>
        <img src="/images/wormhole.jpg" height="45px" class="absolute-bottom q-ml-sm q-mb-xs">
      </q-avatar>
    </div>
  </div>
</template>

<script setup>
import { api } from '../services/index'
import { ref, onMounted, onActivated } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useNavigationHistory } from '../composables/useNavigationHistory'
import { useLesson } from '../composables/useLesson'

const { lesson, getDailyList  } = useLesson()
const  router = useRouter()

const error = ref(false)
const claimDialog = ref(false)
const claimRewards = ref({})
const claimError = ref(false)
const reloadTrigger = ref(false)
const quests = ref([])

const props = defineProps({
  activeOnly: Boolean
})

const load = async () => {
  const questListResponse = await getDailyList()
  if (questListResponse.error) {
    error.value = questListResponse
    quests.value = []
    return false;
  }
  quests.value = lesson.dailyList
}

onBeforeRouteLeave((to, from) => {
  if (claimDialog.value) {
    return false
  }
  return true
})

onActivated(() => {
  load()
})

</script>
