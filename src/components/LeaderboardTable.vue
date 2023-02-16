<template>
  <q-card  flat>
    <q-card-section class="q-py-none flex justify-between items-center text-left">
      <div class="text-h6">Leaderboard</div>
      <q-icon
        v-if="props.allowedFilters.length > 0"
        @click="filterExpanded = !filterExpanded"
        size="sm"
        color="gray"
        :name="(filterExpanded) ? 'filter_alt_off' : 'filter_alt'"
      ></q-icon>
    </q-card-section>
    <q-card-section v-if="filterExpanded" class="q-py-sm text-left">
      <LeaderboardFilter
        :allowed-filters="props.allowedFilters"
        :byClassroom="props.byClassroom"
        :timePeriod="props.timePeriod"
        @update-filter="updateFilter($event)"
      />
    </q-card-section>
    <q-card-section v-if="leaderboardData.data.length > 0" class="q-py-sm relative-position">
      <q-inner-loading :showing="isLoading"/>
      <q-list separator >
        <q-item v-for="(commonItem, commonKey) in leaderboardData.data" :key="commonKey" :active="commonItem.is_active" class="q-my-sm q-px-none text-left"  >
            <q-item-section avatar class="text-center">
                  <div class="text-h6"><b>{{ commonItem.place }}</b></div>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                  <q-chip v-for="(userData, userKey) in commonItem.data" :key="userKey"
                    color="white"
                    :text-color="(userData.is_active == 1) ? 'primary' : ''"
                    :title="userData.username"
                  >
                  <b >{{ userData.username }}</b>
                </q-chip>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="text-subtitle"><b>{{ commonItem.points }}</b></div>
            </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onActivated, onMounted, ref, reactive } from 'vue'
import LeaderboardFilter from '../components/LeaderboardFilter.vue'
import { useExercise } from '../composables/useExercise.js'

const { getLeaderboard } = useExercise()

const leaderboardData = reactive({
  filter: {
    by_classroom: false,
    time_period: 'all'
  },
  data: {}
})

const isLoading = ref(false)
const filterExpanded = ref(false)

const props = defineProps({
  allowedFilters: Array,
  byClassroom: Boolean,
  lessonId: String,
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
  if (props.lessonId) leaderboardData.filter.lesson_id = props.lessonId
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
onMounted(async () => {
  loadTable()
})

</script>
