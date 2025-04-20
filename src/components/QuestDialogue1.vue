<template>
    <div class="full-width column">
      <div class="row">
        <div class="col-6">
          <transition
            appear
            enter-active-class="animated fadeInUp"
            leave-active-class="animated fadeOutDown">
            <img  :src="replicas[assignedQuestActivePage].image" style="width: 130%; z-index: -1; margin-bottom: -20px; float: right;">
          </transition>
        </div>
      </div>
      <q-card class="bg-white rounded-b-0 full-width" style="overflow: visible;">
        <q-card-section v-if="replicas && replicas[assignedQuestActivePage]" class="q-pa-none" >
          <div class="q-pa-sm">
            <div class="q-pb-sm">
              <div class="text-subtitle1"><b>{{ replicas[assignedQuestActivePage].title }}</b></div>
              <div class="text-caption">{{ replicas[assignedQuestActivePage].description }}</div>
            </div>
            <div class="full-width q-pb-sm q-mb-sm rounded-sm bg-grey-2" v-if="!replicas[assignedQuestActivePage+1]">
              <div class="text-center text-subtitle2 q-pa-xs"><b>Награда: </b></div>
              <div class="row q-gutter-sm items-center justify-center">
                <div v-for="(resource, resourceIndex) in assignedQuest.reward" :key="`resource-${resourceIndex}`" >
                  <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
                </div>
              </div>
            </div>
            <div class="flex justify-end q-gutter-sm">
              <q-btn v-if="!replicas[assignedQuestActivePage+1]" push :label="replicas[assignedQuestActivePage].answer" color="primary" @click="startQuest(assignedQuest.id)"/>
              <q-btn v-else push :label="replicas[assignedQuestActivePage].answer" color="primary" @click="assignedQuestActivePage++" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
</template>

<script setup>
import { api } from '../services/index'
import { ref } from 'vue'
import UserResourceBar from '../components/UserResourceBar.vue'

const assignedQuest = ref({})
const assignedQuests = ref([])
const assignedQuestActivePage = ref(0)
const assignedQuestDialog = ref(false)

const props = defineProps({
  replicas: Array
})

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



</script>
