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

        <div
            ref="virtualScrollRef"
            class="scroll position-relative"
          >
            <transition
              appear
              enter-active-class="animated slideInDown"
              leave-active-class="animated slideOutUp">
              <q-page-sticky position="top" expand :offset="[0, 0]" style="z-index: 1">
                <div class="full-width q-px-sm">
                  <div v-for="(winner, winnersIndex) in winners" :key="`winnersIndex${winnersIndex}`">
                    <LeaderboardTableItem :item="winner" />
                  </div>
                </div>
                <div class="full-width q-pa-sm"  v-if="!state.userIsVisible && state.userIsAbove">
                  <LeaderboardTableItem :item="userRow"/>
                </div>
              </q-page-sticky>
            </transition>
            <div  v-for="(item, index) in items" :key="`itemIndex${index}`">
               <span v-if="item.is_active" v-intersection="onIntersection" ref="userRowAnchor" id="userRowAnchor"></span>
              <LeaderboardTableItem :item="item" />
            </div>
            <transition
              appear
              enter-active-class="animated slideInUp"
              leave-active-class="animated slideOutDown">
              <q-page-sticky position="bottom" expand :offset="[0, 50]" class="full-width" v-if="!state.userIsVisible && state.userIsBelow" style="z-index: 1">
                <div class="full-width q-pa-sm">
                  <LeaderboardTableItem :item="userRow"/>
                </div>
              </q-page-sticky>
            </transition>
        </div>
    </q-card-section>
    <q-card-section v-else class="q-pa-none">
      <BannerNotFound
        title="Упс..."
        description="Пока показать нечего"
        default-image
      />
    </q-card-section>
  </q-card>
  <q-scroll-observer @scroll="onScroll" />
</template>

<script setup>
import { onActivated, onMounted, ref, reactive, watch, nextTick } from 'vue'
import LeaderboardTableItem from '../components/LeaderboardTableItem.vue'
import BannerNotFound from '../components/BannerNotFound.vue'
import { useExercise } from '../composables/useExercise.js'
import { api } from '../services/index'

const { getLeaderboard } = useExercise()

const userRowAnchor = ref({})

const isLoading = ref(false)

const props = defineProps({
  allowedFilters: Array,
  lessonId: String,
  challengeId: String,
  timePeriod: String
})

// --- Начальные константы и данные ---
const pageSize = 20;        // Изначальный размер порции данных
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
  direction: '',
  userIsAbove: false,
  userIsBelow: false,
  userIsVisible: true
});
// Загрузка начальных данных
const load = async () => {
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

  isLoadingInitial.value = false;
};

// Обработчик события скролла от QVirtualScroll (ОСТАЕТСЯ ПРЕЖНИМ)
const onScroll = (event) => {
  state.direction = event.direction
  const topOffset = userRowAnchor.value[0].getBoundingClientRect().top
  const bottomOffset = window.innerHeight- userRowAnchor.value[0].getBoundingClientRect().bottom
  if(topOffset > 170 && bottomOffset > 0){
    state.userIsVisible = true
  } else {
    state.userIsVisible = false
  }
};

const onIntersection = (entry) => {

};

onMounted(async () => {
  await load();
  await nextTick();
  if(document.querySelector('#userRowAnchor')){
    document.querySelector('#userRowAnchor').scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
  }
});

onActivated(async () => {

});

watch(() => state.userIsVisible, () => {
  if(!state.userIsVisible){
    if(state.direction == 'down'){
      state.userIsAbove = true
      state.userIsBelow = false
      console.log('userIsAbove')
    } else {
      state.userIsBelow = true
      state.userIsAbove = false
      console.log('userIsBelow')
    }
  } 
})
</script>
<style scoped>
.item-sticky-top{
  position: sticky;
  top: 0;
  z-index: 1;
}
.item-sticky-bottom{
  position: sticky;
  bottom: 0;
  z-index: 1;
}

</style>
