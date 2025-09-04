<template>
  <div class="column q-gutter-md" v-if="lessons.length > 0">
    <q-btn class="bg-gradient-primary" round push @click="dailyLessonDialog = true">
      <q-avatar size="60px" class="daily-lesson-avatar">
        <img src="/images/icons/radar.png" height="60px" style="filter: drop-shadow(rgba(255, 255, 255, 0.5) 0px 0px 3px);" >
      </q-avatar>
      <q-badge v-if="unexploredCount > 0" floating rounded color="secondary" style="width: 20px; height: 20px; box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;"><b>{{ unexploredCount }}</b></q-badge>
      <q-menu anchor="top middle" self="bottom middle"
        transition-show="jump-up"
        transition-hide="jump-down"
        class="bg-transparent q-flat allow-overflow" fit>
        <div v-for="(lesson, lessonIndex) in lessons" :key="`lessonIndex-${lessonIndex}`" class="text-center q-mb-md ">
          <router-link :to="`/lesson-startup-${lesson.id}`">
            <q-avatar clickable v-ripple  :to="`/lesson-startup-${lesson.id}`"
              :class="`q-push relative-position  ${(lesson.is_explored) ? '' : 'daily-lesson-avatar'}`" size="60px"
              :style="`background-image: url(${lesson.course_section.background_image}); background-size: cover; background-position: center; height: 64px;`">
                <q-img :src="lesson.image" width="50px" style="filter: drop-shadow(0px 0px 15px #35adf4);" no-spinner/>
            </q-avatar>
            <div class="text-white text-caption"><b>{{ lesson.title }}</b></div>
          </router-link>
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import { ref, toRef, onMounted, onActivated, watch } from 'vue'
import { useLesson } from '../composables/useLesson'

const { lesson, getDailyList  } = useLesson()

const error = ref(false)

const lessons = ref([])
const dailyLessonDialog = ref(false)
const unexploredCount = ref(0)

const props = defineProps({
  activeOnly: Boolean,
  reloadTrigger: Boolean
})

const reloadTrigger = toRef(props, "reloadTrigger");

const load = async () => {
  const questListResponse = await getDailyList()
  if (questListResponse.error) {
    error.value = questListResponse
    lessons.value = []
    return false;
  }
  lessons.value = lesson.dailyList
  unexploredCount.value = lessons.value.filter(function(item){
    return !item.is_explored;
  }).length;
}

onActivated(() => {
  load()
})
onMounted(() => {
  load()
})
watch(() => reloadTrigger.value, () => {
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
