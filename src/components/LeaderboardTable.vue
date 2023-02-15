<template>
  <q-card  flat>
    <q-card-section class="q-py-none flex justify-between items-center">
      <div class="text-h6">Leaderboard</div>
      <q-icon
        v-if="props.allowedFilters.length > 0"
        @click="filterExpanded = !filterExpanded"
        size="sm"
        color="gray"
        :name="(filterExpanded) ? 'filter_alt_off' : 'filter_alt'"
      ></q-icon>
    </q-card-section>
    <q-card-section v-if="filterExpanded" class="q-py-sm">
      <LeaderboardFilter
        :allowed-filters="props.allowedFilters"
        :byClassroom="props.byClassroom"
        :timePeriod="props.timePeriod"
        @update-filter="updateFilter($event)"
      />
    </q-card-section>
    <q-card-section v-if="leaderboardData.data.length > 0" class="q-py-sm relative-position">
      <q-inner-loading :showing="isLoading"/>
      <q-list >
        <q-item v-for="(commonItem, commonKey) in leaderboardData.data" :key="commonKey" class="q-my-sm q-px-none"  >
            <q-item-section avatar>
                <q-avatar rounded  color="primary" text-color="white" size="50px">
                    <q-icon name="star" color="blue-6" size="50px" class="absolute-top"/>
                    <b style="z-index: 1">{{ commonItem.points }}</b>
                </q-avatar>
            </q-item-section>
            <q-item-section>
                <q-item-label><b>{{ commonItem.place }} place</b></q-item-label>
                <q-item-label caption lines="1">{{ commonItem.usernames }}</q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-icon name="chat_bubble" color="green" />
            </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onActivated, ref, reactive } from 'vue'
import LeaderboardFilter from '../components/LeaderboardFilter.vue'
import { useExercise } from '../composables/useExercise.js'

const { getLeaderboard } = useExercise()

const leaderboardData = reactive({
  filter: {
    by_classroom: false,
    time_period: 'week'
  },
  data: {}
})

const isLoading = ref(false)
const filterExpanded = ref(false)

const props = defineProps({
  allowedFilters: Array,
  byClassroom: Boolean,
  timePeriod: String
})

const loadTable = async () => {
  const filter = prepareFilter()
  isLoading.value = true
  const leaderboardResponse = await getLeaderboard('table', filter)
  leaderboardData.data = leaderboardResponse
  isLoading.value = false
}

const prepareFilter = () => {
  if (props.byClassroom) leaderboardData.filter.by_classroom = props.byClassroom
  if (props.timePeriod) leaderboardData.filter.time_period = props.timePeriod
  return leaderboardData.filter
}

const updateFilter = (filter) => {
  leaderboardData.filter = filter
  loadTable()
}

onActivated(async () => {
  loadTable()
})

</script>
