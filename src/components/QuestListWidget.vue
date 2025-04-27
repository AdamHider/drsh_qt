<template>
  <div>
    <div class="flex column">
      <q-btn v-for="(questItem, index) in quests" :key="index" push dense
        @click="showQuest(questItem.id)"
        size="sm"
        :class="`bg-gradient-${questItem.group.color} text-white q-ma-sm cursor-pointer rounded-sm q-mt-sm ${(questItem.is_completed) ? ' q-btn-blinking' : ''}`" >
        <div style="width: 40px" >
          <img :src="questItem.group.image_avatar" height="45px" class="absolute-bottom q-ml-sm q-mb-xs">
        </div>
        <q-icon class="q-py-xs q-px-sm" name="chevron_right" size="24px"></q-icon>
        <q-badge v-if="!questItem.is_completed" floating color="warning" class="q-pa-xs">
          <q-icon name="priority_high" size="14px"></q-icon>
        </q-badge>
        <q-badge v-else floating color="positive" class="q-pa-xs">
          <q-icon name="done" size="14px"></q-icon>
        </q-badge>

      </q-btn>
    </div>
    <q-dialog v-model="claimDialog"  transition-show="scale" transition-hide="scale" @hide="reload()">
      <q-card class="bg-white text-center" style="width: 300px">
        <q-card-section class="q-pb-none">
          <div v-if="!claimError" class="text-h6"><b>Задание выполнено!</b></div>
          <div v-else class="text-h6"><b>Упс...</b></div>
        </q-card-section>
        <q-card-section>
          <div class="full-width q-pb-sm rounded-sm bg-grey-2">
            <div class="text-center text-subtitle2 q-pa-xs"><b>Награда: </b></div>
            <div class="row q-gutter-sm items-center justify-center">
              <div v-for="(resource, resourceIndex) in activeQuest.reward" :key="`resource-${resourceIndex}`" >
                  <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn class="full-width" push label="Отлично" color="positive" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="activeQuestDialog" maximized persistent backdrop-filter="blur(4px)">
      <QuestItem
        :quest="activeQuest"
        :mode="(activeQuest.is_completed) ? 'finish' : (activeQuest.status == 'created') ? 'start' : 'active'"
        :expanded="activeQuest.status == 'active' && !activeQuest.is_completed"
        @onStart="startQuest(activeQuest.id)"
        @onClaim="claimReward(activeQuest.id)"
        @onClose="activeQuestDialog = false"/>
    </q-dialog>
  </div>
</template>

<script setup>
import { api } from '../services/index'
import { ref, onMounted, onActivated } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import UserResourceBar from '../components/UserResourceBar.vue'
import QuestItem from '../components/QuestItem.vue'



const error = ref(false)
const claimDialog = ref(false)
const claimError = ref(false)
const reloadTrigger = ref(false)
const quests = ref([])

const createdQuests = ref([])
const createdQuestDialog = ref(false)

const activeQuest = ref({})
const activeQuestMode = ref('created')
const activeQuestDialog = ref(false)

const finishedQuestDialog = ref(false)

const props = defineProps({
  activeOnly: Boolean
})

const load = async () => {
  const questListResponse = await api.quest.getList({ mode: props.mode, active_only: props.activeOnly })
  if (questListResponse.error) {
    error.value = questListResponse
    quests.value = []
    return false;
  }
  quests.value = questListResponse
}

const checkInactive = () => {
  createdQuests.value = quests.value.filter((quest) => { return quest.status == 'created' && quest.group.is_primary})
  if(createdQuests.value.length > 0){
    activeQuest.value = createdQuests.value[0]
    createdQuestDialog.value = true
  }
}

const startQuest = async (questId) => {
  const questStartedResponse = await api.quest.startItem({ quest_id: questId })
  if(questStartedResponse){
    await load()
    activeQuest.value = quests.value.find((quest) => { return quest.id == questId})
  }
}

const showQuest = (questId) => {
  const quest = quests.value.find((quest) => { return quest.id == questId});
  activeQuest.value =  quest
  if(!quest.is_completed){

  } else {
    finishedQuestDialog.value = true
  }
  activeQuestDialog.value = true
}
const claimReward = async (questId) => {
  const questRewardResponse = await api.quest.claimReward({ quest_id: questId })
  reloadTrigger.value = !reloadTrigger.value
  claimDialog.value = true
  activeQuestDialog.value = false
  claimError.value = false
  if (questRewardResponse.error) {
    claimError.value = true
  }
}

const reload = async () => {
  claimDialog.value = false
  activeQuestDialog.value = false
  activeQuest.value = {}
  load()
}

onBeforeRouteLeave((to, from) => {
  if (claimDialog.value) {
    return false
  }
  return true
})

onActivated(() => {
  load()
  checkInactive()
})

</script>
