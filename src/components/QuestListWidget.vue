<template>
  <div>
    <div class="flex column">
      <q-btn v-for="(questItem, index) in quests" :key="index" push dense
        @click="activeQuestDialog = true; activeQuest = questItem"
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
        <q-card-section v-if="!claimError">
          <div class="full-width q-pb-sm rounded-sm bg-grey-2">
            <div class="text-center text-subtitle2 q-pa-xs"><b>Награда: </b></div>
            <div class="row q-gutter-sm items-center justify-center">
              <div v-for="(resource, resourceIndex) in activeQuest.reward" :key="`resource-${resourceIndex}`" >
                  <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section v-else>
          Something went wrong.
        </q-card-section>
        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn class="full-width" push label="Отлично" color="positive" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="assignedQuestDialog" position="bottom" persistent>
      <div class="full-width column">
        <div class="row">
          <div class="col-6">
            <transition
              appear
              enter-active-class="animated fadeInUp"
              leave-active-class="animated fadeOutDown">
              <img v-if="assignedQuestDialog" :src="assignedQuest.pages[assignedQuestActivePage].image" style="width: 130%; z-index: -1; margin-bottom: -20px; float: right;">
            </transition>
          </div>
        </div>
        <q-card class="bg-white rounded-b-0 full-width" style="overflow: visible;">
          <q-card-section class="text-white row no-wrap q-pa-none">
            <div :class="`col q-pa-sm rounded-t bg-gradient-${assignedQuest.group.color}`">
                <div class="text-subtitle1 text-center"><b>{{ assignedQuest.group.title }}</b></div>
            </div>
          </q-card-section>
          <q-card-section v-if="assignedQuest.pages && assignedQuest.pages[assignedQuestActivePage]" class="q-pa-none" >
            <div class="q-pa-sm">
              <div class="q-pb-sm">
                <div class="text-subtitle1"><b>{{ assignedQuest.pages[assignedQuestActivePage].title }}</b></div>
                <div class="text-caption">{{ assignedQuest.pages[assignedQuestActivePage].description }}</div>
              </div>
              <div class="full-width q-pb-sm q-mb-sm rounded-sm bg-grey-2" v-if="!assignedQuest.pages[assignedQuestActivePage+1]">
                <div class="text-center text-subtitle2 q-pa-xs"><b>Награда: </b></div>
                <div class="row q-gutter-sm items-center justify-center">
                  <div v-for="(resource, resourceIndex) in assignedQuest.reward" :key="`resource-${resourceIndex}`" >
                    <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
                  </div>
                </div>
              </div>
              <div class="flex justify-end q-gutter-sm">
                <q-btn v-if="!assignedQuest.pages[assignedQuestActivePage+1]" push :label="assignedQuest.pages[assignedQuestActivePage].answer" color="primary" @click="startQuest(assignedQuest.id)"/>
                <q-btn v-else push :label="assignedQuest.pages[assignedQuestActivePage].answer" color="primary" @click="assignedQuestActivePage++" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>
    <q-dialog v-model="activeQuestDialog" position="bottom">
      <div class="full-width column" style="overflow: visible">
        <div class="row">
          <div class="col-6 text-right">
            <transition
              appear
              enter-active-class="animated fadeInUp"
              leave-active-class="animated fadeOutDown">
              <img v-if="activeQuestDialog" :src="activeQuest.group.image_full" style="height: 270px; z-index: -1; margin-bottom: -20px; float: right;">
            </transition>
          </div>
        </div>
        <q-card class="bg-white  full-width rounded-b-0" style="overflow: visible;">
          <q-card-section class="text-white row no-wrap q-pa-none">
            <div :class="`col q-pa-sm rounded-t bg-gradient-${activeQuest.group.color}`">
                <div class="text-subtitle1 text-center"><b>{{ activeQuest.group.title }}</b></div>
            </div>
          </q-card-section>
          <q-card-section class="q-pb-none q-pt-sm">
            <q-item class="q-pa-none">
              <q-item-section class="text-left q-pb-sm">
                <div class="row q-my-sm justify-between items-end" >
                  <div>
                    <q-item-label class="text-subtitle2"><b>{{ activeQuest.title }}</b></q-item-label>
                    <q-chip
                        v-if="activeQuest.time_left_humanized"
                        dense
                        class="q-px-sm q-ma-none"
                        style="font-size: 13px"
                        :color="((activeQuest.time_left <= 3) ? 'red' : 'orange')"
                        icon="sports_score"
                        text-color="white">
                        <b>{{ activeQuest.time_left_humanized }}</b>
                    </q-chip>
                  </div>
                  <div class="col text-right self-end">
                      <span class="text-subtitle2"><b>{{activeQuest.progress}}</b></span>
                      <span class="text-caption"><b>/{{ activeQuest.value }}</b></span>
                  </div>
                </div>
                <q-progress-bar :value="activeQuest.progress/activeQuest.value*100" size="25px" :color="(activeQuest.progress >= activeQuest.value) ? 'positive' : 'orange'"/>

              </q-item-section>
            </q-item>
          </q-card-section>
          <q-separator/>
          <q-card-section class="q-pa-sm ">
            <div class="full-width q-pb-sm rounded-sm bg-grey-2">
              <div class="text-center text-subtitle2 q-pa-xs"><b>Награда: </b></div>
              <div class="row q-gutter-sm items-center justify-center">
                <div v-for="(resource, resourceIndex) in activeQuest.reward" :key="`resource-${resourceIndex}`" >
                  <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-actions class="justify-center">
            <q-btn color="grey" push label="Закрыть" v-close-popup/>
            <q-btn v-if="activeQuest.is_completed" color="positive" push label="Завершить" icon-right="done" @click="claimReward(activeQuest.id)"/>
            <q-btn v-else-if="activeQuest.target.id" color="primary" push label="Перейти" icon-right="chevron_right" @click="goToQuestTarget(activeQuest.target)"/>
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { api } from '../services/index'
import { ref, onMounted, onActivated } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useNavigationHistory } from '../composables/useNavigationHistory'
import { useLesson } from '../composables/useLesson'
import UserResourceBar from '../components/UserResourceBar.vue'

const { lesson, setTarget } = useLesson()
const  router = useRouter()

const error = ref(false)
const claimDialog = ref(false)
const claimRewards = ref({})
const claimError = ref(false)
const reloadTrigger = ref(false)
const quests = ref([])
const assignedQuest = ref({})
const assignedQuests = ref([])
const assignedQuestActivePage = ref(0)
const assignedQuestDialog = ref(false)
const activeQuest = ref({})
const activeQuestDialog = ref(false)

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
  checkInactive()
}

const checkInactive = () => {
  assignedQuests.value = quests.value.filter((quest) => { return quest.status == 'created'})
  if(assignedQuests.value.length > 0){
    assignedQuest.value = assignedQuests.value[0]
    assignedQuestDialog.value = true
  }
}

const goToQuestTarget = (questTarget) => {
  if(questTarget.code == 'lesson'){
    setTarget(questTarget.id)
    if(questTarget.parent_id) return router.push(`lesson-startup-${questTarget.parent_id}`)
    router.push(`lesson-startup-${questTarget.id}`)
  } else if (questTarget.code == 'skill') {
    router.push(`skills`)
  }
}

const startQuest = async (questId) => {
  const questStartedResponse = await api.quest.startItem({ quest_id: questId })
  if(questStartedResponse){
    assignedQuestDialog.value = false
    assignedQuest.value = {}
    assignedQuestActivePage.value = 0
    assignedQuests.value.shift()
    if(assignedQuests.value.length > 0){
      assignedQuest.value = assignedQuests.value[0]
      assignedQuestDialog.value = true
    }
  }
}

const claimReward = async (questId) => {
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
})

</script>
