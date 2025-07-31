<template>
  <div>
    <q-dialog v-model="tutorialDialog" position="bottom" persistent>
      <div class="full-width column">
        <div class="row">
          <div class="col-6">
            <transition
              appear
              enter-active-class="animated fadeInUp"
              leave-active-class="animated fadeOutDown">
              <img src="/images/characters/quest_character_full.png" style="width: 130%; z-index: -1; margin-bottom: -20px; float: right;"/>
            </transition>
          </div>
        </div>
        <q-card class="bg-white rounded-b-0 full-width" style="overflow: visible;">
          <q-card-section v-if="tutorialPageIndex == 0">
              <div class="q-pb-md">
                <div class="text-subtitle1"><b>Привет капитан!</b></div>
                <div class="text-caption">Меня зовут Кодекс и я твой главный помощник!</div>
              </div>
              <div class="flex justify-end q-gutter-sm">
                <q-btn push label="Привет, Кодекс!" color="primary" @click="tutorialPageIndex++"/>
              </div>
          </q-card-section>
          <q-card-section v-if="tutorialPageIndex == 1">
              <div class="q-pb-md">
                <div class="text-subtitle1"><b>Путешествие по галактике - сложная задача</b></div>
                <div class="text-caption">Поэтому я должен ознакомить тебя с основами освоения космоса!</div>
              </div>
              <div class="flex justify-center q-gutter-sm">
                <q-btn  push label="Не нужно" color="grey" @click="finishTutorial(false)"/>
                <q-btn push label="Конечно, давай" color="primary" @click="tutorialPageIndex++"/>
              </div>
          </q-card-section>
          <q-card-section v-if="tutorialPageIndex == 2">
              <div class="q-pb-md">
                <div class="text-subtitle1"><b>Отлично!</b></div>
                <div class="text-caption">Это не займёт много времени.</div>
              </div>
              <div class="flex justify-end q-gutter-sm">
                <q-btn  push label="Вперёд" color="primary" @click="startTutorial"/>
              </div>
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>
    <q-dialog v-model="tutorialEndDialog" position="bottom" persistent>
      <div class="full-width column">
        <div class="row">
          <div class="col-6">
            <transition
              appear
              enter-active-class="animated fadeInUp"
              leave-active-class="animated fadeOutDown">
              <img src="/images/characters/quest_character_full.png" style="width: 130%; z-index: -1; margin-bottom: -20px; float: right;"/>
            </transition>
          </div>
        </div>
        <q-card class="bg-white rounded-b-0 full-width" style="overflow: visible;">
          <q-card-section>
              <div class="q-pb-md">
                <div class="text-subtitle1"><b>Теперь пора к звёздам!</b></div>
                <div class="text-caption">Пришло время переходить к спасению галактики! На звёздной карте для тебя есть задания!</div>
              </div>
              <div class="flex justify-center q-gutter-sm">
                <q-btn push label="Позже" color="grey" @click="finishTutorial(false)"/>
                <q-btn push label="Вперёд!" color="primary" @click="finishTutorial(true)"/>
              </div>
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, watch } from 'vue'
import { useTutorial } from '../../composables/useTutorial'
import { useRouter } from "vue-router";

const { tutorial, setStatus, setIndex } = useTutorial()
const router = useRouter();

const tutorialPageIndex = ref(0)
const tutorialDialog = ref(false)
const tutorialEndDialog = ref(false)

const startTutorial = () => {
  setStatus(true)
  setIndex(0)
  tutorialDialog.value = false
}
const finishTutorial = (forward) => {
  tutorialDialog.value = false
  tutorialEndDialog.value = false
  setStatus(false)
  localStorage['tutorialEnd'] = true
  if(forward){
    router.push('/courses')
  }

}

watch(() => tutorial.tutorialEnd, () => {
  if(tutorial.tutorialEnd)  tutorialEndDialog.value = true
})
onMounted(() => {
  if(localStorage['tutorialEnd']) return false
  setStatus(false)
  tutorialPageIndex.value = 0
  setIndex(0)
  setTimeout(() => {
    tutorialDialog.value = true
  },1000)

})
onActivated(() => {
  if(localStorage['tutorialEnd']) return false
  setStatus(false)
  tutorialPageIndex.value = 0
  setIndex(0)
  setTimeout(() => {
    tutorialDialog.value = true
  },1000)
})
</script>
