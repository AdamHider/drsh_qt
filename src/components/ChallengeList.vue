<template>
  <q-infinite-list
    :loadMore="loadMore"
    @onLoaded="onLoaded"
  >
    <q-card  v-for="(challengeItem, index) in challenges" :key="index" class="q-ma-sm cursor-pointer"   @click="router.push(`challenge-${challengeItem.id}`)">
        <q-card-section class="text-left q-pa-none relative-position">
            <q-img
                class="rounded-t"
                :src="challengeItem.image"
                loading="lazy"
                spinner-color="white"
            >
              <div class="absolute-top full-height text-left text-white flex flex-center" v-if="challengeItem.progress.value > 0">
                <q-circular-progress
                  show-value
                  class="text-white text-bold q-ma-md"
                  :value="challengeItem.progress.percentage"
                  track-color="grey-5"
                  size="60px"
                  color="white"
                >
                {{ challengeItem.progress.percentage }}%
                </q-circular-progress>
              </div>
            </q-img>
            <div class="absolute-bottom transparent q-pa-none-important text-left">
              <q-chip
                  v-if="challengeItem.time_left_humanized && !challengeItem.is_finished"
                  dense
                  class="q-ma-sm"
                  style="font-size: 13px"
                  :color="((challengeItem.time_left <= 3) ? 'red' : 'orange')"
                  icon="sports_score"
                  text-color="white">
                  <b>{{ challengeItem.time_left_humanized }}</b>
              </q-chip>
              <q-chip
                  v-else-if="!challengeItem.is_finished"
                  dense
                  class="q-ma-sm"
                  style="font-size: 13px"
                  :color="'red'"
                  icon="sports_score"
                  text-color="white">
                  <b>Hurry up!</b>
              </q-chip>
              <q-chip
                  v-if="challengeItem.is_finished"
                  dense
                  class="q-ma-sm"
                  style="font-size: 13px"
                  icon="check"
                  color="positive"
                  text-color="white">
                  <b>Done</b>
              </q-chip>
            </div>
            <div class="absolute-bottom transparent q-pa-none-important text-right">
              <q-chip
                  v-if="challengeItem.value"
                  dense
                  class="q-ma-sm"
                  style="font-size: 13px"
                  icon="ads_click"
                  icon-right="star"
                  color="primary"
                  text-color="white">
                  <b>{{ challengeItem.value }}</b>
              </q-chip>
            </div>
        </q-card-section >
        <q-card-section  class="text-left">
            <div class="text-bold max-two-lines">{{challengeItem.title}}</div>
            <div class="text-caption text-grey max-one-lines" v-if="challengeItem.winner_left && challengeItem.winner_left > 0">Winners left: {{challengeItem.winner_left}}</div>
        </q-card-section>
    </q-card >
  </q-infinite-list>
</template>

<script setup>
import { api } from '../services/index'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const challenges = ref([])
const error = ref({})

const props = defineProps({
  classroomId: String,
  mode: String
})

const loadMore = async function (filter) {
  const challengeListResponse = await api.challenge.getList({ ...filter, ...{ classroom_id: props.classroomId, mode: props.mode } })
  if (challengeListResponse.error) {
    error.value = challengeListResponse
    return []
  }
  return challengeListResponse
}
const onLoaded = function (response) {
  challenges.value = response
}

</script>
