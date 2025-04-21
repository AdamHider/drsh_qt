<template>
  <q-card class="bg-transparent full-height column no-wrap justify-end">
    <q-card-section class="overflow-auto" >
      <div style="padding-bottom: 60px;">
        <div v-for="(replica, replicaIndex) in replicaList" :key="`replicaIndex${replicaIndex}`" >
          <transition
            appear
            :enter-active-class="`animated ${(replica.is_user) ? 'fadeInRight' : 'fadeInLeft'}`"
            :leave-active-class="`animated fadeOutDown ${(replica.is_user) ? 'fadeOutRight' : 'fadeOutLeft'}`">

            <q-item v-if="replica.is_user" class="q-px-sm">
              <q-item-section>
                <q-card class="q-push q-ml-md">
                  <q-card-section class="q-py-sm">
                    <div><b>{{ replica.name }}</b></div>
                    <div class="text-caption">{{ replica.text }}</div>
                  </q-card-section>
                </q-card>
              </q-item-section>
              <q-item-section avatar>
                <q-avatar size="60px" style="box-shadow: 0px 0px 0px 2px white;">
                  <q-img :src="replica?.image"/>
                </q-avatar>
              </q-item-section>
            </q-item>
            <q-item v-else class="q-px-sm">
              <q-item-section avatar>
                <q-avatar size="60px" :class="`bg-gradient-${props.group.color}`"  style="box-shadow: 0px 0px 0px 2px white;">
                  <q-img :src="replica?.image"/>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-card :class="`q-push bg-gradient-${props.group.color} text-white`">
                  <q-card-section class="q-py-sm  q-mr-md">
                    <div><b>{{ replica.name }}</b></div>
                    <div class="text-caption">{{ replica.text }}</div>
                    <div class="full-width q-mt-sm" v-if="replica.is_reward">
                      <div class="row q-gutter-sm">
                        <div v-for="(resource, resourceIndex) in props.reward" :key="`resource-${resourceIndex}`" >
                          <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-item-section>
            </q-item>
          </transition>
        </div>
      </div>
    </q-card-section>
    <div class="absolute-bottom q-pa-sm text-white" style="z-index: 100">
      <q-btn v-if="isLastReplica" push class="full-width bg-gradient-primary" @click="startQuest()"><b>Отлично</b></q-btn>
      <q-btn v-else push class="full-width bg-gradient-primary" @click="nextReplica()"><b>Далее</b></q-btn>
    </div>
  </q-card>
</template>

<script setup>
import { ref, onMounted, onActivated, watch } from 'vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import { useUserStore } from '../stores/user'

const { user } = useUserStore()

const assignedQuestActivePage = ref(0)
const isLastReplica = ref(false)
const replicaList = ref([])

const props = defineProps({
  replicas: Array,
  group: Object,
  reward: Array
})
const emits = defineEmits(['onStarted'])

const startQuest = async () => {
  emits('onStarted')
}
const nextReplica = () => {
  assignedQuestActivePage.value++
  let activeReplica = props.replicas[assignedQuestActivePage.value]
  if(!props.replicas[assignedQuestActivePage.value + 1]){
    isLastReplica.value = true
  }
  if(activeReplica.is_user){
    activeReplica.image = user.active.data.character.image
    activeReplica.name = user.active.data.name
  }
  replicaList.value.push(activeReplica)
}

onMounted(() => {
  assignedQuestActivePage.value = 0
  replicaList.value = []
  replicaList.value.push(props.replicas[assignedQuestActivePage.value])
})
onActivated(() => {
  assignedQuestActivePage.value = 0
  replicaList.value = []
  replicaList.value.push(props.replicas[assignedQuestActivePage.value])
})

watch(() => props.replicas, () => {
  assignedQuestActivePage.value = 0
  replicaList.value = []
  replicaList.value.push(props.replicas[assignedQuestActivePage.value])
})


</script>
