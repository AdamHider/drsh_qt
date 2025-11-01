<template>
  <div class="column q-gutter-md" v-if="dailyLessons.length > 0">
    <q-btn :class="`bg-gradient-primary ${(unexploredCount > 0) ? 'unexplored' : ''}`" round push @click="dailyLessonDialog = true" @click.stop="playAudio('click')">
      <q-avatar size="60px" class="daily-lesson-avatar">
        <img src="/images/icons/radar.png" height="60px" style="filter: drop-shadow(rgba(255, 255, 255, 0.5) 0px 0px 3px);" >
      </q-avatar>
      <q-badge v-if="unexploredCount > 0" floating rounded color="secondary" style="width: 20px; height: 20px; box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;"><b>{{ unexploredCount }}</b></q-badge>
    </q-btn>
    <q-dialog v-model="dailyLessonDialog" position="bottom">
      <q-card class="q-push">
        <q-toolbar>
          <q-toolbar-title class="text-subtitle1"><b>Ежедневные планеты</b></q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section style="max-height: 50vh" class="scroll">
          <q-list>
            <q-item v-for="(lesson, lessonIndex) in dailyLessons" :key="`lessonIndex-${lessonIndex}`" clickable
                :class="`q-push  relative-position rounded-sm q-mb-md text-white text-shadow ${lesson.is_blocked ? 'is-blocked' : ''}`" :to="`/lesson-startup-${lesson.id}`"
                :style="`background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${lesson.course_section.background_image}); background-size: cover; background-position: center;`">
              <q-item-section avatar>
                    <q-img class="planet-image" :src="lesson.image" width="60px" style="filter: drop-shadow(0px 0px 15px #35adf4);" no-spinner/>
              </q-item-section>
              <q-item-section style="z-index: 0">
                <div class="text-subtitle1"><b>{{ lesson.title }}</b></div>
                <div class="text-sm max-three-lines">{{ lesson.description }}</div>
              </q-item-section>
              <q-btn v-if="lesson.is_blocked" round class="absolute-top-right" color="dark" icon="lock" push style="top: -5px; right: -5px; rotate: 15deg"></q-btn>

            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, toRef, onMounted, onActivated, watch } from 'vue'
import { useLesson } from '../composables/useLesson'
import { playAudio } from 'src/services/audioService';



const { lesson, getDailyList  } = useLesson()

const error = ref(false)

const dailyLessons = ref([])
const unexploredCount = ref(0)

const dailyLessonDialog = ref(false)

const props = defineProps({
  activeOnly: Boolean,
  reloadTrigger: Boolean
})

const reloadTrigger = toRef(props, "reloadTrigger");

const load = async () => {
  const lessonListResponse = await getDailyList()
  if (lessonListResponse.error) {
    error.value = lessonListResponse
    dailyLessons.value = []
    return false;
  }
  dailyLessons.value = lesson.dailyList
  unexploredCount.value = dailyLessons.value.filter(function(item){
    return !item.is_blocked && !item.is_explored;
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
.is-blocked{
  filter: grayscale(1) brightness(0.9);
}
.daily-lesson-avatar{
  &.lesson{
    box-shadow: inset 0 0 0 2px $yellow;
  }
  &.unexplored:before{
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
  &.unexplored:after{
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
