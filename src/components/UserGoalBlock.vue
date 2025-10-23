<template>
      <div class="q-px-sm row" v-if="streak">
        <div class="col-sm-12 col-xs-5 q-pa-sm">
          <q-card :class="`q-push column justify-between  full-height bg-light-gradient-flame text-white`" style="text-shadow: rgba(0, 0, 0, 0.78) 0px 1px 2px;">
            <div class="absolute-full" style="border-radius: 12px; background-image: url('/images/streak_bg.png'); background-position: right top; background-size: contain; background-repeat: no-repeat;"></div>
            <q-card-section class="q-py-sm">
              <div class="text-subtitle2"><b>Серия</b></div>
              <span class="text-h3" style="line-height: 1; font-weight: 800;">{{ streak.day_count }}</span> <span><b>дня</b></span>
              <div v-if="streak.day_count > 0" class="text-caption"><b>Рейтинг растёт!</b></div>
              <div v-else class="text-caption"><b>Рейтинг падает!</b></div>
            </q-card-section>
            <q-card-actions >
              <q-btn push class="full-width bg-white q-item-blinking blink-red no-wrap text-shadow-none" text-color="red" size="12px" style="box-shadow: 0px 2px 5px 0px #00000059;" @click="streakDialog = true">
                <q-icon name="local_fire_department"></q-icon> <b class="q-ml-xs">Показать</b>
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-sm-12 col-xs-7 q-pa-sm" v-if="streak?.daily_goal">
          <q-card :class="`q-push ${(streak.daily_goal.progress < streak.daily_goal.value) ? 'q-item-blinking' : ''} column justify-between full-height text-white`"  style="background-image: url('/images/daily_goal_bg.jpg'); background-position: right bottom; background-size: cover; text-shadow: rgba(0, 0, 0, 0.58) 0px 1px 2px;">
            <q-card-section class="q-pt-sm q-pb-xs">
              <q-item class="q-pa-none">
                <q-item-section v-if="streak.daily_goal.status !== 'finished'">
                  <div class="text-subtitle2"><b>Цель на сегодня</b></div>
                  <div class="text-sm">{{ streak.daily_goal.description }}</div>
                </q-item-section>
                <q-item-section v-else>
                  <div class="text-subtitle2"><b>Цель дня выполнена!</b></div>
                  <div class="text-sm">Серия продолжена и ресурсы получены! Так держать!</div>
                </q-item-section>
              </q-item>
            </q-card-section>
            <q-card-section class="q-px-sm q-pb-xs q-pt-none">
              <div class="row q-gutter-sm justify-center">
                  <div v-for="(resource, resourceIndex) in streak.daily_goal.reward" :key="`resource-${resourceIndex}`" >
                    <UserResourceBar :resource="resource" dense transparent no-caption size="22px" />
                  </div>
                </div>
            </q-card-section>
            <q-card-section class="q-py-none" v-if="streak.daily_goal.status !== 'finished'">
              <div class="text-caption" style="line-height: 1.4"  v-if="streak.daily_goal.is_completed">
                <b>Цель выполнена!</b>
              </div>
              <div class="flex justify-between items-end no-wrap" v-else >
                <div class="text-caption">
                  <b>Осталось {{ (streak.daily_goal.value-streak.daily_goal.progress).toLocaleString() }}
                  <span v-if="streak.daily_goal.code == 'total_lessons'">планеты</span>
                  для защиты рейтинга!</b>
                </div>
                <div class="text-subtitle2"><b>{{ streak.daily_goal.progress }}/{{ streak.daily_goal.value }}</b></div>
              </div>
            </q-card-section>
            <q-card-section class="q-px-sm q-pb-sm q-pt-none" v-if="streak.daily_goal.status !== 'finished'">
              <div v-if="streak.daily_goal.is_completed">
                <q-btn push size="12px" color="positive" class="q-mt-xs full-width" @click="claimReward(streak.daily_goal.id)"><b>Получить награду</b></q-btn>
              </div>
              <div v-else>
                <q-progress-bar :value="streak.daily_goal.progress/streak.daily_goal.value*100" size="24px" dark :color="(streak.daily_goal.progress >= streak.daily_goal.value) ? 'positive' : 'orange'"/>
              </div>
            </q-card-section>
            <q-card-section v-else class="text-center q-pt-xs">
              <div class="text-caption"><b>До следующей цели:</b></div>
              <div class="text-subtitle1"><b>{{ counter_next?.hours }}:{{ counter_next?.minutes }}:{{ counter_next?.seconds }}</b> </div>
            </q-card-section>
          </q-card>
        </div>
    </div>
    <q-dialog v-model="claimDialog"  transition-show="scale" transition-hide="scale" @hide="load()">
      <q-card class="bg-white text-center" style="width: 300px">
        <q-card-section class="q-pb-none"  v-if="!claimError">
          <div class="text-h6"><b>Цель дня выполнена!</b></div>
          <div class="text-subtitle2"><b>Ресурсы получены! Так держать!</b></div>
        </q-card-section>
        <q-card-section class="q-pb-none" v-else>
          <div  class="text-h6"><b>Упс...</b></div>
        </q-card-section>
        <q-card-section>
          <div class="full-width q-pb-sm rounded-sm bg-grey-2">
            <div class="text-center text-subtitle2 q-pa-xs"><b>Награда: </b></div>
            <div class="row q-gutter-sm items-center justify-center">
              <div v-for="(resource, resourceIndex) in streak.daily_goal.reward" :key="`resource-${resourceIndex}`" >
                  <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center" class="bg-white q-px-md q-pb-md text-teal">
          <q-btn class="full-width" push label="Отлично" color="positive" v-close-popup @click.stop="playAudio('click')"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="streakDialog"  transition-show="scale" transition-hide="scale">

    </q-dialog>
</template>

<script setup>
import { ref, watch, toRefs, computed, onActivated, onDeactivated } from 'vue'
import { api } from '../services/index'
import UserResourceBar from '../components/UserResourceBar.vue'
import { useQuest } from '../composables/useQuest'
import { playAudio } from 'src/services/audioService';


const { claimItem } = useQuest()


const activeCountdown = ref(false)
const timeLeftToday = ref(0)
const counter_next = ref({})
const streak = ref({})
const claimDialog = ref(false)
const claimError = ref(false)
const streakDialog = ref(false)

const load = async () => {
  const streakItemResponse = await api.streak.getItem({});
  if(!streakItemResponse.error){
    streak.value = streakItemResponse
  }
}
const countdown = () => {
  var has_counters = false
  setTimeout(async () => {
    if(!activeCountdown.value) return
    if(timeLeftToday.value && timeLeftToday.value > 0){
      timeLeftToday.value--;
      counter_next.value = timeLeftHumanize(timeLeftToday.value)
      has_counters = true
    }
    if(has_counters){
      countdown()
    }
  }, 1000)
}

const timeLeftGet = () => {
  var actualTime = new Date(Date.now());
  var endOfDay = new Date(actualTime.getFullYear(), actualTime.getMonth(), actualTime.getDate() + 1, 0, 0, 0);
  return Math.floor((endOfDay.getTime() - actualTime.getTime()) / 1000);
}

const timeLeftHumanize = (totalSeconds) => {
    var counter = {}
    counter.hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    counter.minutes = Math.floor(totalSeconds / 60);
    counter.seconds = totalSeconds % 60;

    if(counter.hours < 10) counter.hours = '0'+counter.hours
    if(counter.minutes < 10) counter.minutes = '0'+counter.minutes
    if(counter.seconds < 10) counter.seconds = '0'+counter.seconds
    return counter;
}

const claimReward = async (questId) => {
  const questRewardResponse = await claimItem(questId)
  claimDialog.value = true
  claimError.value = false
  if (questRewardResponse.error) {
    claimError.value = true
  }
}

onActivated(async () => {
  await load()
  timeLeftToday.value = timeLeftGet()
  if(timeLeftToday.value){
    console.log(timeLeftToday.value)
    counter_next.value = timeLeftHumanize(timeLeftToday.value)
  }
  if(!activeCountdown.value) activeCountdown.value = true
  countdown()
})
onDeactivated(() => {
  activeCountdown.value = false
})
</script>
