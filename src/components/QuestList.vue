<template>
  <q-infinite-list
    :loadMore="loadMore"
    @onLoaded="onLoaded"
  >
    <q-card  v-for="(questItem, index) in quests" :key="index" class="q-ma-sm cursor-pointer" >
      <q-card-section >
        <q-item class="q-pa-none">
            <q-item-section avatar   @click="router.push(`/quest-${questItem.id}`)">
                <q-avatar size="60px">
                    <q-img
                      :src="questItem.image"
                      loading="lazy"
                      spinner-color="white"/>
                </q-avatar>
            </q-item-section>
            <q-item-section class="text-left"   @click="router.push(`/quest-${questItem.id}`)">
                <q-item-section class="text-left">
                    <q-item-label><b>{{ questItem.goal.title }}</b></q-item-label>
                    <q-item-label caption lines="2">{{ questItem.title }}</q-item-label>
                    <div class="row q-my-sm justify-between" >
                        <div class="coltext-left">
                          <q-chip
                                v-if="questItem.time_left_humanized"
                                dense
                                class="q-px-sm q-ma-none"
                                style="font-size: 13px"
                                :color="((questItem.time_left <= 3) ? 'red' : 'orange')"
                                icon="sports_score"
                                text-color="white">
                                <b>{{ questItem.time_left_humanized }}</b>
                            </q-chip>
                        </div>
                        <div class="col text-right" v-if="!questItem.date_end || questItem.time_left > 0">
                            <b>{{questItem.progress.percentage_text}}</b>
                        </div>
                    </div>
                    <q-linear-progress
                        v-if="!questItem.date_end || questItem.time_left > 0"
                        :color="(questItem.progress.percentage/100) >= 1 ? 'positive' : 'primary'"
                        :value="(questItem.progress.percentage/100)"
                        size="12px"
                        rounded
                    ></q-linear-progress>
                </q-item-section>
            </q-item-section>
            <q-item-section side v-if="questItem.reward && questItem.is_completed">
              <div class="full-width text-center">
                Reward:
                <div>
                  <q-chip  v-if="questItem.reward.gems" color="transparent" class="q-mt-none" text-color="purple" icon="diamond"><b>{{ questItem.reward.gems }}</b></q-chip>
                  <q-chip  v-if="questItem.reward.credits" color="transparent" text-color="positive" icon="payment"><b>{{ questItem.reward.credits }}</b></q-chip>
                  <q-chip  v-if="questItem.reward.experience" color="transparent" text-color="blue" icon="expand_less"><b>{{ questItem.reward.experience }}</b></q-chip>
                </div>
              </div>
              <q-btn push color="primary">Claim</q-btn>
            </q-item-section>
        </q-item>
        </q-card-section >
    </q-card >
  </q-infinite-list>
</template>

<script setup>
import { api } from '../services/index'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const quests = ref([])
const error = ref({})

const props = defineProps({
  classroomId: String,
  mode: String
})

const loadMore = async function (filter) {
  const questListResponse = await api.quest.getList({ ...filter, ...{ classroom_id: props.classroomId, mode: props.mode } })
  if (questListResponse.error) {
    error.value = questListResponse
    return []
  }
  return questListResponse
}
const onLoaded = function (response) {
  quests.value = response
}

</script>
