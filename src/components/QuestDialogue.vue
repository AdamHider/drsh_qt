<template>
    <div class="text-white" style="padding-bottom: 50px;">
      <q-infinite-scroll reverse class="q-pa-sm">
        <div v-for="(replica, replicaIndex) in replicaList" :key="`replicaIndex${replicaIndex}`" >

          <transition
            appear
            enter-active-class="animated fadeInUp"
            leave-active-class="animated fadeOutDown">
            <q-chat-message :sent="replica.is_user">
              <template v-slot:name>{{ replica.name }}</template>
              <template v-slot:avatar>
                <img
                  class="q-message-avatar q-message-avatar--received"
                  :src="replica.image"
                >
              </template>
              <div>
                {{ replica.text }}
              </div>
            </q-chat-message>
          </transition>
        </div>
        <div class="full-width q-pb-sm q-mb-sm rounded-sm bg-grey-2" v-if="isLastReplica">
          <div class="text-center text-subtitle2 q-pa-xs"><b>Награда: </b></div>
          <div class="row q-gutter-sm items-center justify-center">
            <div v-for="(resource, resourceIndex) in props.reward" :key="`resource-${resourceIndex}`" >
              <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
            </div>
          </div>
        </div>
      </q-infinite-scroll>


      <q-btn v-if="isLastReplica" flat class="full-width" @click="startQuest()" color="white"><b>Вперед</b></q-btn>
      <q-btn v-else flat class="full-width" @click="nextReplica()" color="white"><b>Далее</b></q-btn>
    </div>
</template>

<script setup>
import { api } from '../services/index'
import { ref, onMounted } from 'vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import { useUserStore } from '../stores/user'

const { user } = useUserStore()

const assignedQuest = ref({})
const assignedQuests = ref([])
const assignedQuestActivePage = ref(0)
const assignedQuestDialog = ref(false)
const isLastReplica = ref(false)
const replicaList = ref([])

const props = defineProps({
  replicas: Array,
  reward: Array
})
const emits = defineEmits(['onStarted'])

const startQuest = async () => {
  emits('onStarted')
}
const nextReplica = () => {
  assignedQuestActivePage.value++
  let activeReplica = props.replicas[assignedQuestActivePage.value]
  if(!activeReplica){
    isLastReplica.value = true
    return;
  }
  if(activeReplica.is_user){
    activeReplica.image = user.active.data.character.image
    activeReplica.name = user.active.data.name
  }
  replicaList.value.push(activeReplica)
}

onMounted(() => {
  replicaList.value.push(props.replicas[assignedQuestActivePage.value])
})


</script>
