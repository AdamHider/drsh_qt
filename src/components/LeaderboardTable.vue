<template>
  <q-card flat style="min-height:300px">
    <q-inner-loading :showing="isLoading">
      <q-spinner-puff size="50px" color="primary" />
    </q-inner-loading>
    <q-card-section v-if="items.length > 0 " class="q-py-sm q-px-sm relative-position">
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
        <q-virtual-scroll
            style="max-height: 550px;"
            :virtual-scroll-item-size="52"
            :items="items"
            :virtual-scroll-slice-size="10"
            @virtual-scroll="onScroll"
            ref="virtualScrollRef"
          >
          <template v-slot:before>
            <div style="position: sticky; top: 0; z-index: 1;" class="bg-white">
              <div v-for="(winner, winnerIndex) in winners" :key="`winnerIndex${winnerIndex}`">
                <LeaderboardTableItem :item="winner" :index="winnerIndex"/>
              </div>
              <LeaderboardTableItem v-if="topUserShown" :item="userRow" :index="-1"/>
            </div>
          </template>
          <template v-slot="{ item: item, commonKey }">
            <div :style="(item.is_active) ? 'position: sticky; bottom: 0; top: 0; z-index: 1;' : ''">
              <LeaderboardTableItem :item="item" :index="commonKey"/>
              <div v-if="item.is_active" v-intersection="onIntersection" key="insersection"></div>
            </div>
          </template>
          <template v-slot:after>
            <div style="position: sticky; bottom: 0; z-index: 1;" class="bg-white">
              <LeaderboardTableItem v-if="bottomUserShown" :item="userRow" :index="-1"/>
            </div>
          </template>
        </q-virtual-scroll>
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
import LeaderboardTableItem from '../components/LeaderboardTableItem.vue'
import BannerNotFound from '../components/BannerNotFound.vue'
import { useExercise } from '../composables/useExercise.js'
import { api } from '../services/index'

const { getLeaderboard } = useExercise()

const userRowIndex = ref(0)

const isLoading = ref(false)

const props = defineProps({
  allowedFilters: Array,
  lessonId: String,
  challengeId: String,
  timePeriod: String
})

const bottomUserShown = ref(false)
const topUserShown = ref(false)

// --- Начальные константы и данные ---
const pageSize = 18;        // Изначальный размер порции данных
const halfPage = Math.floor(pageSize / 2); // 9
const totalItemsCount = 1000; // Общее количество элементов на сервере (если известно)

// Параметры для первого запроса, которые инициируют поиск пользователя
const initialStartFilter = 0;
const initialEndFilter = 0;

const virtualIndex = ref(0);

const items = ref([]);
const winners = ref([]);
const userRow = ref({});
const virtualScrollRef = ref(null);
const isLoadingInitial = ref(true); // Для блокировки интерфейса до первой загрузки

// --- Обновленное состояние для отслеживания границ загруженных данных по МЕСТАМ ---
const state = reactive({
  firstLoadedPlace: 0,
  lastLoadedPlace: 0,
  isLoading: false,
  hasMoreAbove: true,
  hasMoreBelow: true,
  direction: ''
});
// Загрузка начальных данных
const loadInitialData = async () => {
  state.isLoading = true;
  isLoadingInitial.value = true;

  // 1. Запрос с "нулевыми" фильтрами для поиска пользователя
  const filter = {
    mode: 'new',
    place_start: initialStartFilter,
    place_end: initialEndFilter
  };
  const leaderboardResponse = await api.exercise.getLeaderboard(filter)
  winners.value = leaderboardResponse.head.winners
  userRow.value = leaderboardResponse.head.user_row

  const initialData = leaderboardResponse.body;
  items.value = initialData;
  state.isLoading = false;

  if (initialData.length > 0) {
    userRowIndex.value = initialData.findIndex(item => item.is_active);

    state.firstLoadedPlace = initialData[0].place;
    state.lastLoadedPlace = initialData[initialData.length - 1].place;

    if (state.firstLoadedPlace === 1) state.hasMoreAbove = false;
    if (state.lastLoadedPlace === totalItemsCount || initialData.length < pageSize && state.firstLoadedPlace !== 1) {
      state.hasMoreBelow = false;
    }
  } else {
    state.hasMoreAbove = false;
    state.hasMoreBelow = false;
  }

  isLoadingInitial.value = false;
};

// --- Подгрузка ВВЕРХ (к меньшим местам) ---
const loadMoreAbove = async () => {
  if (state.isLoading || !state.hasMoreAbove) return;

  // Рассчитываем диапазон мест для подгрузки ВВЕРХ
  const placeEnd = state.firstLoadedPlace - 1;
  // Новое начало порции. Лимит остается pageSize.
  const placeStart = Math.max(1, placeEnd - pageSize + 1);

  if (placeStart < state.firstLoadedPlace) {
    state.isLoading = true;
    const actualLimit = placeEnd - placeStart*1 + 1; // Фактический лимит

    if (actualLimit > 0) {
      const filter = {
        mode: 'new',
        place_start: placeStart,
        place_end: placeEnd
      };

      const leaderboardResponse = await api.exercise.getLeaderboard(filter)
      const newItems = leaderboardResponse.body;

      if (newItems.length > 0) {
        // --- КОРРЕКЦИЯ СКРОЛЛА: ДО ИЗМЕНЕНИЯ МАССИВА ---
        let currentScrollTop = 0;
        if (virtualScrollRef.value && virtualScrollRef.value.$el) {
            // Получаем текущую позицию скролла через нативный DOM
            currentScrollTop = virtualScrollRef.value.$el.scrollTop;
        }
        // Добавляем новые данные в начало
        items.value.unshift(...newItems);
        state.firstLoadedPlace = newItems[0].place;

        // Рассчитываем новую позицию: старая позиция + высота добавленных элементов
        const addedHeight = newItems.length * 52; // Предполагаемая высота 50px
        const newScrollTop = currentScrollTop + addedHeight;

        // Корректируем позицию скролла с помощью setScrollPosition
        if (virtualScrollRef.value) {
          virtualScrollRef.value.$el.scrollTo({top:newScrollTop})
        }
        // --------------------------------------------------

        if (state.firstLoadedPlace === 1) state.hasMoreAbove = false;
      } else {
          state.hasMoreAbove = false;
      }
    }
    state.isLoading = false;
  }
};

// --- Подгрузка ВНИЗ (к большим местам) ---
const loadMoreBelow = async () => {

  if (state.isLoading || !state.hasMoreBelow) return;

  // Рассчитываем диапазон мест для подгрузки ВНИЗ
  const placeStart = state.lastLoadedPlace*1 + 1;
  const placeEnd = Math.min(totalItemsCount, placeStart + pageSize - 1);

  if (placeStart <= placeEnd) {
    state.isLoading = true;

    const filter = {
      mode: 'new',
      place_start: placeStart,
      place_end: placeEnd
    };

    const leaderboardResponse = await api.exercise.getLeaderboard(filter)
    const newItems = leaderboardResponse.body;

    if (newItems.length > 0) {
      items.value.push(...newItems);
      state.lastLoadedPlace = newItems[newItems.length - 1].place; // Обновляем последнее загруженное место

      // Проверяем, достигнут ли конец:
      if (state.lastLoadedPlace >= totalItemsCount || newItems.length < pageSize) {
        state.hasMoreBelow = false;
      }
    } else {
      state.hasMoreBelow = false;
    }

    state.isLoading = false;
  } else {
      state.hasMoreBelow = false;
  }
};

// Обработчик события скролла от QVirtualScroll (ОСТАЕТСЯ ПРЕЖНИМ)
const onScroll = ({ index, direction, ref }) => {
  const threshold = halfPage; // 9 элементов
  virtualIndex.value = index
  state.direction = direction
  // Подгрузка вниз (к концу списка)
  if (direction === 'increase' && index >= items.value.length - threshold && state.hasMoreBelow) {
    loadMoreBelow();
  }
  // Подгрузка вверх (к началу списка)
  if (direction === 'decrease' && index < threshold && state.hasMoreAbove) {
    loadMoreAbove();
  }
};

const onIntersection = (entry) => {
  console.log(entry)
  if(entry.isIntersecting){
    topUserShown.value = false
    bottomUserShown.value = false
  } else {
    if(state.direction == 'increase'){
      topUserShown.value = true
      bottomUserShown.value = false
    }
    if(state.direction == 'decrease'){
      topUserShown.value = false
      bottomUserShown.value = true
    }
  }
};

onMounted(async () => {
  await loadInitialData();
    if(virtualScrollRef.value){
      //virtualScrollRef.value.scrollTo(userRowIndex.value)
    }
});

// onActivated для скролла к элементу пользователя
onActivated(async () => {

  // Ждем, пока загрузка закончится, и скроллим к элементу пользователя

});
</script>
