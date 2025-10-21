<template>
    <q-card flat style="min-height:80vh" class="rounded-b-0 q-pb-md full-width">
      <q-card-section class="q-pb-sm q-pt-md text-left">
        <LeaderboardFilter
          :allowed-filters="props.allowedFilters"
          :timePeriod="props.timePeriod"
          @update-filter="updateFilter($event)"
        />
      </q-card-section>
      <q-card-section v-if="items.length > 0 " class="q-py-sm q-px-sm relative-position" style="height: 78vh">
        <q-list class="column full-height" >
          <q-item class="text-left text-bold text-grey-7" style="font-size: 12px">
            <q-item-section side>
              <q-item-label>Место</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>Герой</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>Прогресс и очки</q-item-label>
            </q-item-section>
          </q-item>
          <div v-for="(winner, winnerIndex) in winners" :key="`winnerIndex${winnerIndex}`">
            <LeaderboardTableItem :item="winner"/>
          </div>
          <q-virtual-scroll
            class="col"
            style="flex: 1 0 0%"
            :virtual-scroll-item-size="56"
            :items="items"
            @virtual-scroll="onScroll"
            ref="virtualScrollRef"
          >
            <template v-slot:before>
              <div style="position: sticky; top: 0; z-index: 1;" class="bg-white">
                <LeaderboardTableItem v-if="!state.userIsVisible && state.userIsAbove" :item="userRow" :index="-1"/>
              </div>
            </template>
            <template v-slot="{ item, index }">
              <div :style="(item.is_active) ? 'position: sticky; bottom: 0; top: 0; z-index: 1;' : ''" :index="index" :key="`itemIndex${index}`">
                <LeaderboardTableItem v-if="!item.is_border" :item="item" />
                <q-item v-else>
                  <q-item-section side>
                    <q-avatar size="28px" >
                    </q-avatar>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-avatar size="36px" color="grey-4" icon="groups">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section class="text-left">
                    <q-item-label><b>И ещё {{ item.count }}</b></q-item-label>
                    <q-item-label v-if="item.position == 'end'" caption>Ниже в рейтинге</q-item-label>
                    <q-item-label v-else caption>Выше в рейтинге</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </template>
            <template v-slot:after>
              <div style="position: sticky; bottom: 0; z-index: 1;" class="bg-white">
                <LeaderboardTableItem v-if="!state.userIsVisible && state.userIsBelow" :item="userRow" :index="-1"/>
              </div>
            </template>
          </q-virtual-scroll>
        </q-list>
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
import { onActivated, onMounted, watch, ref, reactive, nextTick } from 'vue'
import BannerNotFound from '../components/BannerNotFound.vue'
import LeaderboardFilter from '../components/LeaderboardFilter.vue'
import { useExercise } from '../composables/useExercise.js'
import LeaderboardTableItem from '../components/LeaderboardTableItem.vue'
import { api } from '../services/index'

const props = defineProps({
  allowedFilters: Array,
  lessonId: String,
  challengeId: String,
  timePeriod: String
})
const userRowIndex = ref(0)
const items = ref([]);
const winners = ref([]);
const virtualScrollRef = ref(null);
const isLoadingInitial = ref(true);
const userRow = ref({})
const filter = ref({})

const state = reactive({
  isLoading: false,
  userIsAbove: false,
  userIsBelow: false,
  userIsVisible: true
});

const loadInitialData = async () => {
  state.userIsAbove = false
  state.userIsBelow = false
  state.isLoading = true;
  isLoadingInitial.value = true;

  filter.value.mode = 'new'

  const initialData = await api.exercise.getLeaderboard(filter.value);
  items.value = initialData.body;
  userRow.value = initialData.head.user_row
  winners.value = initialData.head.winners
  state.isLoading = false;

  if (initialData.body.length > 0) {
    userRowIndex.value = initialData.body.findIndex(item => item.is_active);
  }
  isLoadingInitial.value = false;

  await nextTick();

  if(virtualScrollRef.value){
    virtualScrollRef.value.scrollTo(userRowIndex.value-6)
  }
};
const updateFilter = (filterObject) => {
  filter.value = filterObject
  loadInitialData()
}


const onScroll = ({ index, from, to, direction, ref }) => {
  state.direction = direction
  state.userIsVisible = false

  for(var i = from; i <= to; i++){
    if(items.value[i].is_active){
        state.userIsVisible = true
    }
  }

};
watch(() => state.userIsVisible, () => {
  if(!state.userIsVisible){
    if(state.direction == 'increase'){
      state.userIsAbove = true
      state.userIsBelow = false
    } else {
      state.userIsBelow = true
      state.userIsAbove = false
    }
  }
})
onActivated(async () => {
  await loadInitialData();
})
</script>
