<template>
  <q-card flat>
    <q-card-section class="q-py-none">
      <q-card v-if="lesson"
          :class="`q-push relative-position rounded-md text-white text-shadow ${lesson.is_blocked ? 'is-blocked' : ''}`"
          :style="`margin-bottom: 30px; background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${lesson.background_image}); background-size: cover; background-position: center;`">
          <q-card-section horizontal class="items-center">
            <q-card-section>
              <q-img class="planet-image allow-overflow" :src="lesson.image" width="70px" style="filter: drop-shadow(rgba(53, 173, 244, 0.62) 0px 5px 10px); scale: 1.5" no-spinner/>
            </q-card-section>
            <q-card-section  class="q-pa-sm">
              <div class="text-subtitle1"><b>{{ lesson.title }}</b></div>
              <div class="text-sm max-two-lines">{{ lesson.description }}</div>
            </q-card-section>
          </q-card-section>
          <q-card-actions style="margin-bottom: -30px" class="justify-center">
            <q-btn v-if="lesson.exercise?.finished_at"
                push
                label="Начать"
                icon="play_arrow"
                color="gradient-primary"
                class="rounded-sm"
                style="width: 80%"
                :loading="buttonLoading"
                @click="redo(lesson.id)"/>
              <div  v-else-if="lesson.exercise?.id">
                <q-btn
                  push
                  round
                  icon="list"
                  color="gradient-secondary"
                  class="q-mr-sm rounded-sm"
                  :loading="buttonLoading"
                  @click="activeWordsDialog = true"/>
                <q-btn
                  push
                  label="Продолжить"
                  icon="play_arrow"
                  color="gradient-green"
                  class="rounded-sm"
                  :loading="buttonLoading"
                  @click="open(lesson.id)"/>
              </div>

              <q-btn v-else
                push
                label="Начать"
                icon="play_arrow"
                color="gradient-primary"
                class="rounded-sm"
                style="width: 80%"
                @click="openDialog()"
                :loading="buttonLoading">
              </q-btn>
          </q-card-actions>
      </q-card>
    </q-card-section>
    <q-card-section class="q-py-none">
      <div class="text-subtitle1"><b>Выученные слова ({{ finishedWords.length }})</b></div>
    </q-card-section>
    <q-card-section class="q-py-none">
      <q-list v-if="finishedWords.length > 0" separator>
        <q-item v-for="(word, wordIndex) in finishedWords" :key="`finishedWordIndex-${wordIndex}`" dense>
            <q-item-section avatar>
              <q-avatar color="positive" size="25px">
                <q-icon name="check" color="white"></q-icon>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <div class="text-subtitle1"><b>{{ word.data.text }}</b></div>
              <div class="text-caption">{{ word.data.label }}</div>
            </q-item-section>
            <q-item-section side>
              <b class="text-caption">{{ word.updated_at_humanized }}</b>
            </q-item-section>
          </q-item>
      </q-list>
      <div v-else>
          <div class="text-caption">Нет выученных слов</div>
      </div>
    </q-card-section>
  </q-card>

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
        <q-list separator>
          <q-item v-for="(word, wordIndex) in words" :key="`wordIndex-${wordIndex}`" tag="label" dense clickable v-ripple>
            <q-item-section>
              <div class="text-subtitle1"><b>{{ word.data.text }}</b></div>
              <div class="text-caption">{{ word.data.label }}</div>
            </q-item-section>
            <q-item-section side>
              <q-checkbox v-model="activeWordIds" :val="word.id"/>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator/>
      <q-card-actions class="q-pt-none q-px-md">
        <div v-if="activeWordIds.length < totalWords" class="full-width">
          <q-item class="q-px-none">
            <q-item-section>
              <div class="text-subtitle1"><b>Мало слов ({{ activeWordIds.length }})</b></div>
              <div class="text-caption">Для начала тренировки нужно хотя бы {{ totalWords }} слов</div>
              <q-progress-bar :value="activeWordIds.length*100/totalWords" size="25px" color="positive" class="q-mt-sm"/>
            </q-item-section>
          </q-item>
        </div>
        <div v-else class="full-width">
          <q-item class="q-px-none">
            <q-item-section>
              <div class="text-subtitle1"><b>Можем начинать ({{ activeWordIds.length }})</b></div>
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

  <q-dialog v-model="activeWordsDialog">
    <q-card class="q-push full-width">
      <q-card-section class="q-px-none ">
        <q-item class="q-py-none text-left items-start">
          <q-item-section >
            <div class="text-subtitle1"><b>Текущая тренировка</b></div>
            <div class="text-caption">Сейчас тренируются следующие слова</div>
          </q-item-section>
          <q-item-section side>
            <q-btn round class="text-shadow-none rounded-xs" size="sm" push color="red" icon="close" v-close-popup @click.stop="playAudio('click')"></q-btn>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator/>
      <q-card-section style="max-height: 50vh" class="scroll q-pa-xs">
        <q-list separator>
          <q-item v-for="(activeWord, wordIndex) in activeWords" dense :key="`activeWordIndex-${wordIndex}`">
            <q-item-section>
              <div class="text-subtitle1"><b>{{ activeWord.data.text }}</b></div>
              <div class="text-caption">{{ activeWord.data.label }}</div>
            </q-item-section>
            <q-item-section side>
              <q-checkbox v-model="activeWordIds" :val="activeWord.id" disable/>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator/>
      <q-card-actions>
        <q-btn
          push
          label="Продолжить"
          icon="play_arrow"
          color="gradient-green"
          class="full-width rounded-sm"
          :loading="buttonLoading"
          @click="open(lesson.id)"/>
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
import { ref, toRef, onMounted, onActivated, reactive, watch, computed } from 'vue'
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
const activeWordIds = ref([])
const activeWords = computed(() => {
  let result = []
  for(var i in activeWordIds.value){
    result.push(words.value.find((item) => { return item.id == activeWordIds.value[i]}))
  }
  return result
})
const finishedWords = ref([])
const buttonLoading = ref(false)

const lowEnergyDialog = ref(false)
const activeWordsDialog = ref(false)

const totalWords = ref(12)

const loadActiveList = async () => {
  words.value = []
  const trainingListResponse = await api.training.getList({status: ['created', 'active']})
  if (trainingListResponse.error) {
    error.value = trainingListResponse
    words.value = []
    return false;
  }
  for(var i in trainingListResponse){
    if(activeWordIds.value.length < totalWords.value){
      activeWordIds.value.push(trainingListResponse[i].id)
    }
  }
  words.value = trainingListResponse
}

const loadFinishList = async () => {
  words.value = []
  const trainingListResponse = await api.training.getList({status: ['finished']})
  if (trainingListResponse.error) {
    error.value = trainingListResponse
    finishedWords.value = []
    return false;
  }
  finishedWords.value = trainingListResponse
}

const openDialog = async () => {
  buttonLoading.value = true
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
  for(var i in activeWordIds.value){
    data.push({
      id: activeWordIds.value[i],
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
  loadActiveList()
  loadFinishList()
})
onMounted(async () => {
  buttonLoading.value = false
  loadLessonItem()
  await loadActiveList()
  loadFinishList()
})

</script>

