<template>
  <q-card class="bg-transparent full-height column no-wrap justify-end">
    <q-card-section class="overflow-auto" ref="scrollContainer">
      <div style="padding-bottom: 60px;">
        <div class="q-pa-sm q-mb-md text-white text-center">
          <div class="text-subtitle1"><b>{{ props.quest.title }}</b></div>
          <div class="text-caption">{{ props.quest.data[replicaMode].description }}</div>
        </div>
        <div v-if="props.mode !== 'active'">
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
                  <q-avatar size="60px" :class="`bg-gradient-${props.quest.group.color}`"  style="box-shadow: 0px 0px 0px 2px white;">
                    <q-img :src="replica?.image"/>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-card :class="`q-push bg-gradient-${props.quest.group.color} text-white`">
                    <q-card-section class="q-py-sm  q-mr-md">
                      <div><b>{{ replica.name }}</b></div>
                      <div class="text-caption">{{ replica.text }}</div>
                    </q-card-section>
                  </q-card>
                </q-item-section>
              </q-item>
            </transition>
          </div>
        </div>
          <transition
            appear
            enter-active-class="animated fadeInUp "
            leave-active-class="animated fadeOutDown ">
        <div v-if="isLastReplica && props.mode == 'active'" class="text-white q-mt-sm">
          <q-separator dark/>
            <q-item class="q-pa-sm">
              <q-item-section class="text-left q-pb-sm">
                <div class="row q-my-sm justify-between items-end" >
                  <div class="text-subtitle2"><b>{{ props.quest.description }}</b></div>
                  <div class="col text-right self-end">
                      <span class="text-subtitle2"><b>{{props.quest.progress}}</b></span>
                      <span class="text-caption"><b>/{{ props.quest.value }}</b></span>
                  </div>
                </div>
                <q-progress-bar :value="props.quest.progress/props.quest.value*100" size="25px" dark :color="(props.quest.progress >= props.quest.value) ? 'positive' : 'orange'"/>
              </q-item-section>
            </q-item>
            <div class="text-center">
              <div><b>Награда:</b></div>
              <div class="full-width q-mt-sm">
                <div class="row q-gutter-sm justify-center">
                  <div v-for="(resource, resourceIndex) in props.quest.reward" :key="`resource-${resourceIndex}`" >
                    <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
                  </div>
                </div>
              </div>
            </div>
        </div>
        </transition>

        <div ref="dialogueBottomPoint" class="dialogueBottomPoint"></div>
      </div>
    </q-card-section>
    <div class="absolute-bottom q-pa-sm text-white" style="z-index: 100">
      <div class="row justify-center">
        <q-btn push class="col-auto bg-dark q-ma-xs" @click="onClose()" icon="close"/>
        <div v-if="isLastReplica" class="col">
          <q-btn v-if="props.mode == 'active' && props.quest.target.id" push class="bg-gradient-primary  full-width q-ma-xs" @click="goToQuestTarget()" icon-right="navigate_next"><b>Перейти к цели</b></q-btn>
          <q-btn v-else-if="props.mode == 'start'" push class="full-width bg-gradient-primary q-ma-xs" @click="onStart()"><b >Начать задание</b></q-btn>
          <q-btn v-else-if="props.mode == 'finish'" push class="full-width bg-gradient-primary q-ma-xs" @click="onClaim()"><b >Завершить задание</b></q-btn>
        </div>
        <q-btn push  v-else class="bg-gradient-primary col full-width q-ma-xs" @click="nextReplica()" icon-right="navigate_next" :disabled="nextDisabled"><b>Далее</b></q-btn>
        <q-btn v-if="!isLastReplica" push class="bg-dark col-auto q-ma-xs" @click="skipAll()" icon-right="last_page"><b></b></q-btn>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, onMounted, onActivated, watch } from 'vue'
import { useRouter } from 'vue-router'
import UserResourceBar from '../components/UserResourceBar.vue'
import { useUserStore } from '../stores/user'
import { useLesson } from '../composables/useLesson'

const { user } = useUserStore()
const { setTarget } = useLesson()
const  router = useRouter()

const activePage = ref(0)
const isLastReplica = ref(false)
const replicaList = ref([])
const replicaMode = ref('intro')
const nextDisabled = ref(false)

const dialogueBottomPoint = ref(null);

const props = defineProps({
  mode: String,
  quest: Object,
  expanded: Boolean,
  replicaMode: String
})
const emits = defineEmits(['onStart', 'onClaim', 'onClose'])


const onStart = async () => {
  emits('onStart')
}
const onClaim = async () => {
  emits('onClaim')
}
const onClose = () => {
  emits('onClose')
}

const renderReplicaList = () => {
  isLastReplica.value = false
  activePage.value = 0
  replicaList.value = []
  if(props.quest.is_completed && props.quest.status == 'active'){
    replicaMode.value = 'outro'
  }
  if(props.expanded){
    replicaList.value = props.quest.data[replicaMode.value].dialogue
    isLastReplica.value = true
  } else {
    replicaList.value.push(props.quest.data[replicaMode.value].dialogue[activePage.value])
  }
  setTimeout(() => {
    dialogueBottomPoint.value.scrollIntoView()
  }, 100)
}

const nextReplica = () => {
  activePage.value++
  let activeReplica = props.quest.data[replicaMode.value].dialogue[activePage.value]
  if(!props.quest.data[replicaMode.value].dialogue[activePage.value + 1]){
    isLastReplica.value = true
  }
  if(activeReplica.is_user){
    activeReplica.image = user.active.data.character.image
    activeReplica.name = user.active.data.name
  }
  replicaList.value.push(activeReplica)
  nextDisabled.value = true
  setTimeout(() => {
    dialogueBottomPoint.value.scrollIntoView()
    nextDisabled.value = false
  }, 100)
}
const skipAll = () => {
    if(activePage.value < props.quest.data[replicaMode.value].dialogue.length-1){
      nextReplica()
      setTimeout(() => {
        skipAll()
      }, 0)

    }
}
const goToQuestTarget = () => {
  onClose()
  if(props.quest.target.code == 'lesson'){
    setTarget(props.quest.target.id)
    if(props.quest.target.parent_id) return router.push(`lesson-startup-${props.quest.target.parent_id}`)
    router.push(`lesson-startup-${props.quest.target.id}`)
  } else if (props.quest.target.code == 'skill') {
    router.push(`skills`)
  }
}

onMounted(() => {
  renderReplicaList()
})
onActivated(() => {
  renderReplicaList()
})

watch(() => props.quest.data, () => {
  renderReplicaList()
})


</script>
