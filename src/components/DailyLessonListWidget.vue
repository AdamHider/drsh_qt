<template>
  <div class="column q-gutter-md">
    <q-btn v-for="(lesson, lessonIndex) in quests" :key="`lessonIndex-${lessonIndex}`"
      class="" :to="`/lesson-startup-${lesson.id}`" round>
      <q-avatar size="60px" class="daily-lesson-avatar" :style="`background-image: url('${lesson.course_section.background_image}'); background-size: cover;`" >
        <img :src="lesson.image" height="60px" style="filter: drop-shadow(rgba(255, 255, 255, 0.5) 0px 0px 3px);" >
      </q-avatar>
    </q-btn>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useLesson } from '../composables/useLesson'

const { lesson, getDailyList  } = useLesson()
const  router = useRouter()

const error = ref(false)
const claimDialog = ref(false)
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
<style scoped lang="scss">
.daily-lesson-avatar{
  box-shadow: 0 0 0 2px $yellow;
  animation: pulseSignalShadow 0.75s ease infinite alternate;
  &:before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 0 1px $secondary;
    border-radius: inherit;
    animation: pulseSignal 1.5s ease infinite;
  }
  &:after{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 0 1px $secondary;
    border-radius: inherit;
    animation: pulseSignal 1.5s ease 0.2s infinite;
  }
}

@keyframes pulseSignal {
  0%{
    transform: scale(1);
    opacity: 1;
  }
  50%, 100%{
    transform: scale(1.5);
    opacity: 0;
  }
}
@keyframes pulseSignalShadow {
  0%{
    filter: drop-shadow(0 0 5px $yellow)
  }
  100%{
    filter: drop-shadow(0 0 0px $yellow)
  }
}


</style>
