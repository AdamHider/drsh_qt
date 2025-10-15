<template>
  <div>
    <div class="flex column">
      <TransitionGroup
        appear
        :enter-active-class="`animated fadeInLeft`"
        :leave-active-class="`animated fadeOutLeft`">
      <q-btn v-for="(questItem, index) in quest.list" :key="index" push dense
        @click="showQuest(questItem.id)" @click.stop="playAudio('click')"
        size="sm"
        :class="`bg-gradient-${questItem.group.color} text-white q-ma-sm cursor-pointer rounded-sm q-mt-sm ${(questItem.is_completed || questItem.status == 'created') ? ' q-btn-blinking q-btn-shaking' : ''}`" >
          <div style="width: 40px" >
            <img :src="questItem.group.image_avatar" height="45px" class="absolute-bottom q-ml-sm q-mb-xs">
          </div>
          <q-icon class="q-py-xs q-px-sm" name="chevron_right" size="24px"></q-icon>
          <q-badge v-if="!questItem.is_completed" floating color="warning" class="q-pa-xs" style="box-shadow: inset 0px 0px 0px 2px #ffffff82;">
            <q-icon name="priority_high" size="14px"></q-icon>
          </q-badge>
          <q-badge v-else-if="questItem.is_completed" floating color="positive" class="q-pa-xs"  style="box-shadow: inset 0px 0px 0px 2px #ffffff82;">
            <q-icon name="done" size="14px"></q-icon>
          </q-badge>
          <div v-if="questItem.time_left > 0">
            <div  class="absolute text-center q-ma-none full-width" style="left: 0; bottom: -18px;">
              <q-chip  dense size="10px" text-color="white" color="dark" class="q-ma-none"
                :style="`max-width: none;`">
                <span v-if="questItem.time_left > 0"><b>{{ questItem.counter?.hours }}:{{ questItem.counter?.minutes }}:{{ questItem.counter?.seconds }}</b></span>
              </q-chip>
            </div>
          </div>
      </q-btn>
      </TransitionGroup>
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
        <q-card-actions align="center" class="bg-white q-px-md q-pb-md text-teal">
          <q-btn class="full-width" push label="Отлично" color="positive" v-close-popup @click.stop="playAudio('click')"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="activeQuestDialog" transition-show="fade" transition-hide="fade" maximized persistent backdrop-filter="blur(4px)">
      <QuestItem v-if="activeQuest"
        :quest="activeQuest"
        :mode="(activeQuest.is_completed && activeQuest.status == 'active') ? 'finish' : (activeQuest.status == 'created') ? 'start' : 'active'"
        :expanded="activeQuest.status == 'active' && !activeQuest.is_completed"
        @onStart="startQuest(activeQuest.id)"
        @onClaim="claimReward(activeQuest.id)"
        @onClose="activeQuestDialog = false"/>
    </q-dialog>
  </div>
</template>

<script setup>
import { api } from '../services/index'
import { ref, onMounted, onActivated, onDeactivated } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import UserResourceBar from '../components/UserResourceBar.vue'
import QuestItem from '../components/QuestItem.vue'
import { useQuest } from '../composables/useQuest'
import { playAudio } from 'src/services/audioService';


const { getList, quest, claimItem, startItem } = useQuest()

const error = ref(false)
const claimDialog = ref(false)
const claimError = ref(false)
const reloadTrigger = ref(false)

const activeCountdown = ref(false)

const activeQuest = ref({})
const activeQuestDialog = ref(false)

const props = defineProps({
  activeOnly: Boolean
})
const emits = defineEmits(['onStart', 'onClaim'])


const checkInactive = () => {
  let inactiveQuest = quest.list.find((quest) => { return quest.status == 'active' && quest.is_completed && quest.group.is_primary})
  if(!inactiveQuest) inactiveQuest = quest.list.find((quest) => { return quest.status == 'created' && quest.group.is_primary})
  if(inactiveQuest){
    activeQuest.value = inactiveQuest
    setTimeout(() => {
      activeQuestDialog.value = true
    }, 500)
    
  }
}

const startQuest = async (questId) => {
  const started = await startItem(questId)
  if(started){
    await getList(props.active_only)
    activeQuest.value = quest.list.find((quest) => { return quest.id == questId})
    activeQuestDialog.value = false
    emits('onStart')
  }
}

const showQuest = (questId) => {
  activeQuest.value =  quest.list.find((quest) => { return quest.id == questId});
  activeQuestDialog.value = true
}

const claimReward = async (questId) => {
  const questRewardResponse = claimItem(questId)
  reloadTrigger.value = !reloadTrigger.value
  claimDialog.value = true
  activeQuestDialog.value = false
  claimError.value = false
  if (questRewardResponse.error) {
    claimError.value = true
  }
  emits('onClaim')
}

const countdown = () => {
  var has_counters = false
  setTimeout(async () => {
    if(!activeCountdown.value) return
    for(var i in quest.list){
      if(quest.list[i].time_left && quest.list[i].time_left > 0){
        quest.list[i].time_left--;
        quest.list[i].counter = timeLeftHumanize(quest.list[i].time_left)
        has_counters = true
      }
    }
    if(has_counters){
      countdown()
    }
  }, 1000)
}

const calculateTimeLeft = () => {
  for(var i in quest.value){
    if(quest.value[i].time_left){
      quest.value[i].counter = timeLeftHumanize(quest.value[i].time_left)
    }
  }
}

const timeLeftHumanize = (totalSeconds) => {
    var counter = {}
    counter.hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    counter.minutes = Math.floor(totalSeconds / 60);
    counter.seconds = totalSeconds % 60;

    if(counter.hours < 10) counter.hours = '0'+counter.hours
    if(counter.minutes < 10) counter.minutes = '0'+counter.minutes
    if(counter.seconds < 10) counter.seconds = '0'+counter.seconds
    return counter;
}

const reload = async () => {
  claimDialog.value = false
  activeQuestDialog.value = false
  activeQuest.value = {}
  await getList(props.active_only)
  checkInactive()
}

onBeforeRouteLeave((to, from) => {
  if (claimDialog.value) {
    claimDialog.value = false
    return false
  }
  if (activeQuestDialog.value) {
    activeQuestDialog.value = false
    return false
  }
  return true
})

onActivated(async () => {
  await getList(props.active_only)
  checkInactive()
  calculateTimeLeft()
  if(!activeCountdown.value) activeCountdown.value = true
  countdown()
})
onDeactivated(() => {
  activeCountdown.value = false
})

</script>
