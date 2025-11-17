<template>
  <div>
    <q-item v-if="lesson"
        :class="`q-push relative-position rounded-md  text-white text-shadow ${lesson.is_blocked ? 'is-blocked' : ''}`"
        :style="`background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${lesson.background_image}); background-size: cover; background-position: center;`">
      
        <q-item-section avatar>
          <q-img class="planet-image allow-overflow" :src="lesson.image" width="50px" style="filter: drop-shadow(rgba(53, 173, 244, 0.62) 0px 5px 10px); scale: 1.7" no-spinner/>
        </q-item-section>
        <q-item-section  class="q-pa-sm">
          <div class="text-subtitle1"><b>{{ lesson.title }}</b></div>
          <div class="text-sm max-two-lines">{{ lesson.description }}</div>
        </q-item-section>
        <q-item-section side>
          <q-btn v-if="lesson.exercise?.finished_at"
              push
              round 
              dense
              icon="play_arrow"
              color="gradient-secondary"
              class="full-width rounded-sm"
              :loading="buttonLoading"
              @click="redo(lesson.id)"/>
            <q-btn v-else-if="lesson.exercise?.id"
              push
              round 
              dense
              icon="play_arrow"
              color="gradient-green"
              class="full-width rounded-sm"
              :loading="buttonLoading"
              @click="open(lesson.id)"/>
            <q-btn v-else
              push
              round 
              dense
              icon="play_arrow"
              color="gradient-primary"
              class="full-width rounded-sm"
              @click="openDialog()"
              :loading="buttonLoading">
            </q-btn>
        </q-item-section>
    </q-item>
  </div>
  <q-dialog v-model="trainingDialog">
    <q-card class="q-push full-width">
      <q-card-section class="q-px-none ">
        <q-item class="q-py-none text-left items-start">
          <q-item-section >
            <div class="text-subtitle1"><b>Новая тренировка</b></div>
            <div class="text-caption">Выбери слова, которые хочешь тренировать</div>
          </q-item-section>
          <q-item-section side>
            <q-btn round class="text-shadow-none rounded-xs" size="sm" push color="red" icon="close" v-close-popup @click.stop="playAudio('click')"></q-btn>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator/>
      <q-card-section style="max-height: 50vh" class="scroll q-pa-xs">
        <q-list>
          <q-item v-for="(word, wordIndex) in words" :key="`wordIndex-${wordIndex}`" tag="label" clickable v-ripple>
            <q-item-section>
              <div class="text-subtitle1"><b>{{ word.data.text }}</b></div>
              <div class="text-caption">{{ word.data.label }}</div>
            </q-item-section>
            <q-item-section side>
              <q-checkbox v-model="activeWords" :val="word.id"/>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator/>
      <q-card-actions class="q-pt-none q-px-md">
        <div v-if="activeWords.length < totalWords" class="full-width">
          <q-item class="q-px-none">
            <q-item-section>
              <div class="text-subtitle1"><b>Мало слов ({{ activeWords.length }})</b></div>
              <div class="text-caption">Для начала тренировки нужно хотя бы {{ totalWords }} слов</div>
              <q-progress-bar :value="activeWords.length*100/totalWords" size="25px" color="positive" class="q-mt-sm"/>
            </q-item-section>
          </q-item>
        </div>
        <div v-else class="full-width">
          <q-item class="q-px-none">
            <q-item-section>
              <div class="text-subtitle1"><b>Можем начинать ({{ activeWords.length }})</b></div>
              <div class="text-caption">Всё готово к началу тренировки</div>
            </q-item-section>
          </q-item>
          <q-spend-button
            push
            color="gradient-primary"
            icon-right="play_arrow"
            class="full-width q-mt-xs"
            :resources="lesson.cost ?? []"
            :loading="buttonLoading"
            @click="start(lesson.id)"></q-spend-button>
          </div>
        </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="lowEnergyDialog" position="bottom">
      <div class="full-width column">
        <div class="row">
          <div class="col-6">
            <transition
              appear
              enter-active-class="animated fadeInUp"
              leave-active-class="animated fadeOutDown">
              <img src="/images/characters/codex_full_low_energy.png" style="width: 130%; z-index: -1; margin-bottom: -20px; float: right;"/>
            </transition>
          </div>
        </div>
        <q-card class="bg-white rounded-b-0 full-width" style="overflow: visible;">
          <q-card-section>
              <div class="q-pb-md">
                <div class="text-subtitle1"><b>Внимание, не хватает энергии!</b></div>
                <div class="text-caption">Но она скоро появится! Энергия восстанавливается 1ед./час. Чтобы ускорить этот процесс можно изучить технологии в разделе "Энергетика", либо купить энергию в Космо-маркете</div>
              </div>
          </q-card-section>
          <q-card-actions class="flex justify-stretch items-start">
            <q-btn push class="full-width q-mb-sm"  color="gradient-blue" @click="openSkills()" @click.stop="playAudio('click')">К технологиям <q-icon name="biotech"></q-icon></q-btn>
            <q-btn push @click="openMarket()"  class="full-width" color="gradient-green" @click.stop="playAudio('click')">В Космо-маркет <q-icon name="shopping_cart"></q-icon></q-btn>
            <q-btn flat v-close-popup class="full-width q-mt-sm" @click.stop="playAudio('click')"><b>Я подожду</b></q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
</template>

<script setup>
import { api } from '../services/index'
import { ref, toRef, onMounted, onActivated, reactive, watch } from 'vue'
import { useRouter } from "vue-router";
import { useUserStore } from '../stores/user'
import { useExercise } from '../composables/useExercise'
import { useLesson } from '../composables/useLesson'
import { playAudio } from 'src/services/audioService';

const { createItem, redoItem } = useExercise()
const { redoTrainingItem } = useLesson()

const router = useRouter();

const error = ref(false)
const trainingDialog = ref(false)
const lesson = ref({})
const words = ref([])
const activeWords = ref([])
const buttonLoading = ref(false)
const lowEnergyDialog = ref(false)
const totalWords = ref(12)

const loadList = async () => {
  words.value = []
  const trainingListResponse = await api.training.getList({status: 'created'})
  if (trainingListResponse.error) {
    error.value = trainingListResponse
    words.value = []
    return false;
  }
  for(var i in trainingListResponse){
    if(activeWords.value.length < totalWords.value){
      activeWords.value.push(trainingListResponse[i].id)
    }
  }
  
  words.value = trainingListResponse
}

const openDialog = async () => {
  buttonLoading.value = true
  await loadList()
  trainingDialog.value = true
  buttonLoading.value = false
}
const loadLessonItem = async () => {
  const lessonItemResponse = await api.training.getLessonItem({})
  if (lessonItemResponse.error) {
    error.value = lessonItemResponse
    lesson.value = []
    return false;
  }
  lesson.value = lessonItemResponse
}
const start = async (lessonId) => {
  buttonLoading.value = true
  const data = [];
  for(var i in activeWords.value){
    data.push({
      id: activeWords.value[i],
      status: 'active'
    })
  }
  const saveResponse = await api.training.saveList({'data': data})
  if (saveResponse.error) {
    error.value = saveResponse
    buttonLoading.value = false
    return false;
  }
  buttonLoading.value = false
  const exerciseCreated = await createItem(lessonId)
  if (!exerciseCreated.error) {
    await useUserStore().getItem()
    router.push(`/lesson-${lessonId}`)
    trainingDialog.value = false
  } else {
    if(exerciseCreated.messages.error == 'not_enough_resources')
    lowEnergyDialog.value = true
  }
}
const open = async (lessonId) => {
  playAudio('click')
  buttonLoading.value = true
  router.push(`/lesson-${lessonId}`)
}
const redo = async (lessonId) => {
  playAudio('click')
  buttonLoading.value = true
  await redoTrainingItem(lessonId);
  await loadLessonItem()
  openDialog()
}

onActivated(() => {
  buttonLoading.value = false
  loadLessonItem()
})
onMounted(() => {
  buttonLoading.value = false
  loadLessonItem()
})

</script>

