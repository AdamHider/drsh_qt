<template>
  <div>
    <div v-if="lessons.length > 0" class="masonry-container q-pa-md ">
      <div v-for="(lesson, lessonIndex) in lessons" :key="`lessonIndex-${lessonIndex}`" :class="`masonry-item text-center`" :style="{ gridRowEnd: `span ${lesson.appearance.spans}` }">
        <q-card
            v-intersection="onIntersection"
            :class="`q-push q-pa-sm relative-position rounded-md  text-white text-shadow ${lesson.is_blocked ? 'is-blocked' : ''} ${lesson.appearance.class}`" @click="router.push(`/lesson-startup-${lesson.id}`)"
            :style="`border-color: rgba(0, 0, 0, 0.7); background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${(lesson.background_image) ? lesson.background_image : lesson.course_section.background_image}); background-position: center;`">
            <q-img class="planet-image allow-overflow absolute" :src="lesson.image"  :width="`${lesson.appearance.width}%`" style="filter: drop-shadow(rgba(53, 173, 244, 0.62) 0px 5px 10px);" no-spinner/>
          <q-card-section class="q-pb-sm q-pt-none q-px-xs">
            <div class="text-subtitle1"><b>{{ lesson.title }}</b></div>
            <div class="chip-container ">
              <div>
                <q-chip v-bind="getLessonStatus(lesson)" class="q-mx-none q-mb-none text-bold" size="11px" text-color="white"/>
              </div>
              <div>
                <q-chip
                  v-if="getLessonType(lesson)"
                  v-bind="getLessonType(lesson)"
                  class="q-mx-none q-mb-none text-bold"
                  size="11px"
                  text-color="white"
                />
              </div>
              <div>
                <ExploreDailyTimer  v-if="lesson.is_daily"/>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <BannerNotFound v-else
      title="Упс..."
      description="Планет и созвездий не найдено"
      default-image
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, reactive, watch, onDeactivated } from 'vue'
import { api } from '../services/index'
import { useRouter } from "vue-router";
import { playAudio } from 'src/services/audioService';
import BannerNotFound from './BannerNotFound.vue'
import ExploreDailyTimer from './ExploreDailyTimer.vue'


const router = useRouter();

const error = ref(false)

const lessons = ref([])

const props = defineProps({
  filter: Object,
})

const load = async () => {
  const courseSectionListResponse = await api.explore.getList({...props.filter, ...{type: 'all'}})
  if (courseSectionListResponse.error) {
    error.value = courseSectionListResponse
    lessons.value = []
    return false;
  }
  lessons.value = courseSectionListResponse
}

const getLessonStatus = (lesson) => {
  if (lesson.is_blocked)
    return { color: 'dark-transparent-75', icon: 'lock', label: 'Заблокировано' };

  if (lesson.progress === 100)
    return { color: 'gradient-green', icon: 'check', label: 'Исследовано' };

  if (lesson.progress > 0)
    return { color: 'dark-transparent-75', icon: 'fast_forward', label: `Исследовано ${lesson.progress}%` };

  return { color: 'dark-transparent-75', icon: 'rocket', label: 'Не исследовано' };
};

const getLessonType = (lesson) => {
  const types = {
    lexis: { icon: 'border_all', label: 'Карточки', color: 'light-gradient-primary' },
    chat: { icon: 'chat_bubble', label: 'Чат', color: 'gradient-red' },
    syllables: { icon: 'apps', label: 'Слоги', color: 'gradient-blue' },
    cryptogram: { icon: 'password', label: 'Слоги', color: 'light-gradient-indigo' },
  };
  return types[lesson.type] || null;
};

const onIntersection = (entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('is-in-view');
  } else {
    entry.target.classList.remove('is-in-view');
  }
}

onActivated(() => {
  load()
})
onMounted(() => {
  load()
})
watch(() => props.filter, () => {
  load()
}, { deep: true })

</script>
<style scoped lang="scss">
.is-blocked{
  filter: grayscale(1) brightness(0.9);
}
.masonry-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 5px;
  gap: 8px;
}

.masonry-item {
  display: flex;
  flex-direction: column;
  .q-card{
    height: 100%;
    display: flex;
    overflow: hidden;
    transition: 0.5s all 0.2s ease;
    background-size: 120%;
    &.is-in-view{
      background-size: 150%;
    }
    .q-img{
      transition: 0.5s all 0.2s ease;
    }
    &.align-start-left{
      flex-direction: column;
      text-align: left;
      .q-img{
        right: -30%;
        bottom: -10%;
      }
      .chip-container{
        margin-left: -12px;
        .q-chip{
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
          padding-left: 12px;
        }
      }
      &.is-in-view .q-img{
        transform: translateX(-10%);
      }
    }
    &.align-start-right{
      flex-direction: column;
      text-align: right;
      .q-img{
        left: -30%;
        bottom: -10%;
      }
      .chip-container{
        margin-right: -12px;
        .q-chip{
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
          padding-right: 12px;
        }
      }
      &.is-in-view .q-img{
        transform: translateX(10%);
      }
    }
    &.align-end-left{
      flex-direction: column-reverse;
      text-align: left;
      .q-img{
        right: -30%;
        top: -10%;
      }
      .chip-container{
        margin-left: -12px;
        .q-chip{
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
          padding-left: 12px;
        }
      }
      &.is-in-view .q-img{
        transform: translateX(-10%);
      }
    }
    &.align-end-right{
      flex-direction: column-reverse;
      text-align: right;
      .q-img{
        left: -30%;
        top: -10%;
      }
      .chip-container{
        margin-right: -12px;
        .q-chip{
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
          padding-right: 12px;
        }
      }
      &.is-in-view .q-img{
        transform: translateX(10%);
      }
    }
  }
}
@media (max-width: 800px) { .masonry-container { column-count: 2; } }
</style>
