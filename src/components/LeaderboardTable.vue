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
        <q-item v-for="(row, commonKey) in leaderboardData.data" :key="commonKey" :active="row.is_active == 1" :class="`q-my-sm text-left rounded-sm ${(row.is_active == 1) ? ' bg-gradient-primary text-white' : 'text-dark'}`">
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
  leaderboardData.data = leaderboardResponse

  isLoading.value = false
}

const prepareFilter = () => {
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
</script>
