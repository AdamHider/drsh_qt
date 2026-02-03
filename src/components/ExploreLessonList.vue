<template>
  <div>
    <q-infinite-scroll @load="onLoadNextPage" :offset="250" :disable="!hasMore">

      <div v-if="lessons.length > 0" class="masonry-container q-pa-md">
        <div
          v-for="(lesson, lessonIndex) in lessons"
          :key="lesson.id"
          class="masonry-item text-center"
          :style="{ gridRowEnd: `span ${lesson.appearance.spans}` }"
        >
          <q-card
            v-intersection="onIntersection"
            class="lesson-card q-push q-pa-sm relative-position rounded-md text-white text-shadow "
            :class="[lesson.is_blocked ? 'is-blocked' : '', (lesson.progress == 0 && lesson.is_daily) ? 'q-item-blinking' : '', lesson.appearance.class]"
            @click="router.push(`/lesson-startup-${lesson.id}`)"
            :style="getCardStyle(lesson)"
          >
            <q-img
              class="planet-image allow-overflow absolute"
              :src="`${lesson.image}?w=350&h=350`"
              :width="`${lesson.appearance.width}%`"
              style="filter: drop-shadow(rgba(53, 173, 244, 0.62) 0px 5px 10px);"
              no-spinner
            />

            <q-card-section class="q-pb-sm q-pt-none q-px-xs">
              <div class="text-subtitle1"><b>{{ lesson.title }}</b></div>
              <div class="chip-container ">
                <div><q-chip v-bind="getLessonStatus(lesson)" class="q-mx-none q-mb-none text-bold" size="11px" text-color="white"/></div>
                <div><q-chip v-if="getLessonType(lesson)" v-bind="getLessonType(lesson)" class="q-mx-none q-mb-none text-bold" size="11px" text-color="white" /></div>
                <div><q-chip v-if="lesson.is_new" class="q-mx-none q-mb-none text-bold q-item-blinking" color="gradient-blue" size="11px" text-color="white" icon="star">Новинка</q-chip></div>
                <div><q-chip v-if="lesson.is_premium && lesson.is_blocked" class="q-mx-none q-mb-none text-bold" color="light-gradient-green" size="11px" text-color="white" icon="diamond">Премиум</q-chip></div>
                <div><ExploreDailyTimer v-if="lesson.is_daily"/></div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <BannerNotFound v-else-if="!loading" title="Упс..." description="Планет и созвездий не найдено" default-image />

      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script setup>
import { ref, watch, onActivated } from 'vue'
import { api } from '../services/index'
import { useRouter } from "vue-router";
import BannerNotFound from './BannerNotFound.vue'
import ExploreDailyTimer from './ExploreDailyTimer.vue'

const router = useRouter();
const props = defineProps({ filter: Object })

const lessons = ref([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(0)
const itemsPerPage = 12

const getCardStyle = (lesson) => {
  const bg = lesson.background_image || lesson.course_section?.background_image;
  return {
    borderColor: 'rgba(0, 0, 0, 0.7)',
    backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${bg}?w=500&h=500)`,
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  }
}

const fetchLessons = async (page) => {
  const params = {
    ...props.filter,
    type: props.filter?.type || 'all',
    page: page,
    limit: itemsPerPage
  }
  return await api.explore.getList(params)
}
const refreshList = async () => {
  if (loading.value) return
  
  loading.value = true
  
  // Если страниц еще нет, начинаем с первой
  const pageToRefresh = currentPage.value || 1
  
  // Рассчитываем, сколько элементов нам нужно загрузить, чтобы покрыть весь текущий список
  // Например, если были на 3-й странице: 3 * 12 = 36 элементов.
  const totalToFetch = pageToRefresh * itemsPerPage

  const params = {
    ...props.filter,
    type: props.filter?.type || 'all',
    page: 1, // Всегда берем с начала
    limit: totalToFetch // Но увеличиваем лимит до текущего размера списка
  }

  try {
    const data = await api.explore.getList(params)

    if (data.error || !Array.isArray(data)) {
      // Оставляем старый список, если пришла ошибка (опционально)
    } else {
      lessons.value = data
      // Проверяем, есть ли смысл грузить дальше
      hasMore.value = data.length >= totalToFetch
      // Важно: currentPage НЕ сбрасываем, он остается прежним
    }
  } catch (e) {
    console.error("Refresh failed", e)
  } finally {
    loading.value = false
  }
}
const onLoadNextPage = async (index, done) => {
  // Защита от дублирующих запросов, пока идет refreshList
  if (!hasMore.value || loading.value) {
    done()
    return
  }

  const nextPage = currentPage.value + 1
  const data = await fetchLessons(nextPage)

  if (data.error || !Array.isArray(data) || data.length === 0) {
    hasMore.value = false
  } else {
    lessons.value = [...lessons.value, ...data] // Лучше использовать spread для реактивности
    currentPage.value = nextPage
    if (data.length < itemsPerPage) hasMore.value = false
  }

  done()
}

const getLessonStatus = (l) => {
  if (l.is_blocked) return { color: 'dark-transparent-75', icon: 'lock', label: 'Заблокировано' };
  if (l.progress >= 100) return { color: 'gradient-green', icon: 'check', label: 'Исследовано' };
  return l.progress >= 0 && l.exercise_id
    ? { color: 'gradient-teal', icon: 'fast_forward', label: `Исследуется (${l.progress}%)` }
    : { color: 'dark-transparent-75', icon: 'rocket', label: 'Не исследовано' };
}

const getLessonType = (l) => {
  const types = {
    lexis: { icon: 'border_all', label: 'Карточки', color: 'light-gradient-primary' },
    chat: { icon: 'chat_bubble', label: 'Чат', color: 'gradient-red' },
    syllables: { icon: 'apps', label: 'Слоги', color: 'gradient-blue' },
    cryptogram: { icon: 'password', label: 'Шифр', color: 'gradient-pink' },
  };
  return types[l.type] || null;
}

const onIntersection = (entry) => {
  if (entry.isIntersecting) entry.target.classList.add('is-in-view');
  else entry.target.classList.remove('is-in-view');
}
onActivated(() => {
  refreshList()
})
watch(() => props.filter, () => {
  currentPage.value = 0  
  lessons.value = []
  refreshList()
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
    background-size: cover;
    .q-img{
      transition: 0.5s all  ease;
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
@media (max-width: 500px) { .masonry-container { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 700px) { .masonry-container { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1200px) { .masonry-container { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 1500px) { .masonry-container { grid-template-columns: repeat(5, 1fr); } }
</style>
