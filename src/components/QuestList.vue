<template>
  <div>
  <q-infinite-list
    :reloadTrigger="reloadTrigger"
    :loadMore="loadMore"
    @onLoaded="onLoaded"
  >
    <q-card  v-for="(questItem, index) in quests" :key="index" class="q-ma-sm cursor-pointer">
      <q-card-section >
        <q-item class="q-pa-none">
            <q-item-section class="text-left"   @click="router.push(`/quest-${questItem.id}`)">
                <q-item-section class=" text-left">
                    <div class="flex items-center">
                      <q-avatar color="primary" text-color="white" size="40px" icon="task"></q-avatar>
                      <div class="col q-ml-md">
                        <q-item-label><b>{{ questItem.goal.title }}</b></q-item-label>
                        <q-item-label caption lines="2">{{ questItem.title }}</q-item-label>
                      </div>
                    </div>
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
            <q-item-section side v-if="(questItem.reward) && !questItem.is_rewarded && !questItem.is_outdated">
              <div class="full-width text-center">
                <b>Rewards</b>
              </div>
              <q-btn color="primary" :disable="!questItem.is_completed || questItem.is_rewarded"  @click="claimReward(questItem.id)">
                <q-chip  v-if="questItem.reward.gems"  color="transparent" class="q-pa-none" text-color="white" icon="diamond"><b>{{ questItem.reward.gems }}</b></q-chip>
                <q-chip  v-if="questItem.reward.credits" color="transparent" class="q-pa-none" text-color="white" icon="payment"><b>{{ questItem.reward.credits }}</b></q-chip>
                <q-chip  v-if="questItem.reward.experience" color="transparent" class="q-pa-none" text-color="white" icon="expand_less"><b>{{ questItem.reward.experience }}</b></q-chip>
              </q-btn>
            </q-item-section>
        </q-item>
        </q-card-section >
    </q-card >
  </q-infinite-list>
    <q-dialog v-model="claimDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-center" style="width: 300px">
        <q-card-section>
          <div v-if="!claimError" class="text-h6">Your reward</div>
          <div v-else class="text-h6">Ooops...</div>
        </q-card-section>
        <q-card-section v-if="!claimError">
          <div>
            <div v-if="claimRewards.gems">
              <q-avatar font-size="40px" color="transparent" text-color="purple" icon="diamond" />
              <div class="text-subtitle1 text-purple"><b>{{ claimRewards.gems }} gems</b></div>
            </div>
            <div v-if="claimRewards.credits">
              <q-avatar font-size="40px" color="transparent" text-color="positive" icon="payment" />
              <div class="text-subtitle1 text-positive"><b>{{ claimRewards.credits }} credits</b></div>
            </div>
            <div v-if="claimRewards.experience">
              <q-avatar font-size="40px" color="transparent" text-color="blue" icon="expand_less" />
              <div class="text-subtitle1 text-blue"><b>{{ claimRewards.experience }} extra XP</b></div>
            </div>
          </div>
        </q-card-section>
        <q-card-section v-else>
          Something went wrong.
        </q-card-section>
        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn class="full-width" label="Okay" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { api } from '../services/index'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'

const route = useRoute()
const router = useRouter()
const claimDialog = ref(false)
const claimRewards = ref({})
const claimError = ref(false)
const reloadTrigger = ref(false)
const quests = ref([])
const error = ref({})

const props = defineProps({
  classroomId: String,
  mode: String,
  activeOnly: Boolean
})

const loadMore = async function (filter) {
  const questListResponse = await api.quest.getList({ ...filter, ...{ classroom_id: props.classroomId, mode: props.mode, active_only: props.activeOnly } })
  if (questListResponse.error) {
    error.value = questListResponse
    return []
  }
  return questListResponse
}
const onLoaded = function (response) {
  quests.value = response
}
const claimReward = async function (questId) {
  const questRewardResponse = await api.quest.claimReward({ quest_id: questId })
  reloadTrigger.value = !reloadTrigger.value
  claimDialog.value = true
  claimError.value = false
  if (questRewardResponse.error) {
    claimError.value = true
    claimRewards.value = false
  } else {
    claimRewards.value = questRewardResponse.reward
  }
}
onBeforeRouteLeave((to, from) => {
  if (claimDialog.value) {
    claimDialog.value = false
    return false
  }
  return true
})
onMounted(() => {
  console.log('MOUNTED LIST')
})

</script>
