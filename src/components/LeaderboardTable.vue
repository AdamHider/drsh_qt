<template>
  <q-card flat >
    <q-card-section class="q-py-none flex justify-between items-center text-left">
      <div class="text-h6">Leaderboard</div>
      <q-icon
        v-if="props.allowedFilters && props.allowedFilters.length > 0"
        @click="filterExpanded = !filterExpanded"
        size="sm"
        color="gray"
        :name="(filterExpanded) ? 'filter_alt_off' : 'filter_alt'"
      ></q-icon>
    </q-card-section>
    <q-card-section v-if="filterExpanded" class="q-py-sm text-left">
      <LeaderboardFilter
        :allowed-filters="props.allowedFilters"
        :classroomId="props.classroomId"
        :timePeriod="props.timePeriod"
        @update-filter="updateFilter($event)"
      />
    </q-card-section>
    <q-card-section v-if="leaderboardData.data.length > 0" class="q-py-sm relative-position">
      <q-inner-loading :showing="isLoading"/>
      <q-list separator >
        <q-item v-for="(commonItem, commonKey) in leaderboardData.data" :key="commonKey" :active="commonItem.is_active" class="q-my-sm q-px-none text-left">
            <q-item-section avatar class="text-center">
              <q-avatar size="40px"
                :color="(commonItem.is_winner) ? 'orange' : 'white'"
                :text-color="(commonItem.is_winner) ? 'white' : 'dark'"
                >
                <b>{{ commonItem.place }}</b>
              </q-avatar>
            </q-item-section>

            <q-item-section avatar>
              <div class="q-gutter-sm">
                <q-avatar
                    v-for="(userData, userKey) in commonItem.data.slice(0, 2)" :key="userKey"
                    size="40px"
                    class="overlapping"
                    :style="`left: -${userKey * 15}px`"
                  >
                    <img :src="userData.avatar">
                </q-avatar>
              </div>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <span v-for="(userData, userKey) in commonItem.data.slice(0, 2)" :key="userKey" class="q-pa-none text-dark">
                  <b :class="(userData.is_active == 1) ? 'text-primary' : 'text-dark'">{{ userData.username }}</b>
                  <b v-if="commonItem.data.slice(0, 2)[userKey+1]">, </b>
                </span>
                <span v-if="commonItem.data.length > 2" class="text-dark">
                  <b> and {{commonItem.data.length - 2}} more</b>
                </span>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="text-subtitle"><b>{{ commonItem.points }}</b></div>
            </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section v-else class="q-pa-none">
      <BannerNotFound
        title="Ooops..."
        description="There is no available statistics"
        default-image
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onActivated, onMounted, ref, reactive, watch } from 'vue'
import LeaderboardFilter from '../components/LeaderboardFilter.vue'
import BannerNotFound from '../components/BannerNotFound.vue'
import { useExercise } from '../composables/useExercise.js'

const { getLeaderboard } = useExercise()

const leaderboardData = reactive({
  filter: {
    time_period: 'all'
  },
  data: {}
})

const isLoading = ref(false)
const filterExpanded = ref(false)

const props = defineProps({
  allowedFilters: Array,
  classroomId: String,
  lessonId: String,
  challengeId: String,
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
  if (props.classroomId) leaderboardData.filter.classroom_id = props.classroomId
  if (props.lessonId) leaderboardData.filter.lesson_id = props.lessonId
  if (props.challengeId) leaderboardData.filter.challenge_id = props.challengeId
  if (props.timePeriod) leaderboardData.filter.time_period = props.timePeriod
  return leaderboardData.filter
}

const updateFilter = (filter) => {
  leaderboardData.filter = filter
  loadTable()
}

onActivated(async () => {
  if (isLoading.value === true) return
  loadTable()
})
onMounted(async () => {
  if (isLoading.value === true) return
  loadTable()
})
watch(() => props.classroomId, async (newData, oldData) => {
  loadTable()
})

</script>
