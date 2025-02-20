<template>
  <div>
    <div class="flex column">
      <q-btn v-for="(questItem, index) in quests" :key="index" push dense
        @click="activeQuestDialog = true; activeQuest = questItem"
        size="sm"
        :class="`bg-gradient-${questItem.group.color} text-white q-ma-sm cursor-pointer rounded-sm q-mt-sm push`" >
        <div style="width: 40px">
          <img :src="questItem.group.image_avatar" width="40px" class="absolute-bottom q-mx-sm q-mb-xs">
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
        <q-card-section>
          <div v-if="!claimError" class="text-h6">Задание выполнено!</div>
          <div v-else class="text-h6">Упс...</div>
        </q-card-section>
        <q-card-section v-if="!claimError">
          <div class="full-width q-pb-sm rounded-sm bg-grey-2">
            <div class="text-center text-subtitle2 q-pa-xs"><b>Награда: </b></div>
            <div class="row q-gutter-sm items-center justify-center">
              <div v-for="(resource, resourceIndex) in activeQuest.reward" :key="`resource-${resourceIndex}`" >
                <q-item dense :class="`text-left rounded-borders  bg-light-gradient-${resource?.color} text-white`" >
                    <q-item-section avatar style="min-width: unset;">
                        <q-img width="25px" :src="resource.image" style="filter: drop-shadow(1px 3px 3px #00000075)"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label><b>{{resource.quantity}}</b></q-item-label>
                    </q-item-section>
                </q-item>
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
      <q-card class="bg-white  full-width" style="overflow: visible;">
        <q-card-section :class="`bg-gradient-${assignedQuest.group.color} text-white row no-wrap q-pa-none`">
          <div class="col-4"></div>
          <div class="col q-pa-sm">
              <q-item-label class="text-subtitle1"><b>{{ assignedQuest.group.title }}</b></q-item-label>
          </div>
        </q-card-section>
        <q-card-section v-if="assignedQuest.pages[assignedQuestActivePage]" class="row q-pa-none no-wrap" >
          <div class="relative-position col-4">
            <img :src="assignedQuest.pages[assignedQuestActivePage].image" style="width: 130%; left: -30%;" class="absolute-bottom q-mx-sm ">
          </div>
          <div class="col q-pa-sm">
            <div class="q-pb-sm">
              <div class="text-subtitle2"><b>{{ assignedQuest.pages[assignedQuestActivePage].title }}</b></div>
              <div class="text-caption">{{ assignedQuest.pages[assignedQuestActivePage].description }}</div>
            </div>
            <div class="full-width q-pb-sm q-mb-sm rounded-sm bg-grey-2" v-if="!assignedQuest.pages[assignedQuestActivePage+1]">
              <div class="text-center text-subtitle2 q-pa-xs"><b>Награда: </b></div>
              <div class="row q-gutter-sm items-center justify-center">
                <div v-for="(resource, resourceIndex) in assignedQuest.reward" :key="`resource-${resourceIndex}`" >
                  <q-item dense :class="`text-left rounded-borders  bg-light-gradient-${resource?.color} text-white`" >
                      <q-item-section avatar style="min-width: unset;">
                          <q-img width="25px" :src="resource.image" style="filter: drop-shadow(1px 3px 3px #00000075)"/>
                      </q-item-section>
                      <q-item-section>
                          <q-item-label><b>{{resource.quantity}}</b></q-item-label>
                      </q-item-section>
                  </q-item>
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
    </q-dialog>
    <q-dialog v-model="activeQuestDialog" position="bottom">
      <q-card class="bg-white  full-width rounded-b-0" style="overflow: visible;">
        <q-card-section class="q-pb-none q-pt-sm">
          <q-item class="q-pa-none">
            <q-item-section avatar class="relative-position col-3" style="justify-content: end;">
                <img :src="activeQuest.group.image_full" style="width: 120%; left: -30%;" class="absolute-bottom q-mx-sm">
            </q-item-section>
            <q-item-section class="text-left q-pb-sm">
              <div class="row q-my-sm justify-between items-end" >
                <div>
                  <q-item-label :class="`text-caption text-${activeQuest.group.color}`"><b>{{ activeQuest.group.title }}</b></q-item-label>
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
                    <b>{{activeQuest.progress}} / {{activeQuest.value}}</b>
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
                <q-item dense :class="`text-left rounded-borders  bg-light-gradient-${resource?.color} text-white`" >
                    <q-item-section avatar style="min-width: unset;">
                        <q-img width="25px" :src="resource.image" style="filter: drop-shadow(1px 3px 3px #00000075)"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label><b>{{resource.quantity}}</b></q-item-label>
                    </q-item-section>
                </q-item>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="justify-center">
          <q-btn color="grey" push label="Закрыть" v-close-popup/>
          <q-btn v-if="activeQuest.is_completed" color="positive" push label="Завершить" icon-right="done" @click="claimReward(activeQuest.id)"/>
          <q-btn v-else-if="activeQuest.href" color="primary" push label="Перейти" icon-right="chevron_right" :to="`${activeQuest.href}`"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { api } from '../services/index'
import { ref, onMounted, onActivated } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useNavigationHistory } from '../composables/useNavigationHistory'

const { routes } = useNavigationHistory()

const error = ref(false)
const claimDialog = ref(false)
const claimRewards = ref({})
const claimError = ref(false)
const reloadTrigger = ref(false)
const quests = ref([])
const assignedQuest = ref({})
const assignedQuestActivePage = ref(0)
const assignedQuestDialog = ref(false)
const activeQuest = ref({})
const activeQuestDialog = ref(false)

const props = defineProps({
  activeOnly: Boolean
})

const load = async function () {
  const questListResponse = await api.quest.getList({ mode: props.mode, active_only: props.activeOnly })
  if (questListResponse.error) {
    error.value = questListResponse
    quests.value = []
    return false;
  }
  quests.value = questListResponse
  checkInactive()
}

const checkInactive = function () {
  const inactiveQuests = quests.value.filter((quest) => { return quest.status == 'created'})
  if(inactiveQuests.length > 0){
    assignedQuest.value = inactiveQuests[0]
    assignedQuestDialog.value = true
  }
}

const startQuest = async function (questId) {
  const questStartedResponse = await api.quest.startItem({ quest_id: questId })
  if(questStartedResponse){
    assignedQuestDialog.value = false
    assignedQuest.value = {}
    assignedQuestActivePage.value = 0
  }
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

const reload = async function () {
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

onMounted(() => {
  load()
})
onActivated(() => {
  load()
})

</script>
