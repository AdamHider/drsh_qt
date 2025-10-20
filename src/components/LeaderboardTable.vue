<template>
  <q-card flat style="min-height:300px">
    <q-inner-loading :showing="isLoading">
      <q-spinner-puff size="50px" color="primary" />
    </q-inner-loading>
    <q-card-section class="q-py-sm text-left">
      <div v-for="(winner, commonKey) in leaderboardData.head" :key="commonKey"  :class="`q-my-sm text-left rounded-sm ${(row.is_active == 1) ? ' bg-gradient-primary text-white' : 'text-dark'}`">
        <LeaderboardTableItem :item="winner" />
      </div>
    </q-card-section>
    <q-card-section class="q-py-sm text-left">
      <LeaderboardFilter
        :allowed-filters="props.allowedFilters"
        :timePeriod="props.timePeriod"
        @update-filter="updateFilter($event)"
      />
    </q-card-section>
    <q-card-section v-if="leaderboardData.data.length > 0 " class="q-py-sm q-px-sm relative-position">
      <q-list  >
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
        <div v-for="(row, commonKey) in leaderboardData.data" :key="commonKey" :class="`q-my-sm text-left rounded-sm ${(row.is_active == 1) ? ' bg-gradient-primary text-white' : 'text-dark'}`">
          <LeaderboardTableItem :item="row" />
        </div>
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
import { onActivated, onMounted, ref, reactive, nextTick } from 'vue'
import LeaderboardFilter from '../components/LeaderboardFilter.vue'
import BannerNotFound from '../components/BannerNotFound.vue'
import { useExercise } from '../composables/useExercise.js'
import LeaderboardTableItem from '../components/LeaderboardTableItem.vue'

const { getLeaderboard } = useExercise()

const leaderboardData = reactive({
  filter: {
    time_period: 'all'
  },
  data: {},
  head: {}
})
const isLoading = ref(false)


const props = defineProps({
  allowedFilters: Array,
  lessonId: String,
  challengeId: String,
  timePeriod: String
})

const loadTable = async () => {
  isLoading.value = true
  const filter = prepareFilter()
  const leaderboardResponse = await getLeaderboard(filter)
  leaderboardData.data = leaderboardResponse.body
  leaderboardData.head = leaderboardResponse.head

  isLoading.value = false
}

const prepareFilter = () => {
  if (props.lessonId) leaderboardData.filter.lesson_id = props.lessonId
  if (props.timePeriod) leaderboardData.filter.time_period = props.timePeriod
  leaderboardData.filter.mode = 'new'
  return leaderboardData.filter
}

const updateFilter = (filter) => {
  leaderboardData.filter = filter
  loadTable()
}

onActivated(async () => {
  await loadTable();
  await nextTick();
  if(document.querySelector('#userRowAnchor')){
    document.querySelector('#userRowAnchor').scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
  }
})
</script>
