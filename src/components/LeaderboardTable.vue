<template>
  <q-card flat style="min-height:300px">
    <q-inner-loading :showing="isLoading">
      <q-spinner-puff size="50px" color="primary" />
    </q-inner-loading>
    <q-card-section class="q-py-sm text-left">
      <LeaderboardFilter
        :allowed-filters="props.allowedFilters"
        :timePeriod="props.timePeriod"
        @update-filter="updateFilter($event)"
      />
    </q-card-section>
    <q-card-section v-if="leaderboardList.length > 0 " class="q-py-sm q-px-sm relative-position">
        <div v-intersection="onIntersection" direction="up" key="up"></div>
        <q-list ref="leaderboardContainer">
          <q-item class="text-left text-bold text-grey-7" style="font-size: 12px">
            <q-item-section avatar>
              <q-item-label>Место</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>Герой</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>Очки</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-for="(row, commonKey) in leaderboardList" :key="`leaderboardKey${commonKey}`" :active="row.is_active == 1" :class="`q-my-sm text-left rounded-sm ${(row.is_active == 1) ? ' bg-gradient-primary text-white' : 'text-dark'}`">
              <q-item-section avatar class="text-center">
                <q-avatar v-if="row.place == 1" floating rounded color="gradient-gold" class="text-white q-push" size="40px" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;">
                  <b style="margin-bottom:2px">{{ row.place }}</b>
                </q-avatar>
                <q-avatar v-else-if="row.place == 2" floating rounded color="gradient-silver" size="40px" class="text-white q-push" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;">
                  <b style="margin-bottom:2px">{{ row.place }}</b>
                </q-avatar>
                <q-avatar v-else-if="row.place == 3" floating rounded color="gradient-bronze" size="40px" class="text-white q-push" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;">
                  <b style="margin-bottom:2px">{{ row.place }}</b>
                </q-avatar>
                <q-avatar v-else size="40px" >
                  <b>{{ row.place }}</b>
                </q-avatar>
              </q-item-section>

              <q-item-section avatar>
                <div class="q-gutter-sm">
                  <q-avatar size="40px" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px;">
                      <img :src="row.image">
                  </q-avatar>
                </div>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span class="q-pa-none ">
                    <b>{{ row.name }}</b>
                    <span v-if="row.is_active" id="userRow"></span>
                    <span class="q-ml-xs" v-if="row.achievements.length > 0">
                      <q-avatar size="22px" v-for="(achievementItem, achievementIndex) in row.achievements" :key="`achievementIndex${achievementIndex}`">
                        <q-img :src="achievementItem.image"/>
                        <q-menu self="top middle">
                          <q-item class="q-pl-sm">
                            <q-item-section avatar>
                              <q-img :src="achievementItem.image"/>
                            </q-item-section>
                            <q-item-section>
                              <b>{{ achievementItem.title }}</b>
                            </q-item-section>
                          </q-item>
                        </q-menu>
                      </q-avatar>
                    </span>
                  </span>
                </q-item-label>
                <q-item-label caption :class="` ${(row.is_active == 1) ? ' text-white' : 'text-grey-8'}`">
                  Уровень {{ row.level.level }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div :class="`text-subtitle ${(row.is_active == 1) ? ' text-white' : 'text-grey-8'}`"><b>{{ row.points }}</b></div>
              </q-item-section>
          </q-item>
        </q-list>
          <div v-intersection="onIntersection" direction="down" key="down"></div>
    </q-card-section>
    <q-card-section v-else class="q-pa-none">
      <BannerNotFound
        title="Упс..."
        description="Пока показать нечего"
        default-image
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onActivated, onMounted, ref, reactive, watch, nextTick } from 'vue'
import LeaderboardFilter from '../components/LeaderboardFilter.vue'
import BannerNotFound from '../components/BannerNotFound.vue'
import { useExercise } from '../composables/useExercise.js'
import { api } from '../services/index'

const { getLeaderboard } = useExercise()

const leaderboardList = ref([])
const leaderboardContainer = ref(null)
const leaderboardData = reactive({
  filter: {
    time_period: 'all'
  },
  data: {},
  limit: 20,
  placeStart: 0,
  placeEnd: 0
})
const isLoading = ref(false)
const isLoadingInitial = ref(false)

const props = defineProps({
  allowedFilters: Array,
  lessonId: String,
  challengeId: String,
  timePeriod: String
})

const loadTable = async (direction) => {

  const target = document.documentElement
  const oldScrollHeight = target.scrollHeight;

  // Текущая позиция скролла (насколько мы прокрутили вниз)
  const oldScrollTop = target.scrollTop;

  isLoading.value = true
  const filter = {
    mode: 'new',
    place_start: leaderboardData.placeStart,
    place_end: leaderboardData.placeEnd
  }
  const leaderboardResponse = await api.exercise.getLeaderboard(filter)
  if(direction == 'up'){
    leaderboardResponse.reverse()
    for(var i in leaderboardResponse){
      leaderboardList.value.unshift(leaderboardResponse[i]);
    }
  } else if(direction == 'down') {
    for(var i in leaderboardResponse){
      leaderboardList.value.push(leaderboardResponse[i]);
    }
  } else {
    leaderboardList.value = leaderboardResponse
  }
  leaderboardData.placeStart = leaderboardList.value[0].place
  leaderboardData.placeEnd = leaderboardList.value[leaderboardList.value.length - 1].place
  isLoading.value = false
  await nextTick();

  // Новая общая высота прокручиваемого контента
  const newScrollHeight = target.scrollHeight;

  // Вычисляем, насколько увеличилась высота (т.е. высота добавленных элементов)
  const addedHeight = newScrollHeight - oldScrollHeight;

  // Устанавливаем новую позицию скролла:
  // Старая позиция + высота добавленных элементов
  const newScrollTop = oldScrollTop + addedHeight;

  // Применяем новую позицию
  target.scrollTop = newScrollTop;
}

const onIntersection = async (entry) => {
  const direction = entry.target.attributes.direction.value
  if(entry.isIntersecting){
    if(isLoadingInitial.value) return false
    if(direction == 'up'){
      leaderboardData.placeEnd = leaderboardData.placeStart
      leaderboardData.placeStart = leaderboardData.placeEnd - leaderboardData.limit - 1
    } else
    if(direction == 'down'){
      leaderboardData.placeStart = leaderboardData.placeEnd*1
      leaderboardData.placeEnd = leaderboardData.placeStart + leaderboardData.limit*1
    }
    await loadTable(direction)

  }
};

const updateFilter = (filter) => {
  leaderboardData.filter = filter
  loadTable()
}

onActivated(async () => {
  isLoadingInitial.value = true
  await loadTable()
  setTimeout(() => {
    if(document.querySelector('#userRow')) document.querySelector('#userRow').scrollIntoView({block: "center", behavior: "smooth"})
    isLoadingInitial.value = false
  }, 100);
})
</script>
