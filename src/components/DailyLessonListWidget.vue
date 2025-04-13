<template>
  <div class="column q-gutter-md" v-if="lessons.length > 0">
    <q-btn class="bg-gradient-primary" round push>
      <q-avatar size="60px" class="daily-lesson-avatar">
        <img src="/images/icons/radar.png" height="60px" style="filter: drop-shadow(rgba(255, 255, 255, 0.5) 0px 0px 3px);" >
      </q-avatar>
      <q-badge floating rounded color="secondary" style="width: 20px; height: 20px;"><b>{{ lessons.length }}</b></q-badge>
      <q-menu anchor="top middle" self="bottom middle"
        transition-show="jump-up"
        transition-hide="jump-down"
        class="bg-transparent q-flat allow-overflow" fit>
        <div class="row no-wrap justify-center q-py-md q-px-sm">
          <div class="column q-gutter-md">
          <q-btn v-for="(lesson, lessonIndex) in lessons" :key="`lessonIndex-${lessonIndex}`"
            class="bg-secondary" :to="`/lesson-startup-${lesson.id}`" round push>
            <q-avatar size="57px" class="daily-lesson-avatar lesson" :style="`background-image: url('${lesson.course_section.background_image}'); background-size: cover;`" >
              <q-img :src="lesson.image" width="45px" style="filter: drop-shadow(rgba(255, 255, 255, 0.5) 0px 0px 3px);" />
            </q-avatar>
          </q-btn>
        </div>
        </div>
      </q-menu>
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
const fabButton = ref(false)

const lessons = ref([])

const props = defineProps({
  activeOnly: Boolean
})

const load = async () => {
  const questListResponse = await getDailyList()
  if (questListResponse.error) {
    error.value = questListResponse
    lessons.value = []
    return false;
  }
  lessons.value = lesson.dailyList
}

onActivated(() => {
  load()
})

</script>
<style scoped lang="scss">
.daily-lesson-avatar{
  &.lesson{
    box-shadow: inset 0 0 0 2px $yellow;
  }
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
