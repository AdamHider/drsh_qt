<template>
  <div>
  <q-infinite-list
    :reloadTrigger="reloadTrigger"
    :loadMore="loadMore"
    @onLoaded="onLoaded"
  >
    <q-card  v-for="(questItem, index) in quests" :key="index" class="q-ma-sm cursor-pointer q-mt-md">
      <q-item :class="`bg-gradient-${questItem.group.color} text-white`">
        <q-item-section avatar>
            <img :src="questItem.group.image" width="50px" class="absolute-bottom q-mx-sm">
        </q-item-section>

        <q-item-section>
            <q-item-label><b>{{ questItem.group.title }}</b></q-item-label>
            <q-item-label class="text-white" caption lines="2">{{ questItem.group.description }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />
      <q-card-section class="q-pa-sm q-pb-md">
        <q-item class="q-pa-none">
          <q-item-section class="text-left">
            <div class="row q-my-sm justify-between items-end" >
              <div>
                <q-item-label><b>{{ questItem.title }}</b></q-item-label>
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
              <div class="col text-right">
                  <b>{{questItem.progress.percentage_text}}</b>
              </div>
            </div>
            <q-linear-progress
                :color="(questItem.progress.percentage/100) >= 1 ? 'positive' : 'primary'"
                :value="(questItem.progress.percentage/100)"
                size="12px"
                rounded
            ></q-linear-progress>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator/>
      <q-card-section class="q-pa-sm">
        <div class=" text-left q-px-sm">
          <b>Rewards</b>
        </div>
        <div class="row justify-between items-center q-gutter-sm">
          <div>
            <div class="flex justify-center q-gutter-sm ">
              <div v-for="(resource, resourceIndex) in questItem.reward" :key="resourceIndex" >
                <q-item class="bg-grey-3 text-left rounded-borders" >
                    <q-item-section avatar>
                        <q-img width="28px" :src="resource.image" style="filter: hue-rotate(0deg) drop-shadow(1px 3px 3px #00000075)"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label><b>{{resource.quantity}}</b></q-item-label>
                    </q-item-section>
                </q-item>
              </div>
            </div>
          </div>
          <div>
            <q-btn v-if="questItem.is_completed" color="positive" label="Claim" @click="claimReward(questItem.id)"/>
            <q-btn v-else-if="questItem.href" color="primary" icon="chevron_right" :to="`${questItem.href}`"/>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-infinite-list>
    <q-dialog v-model="claimDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-center" style="width: 300px">
        <q-card-section>
          <div v-if="!claimError" class="text-h6">Your reward</div>
          <div v-else class="text-h6">Ooops...</div>
        </q-card-section>
        <q-card-section v-if="!claimError">
            <div class="row justify-center q-gutter-sm q-py-sm">
              <div v-for="(resource, resourceIndex) in claimRewards" :key="resourceIndex" >
                <q-item :class="`bg-grey-3 text-left rounded-borders`" >
                    <q-item-section avatar>
                        <q-img width="28px" :src="resource.image" style="filter: hue-rotate(0deg) drop-shadow(1px 3px 3px #00000075 );;"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label><b>{{resource.quantity}}</b></q-item-label>
                    </q-item-section>
                </q-item>
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
import { useNavigationHistory } from '../composables/useNavigationHistory'

const { routes } = useNavigationHistory()

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
  const dataHash = api.lastRequestDataHash
  if(dataHash !== routes.quests.hash && routes.quests.hash !== ''){
    routes.quests.hash = dataHash
    routes.quests.is_updated = true
  } else {
    routes.quests.is_updated = false
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
    claimRewards.value = questRewardResponse
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
