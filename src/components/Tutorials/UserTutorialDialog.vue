<template>
  <div>
    <q-dialog v-model="tutorialDialog" position="bottom" seamless>
      <div class="full-width column" v-if="tutorialPages[assignedQuestActivePage].type == 'dialog'">
        <div class="row">
          <div class="col-6">
            <transition
              appear
              enter-active-class="animated fadeInUp"
              leave-active-class="animated fadeOutDown">
              <img v-if="tutorialDialog" :src="tutorialPages[assignedQuestActivePage].image" style="width: 130%; z-index: -1; margin-bottom: -20px; float: right;">
            </transition>
          </div>
        </div>
        <q-card class="bg-white rounded-b-0 full-width" style="overflow: visible;">
          <q-card-section v-if="tutorialPages && tutorialPages[assignedQuestActivePage]" class="q-pa-none" >
            <div class="q-pa-sm">
              <div class="q-pb-sm">
                <div class="text-subtitle1"><b>{{ tutorialPages[assignedQuestActivePage].title }}</b></div>
                <div class="text-caption">{{ tutorialPages[assignedQuestActivePage].description }}</div>
              </div>
              <div class="flex justify-end q-gutter-sm">
                <q-btn v-if="!tutorialPages[assignedQuestActivePage+1]" push :label="tutorialPages[assignedQuestActivePage].answer" color="primary"  v-close-popup/>
                <q-btn v-else push :label="tutorialPages[assignedQuestActivePage].answer" color="primary" @click="assignedQuestActivePage++"/>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>
    <div class="highlight-area" v-if="tutorialDialog"
      :style="`width: ${hightlightAreaBox.width}px; height: ${hightlightAreaBox.height}px; top: ${hightlightAreaBox.top}px; left: ${hightlightAreaBox.left}px; `"
    >
      <div v-if="tutorialPages[assignedQuestActivePage].type == 'tooltip'"
        :class="`highlight-tooltip ${(tutorialPages[assignedQuestActivePage].tooltipPosition == 'upper') ? 'upper' : 'lower'}`">
        <q-card class="bg-white bg-white q-ma-md" style="min-width: 250px;">
          <q-card-section v-if="tutorialPages && tutorialPages[assignedQuestActivePage]" class="q-pa-none" >
            <div class="q-pa-sm">
              <div class="q-pb-sm">
                <div class="text-subtitle1"><b>{{ tutorialPages[assignedQuestActivePage].title }}</b></div>
                <div class="text-caption">{{ tutorialPages[assignedQuestActivePage].description }}</div>
              </div>
              <div class="flex justify-end q-gutter-sm">
                <q-btn v-if="!tutorialPages[assignedQuestActivePage+1]" push :label="tutorialPages[assignedQuestActivePage].answer" color="primary" @click="tutorialDialog = false"/>
                <q-btn v-else push :label="tutorialPages[assignedQuestActivePage].answer" color="primary" @click="assignedQuestActivePage++"/>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { api } from '../../services/index'
import { ref, onMounted, onActivated, watch } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useLesson } from '../../composables/useLesson'

const { lesson, setTarget } = useLesson()

const claimDialog = ref(false)
const tutorialPages = ref([
  {
    image: '/images/characters/quest_character_full.png',
    type: 'dialog',
    title: 'User level here',
    description: 'User level here',
    answer: 'Next',
    element: 'userLevel',
    tooltipPosition: 'lower'
  },
  {
    title: 'User level here',
    type: 'tooltip',
    description: 'User level here',
    answer: 'Next',
    element: 'userLevel',
    tooltipPosition: 'lower'
  },
  {
    title: 'User statistics here',
    type: 'tooltip',
    description: 'User level here',
    answer: 'Next',
    element: 'userStatistic',
    tooltipPosition: 'upper'
  }
])
const assignedQuestActivePage = ref(0)
const tutorialDialog = ref(false)
const hightlightAreaBox = ref({
  width: 0,
  height: 0,
  top: 0,
  left: 0
})

const props = defineProps({
  elements: Object
})

onBeforeRouteLeave((to, from) => {
  if (claimDialog.value) {
    return false
  }
  return true
})
const getElementCoord = (elementRef) => {
  if(elementRef) {
    var offset = elementRef.$el.getBoundingClientRect()
    hightlightAreaBox.value.top = offset.top
    hightlightAreaBox.value.left = offset.left
    hightlightAreaBox.value.width = offset.width
    if(tutorialPages.value[assignedQuestActivePage.value].type == 'tooltip'){
      hightlightAreaBox.value.height = offset.height
    }
  }
}
const renderPage = () => {
  if(tutorialPages.value[assignedQuestActivePage.value].element){
    const elementRef = tutorialPages.value[assignedQuestActivePage.value].element
    if(props.elements[elementRef]) getElementCoord(props.elements[elementRef])
  }
}

watch(() => assignedQuestActivePage.value, () => {
  renderPage()
})
onMounted(() => {
  tutorialDialog.value = true
  setTimeout(() => {
    renderPage()
  }, 1000)
})
onActivated(() => {
  tutorialDialog.value = true
  setTimeout(() => {
    renderPage()
  }, 1000)
})
</script>
<style scoped lang="scss">
.highlight-area{
  position: fixed;
  top: 300px;
  left: 200px;
  box-shadow: 0px 0px 0px 5000px #00000075;
  border-radius: 15px;
  z-index: 2000;
  transition: 0.3s all ease;
  .highlight-tooltip{
    position: absolute;
    &.upper{
      bottom: 100%;
    }
    &.lower{
      top: 100%;
    }
  }
}
.q-dialog__backdrop{
  background: transparent !important;
}
</style>
