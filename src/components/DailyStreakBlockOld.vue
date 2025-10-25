<template>
    <q-card :class="`q-push column justify-between  full-height bg-light-gradient-flame text-white`" style="text-shadow: rgba(0, 0, 0, 0.78) 0px 1px 2px;">
      <div class="absolute-full" style="border-radius: 12px; background-image: url('/images/streak_bg.png'); background-position: right top; background-size: contain; background-repeat: no-repeat;"></div>
      <q-card-section class="q-py-sm">
        <div class="text-subtitle2"><b>Серия</b></div>
        <span class="text-h3" style="line-height: 1; font-weight: 800;">{{ streak.actual_count }}</span> <span><b>{{ streak.plural_text }}</b></span>
        <div v-if="streak.day_count > 0" class="text-caption"><b>Рейтинг растёт!</b></div>
        <div v-else class="text-caption"><b>Рейтинг падает!</b></div>
      </q-card-section>
      <q-card-actions >
        <q-btn push class="full-width bg-white q-item-blinking blink-red no-wrap text-shadow-none" text-color="red" size="12px" style="box-shadow: 0px 2px 5px 0px #00000059;" @click="streakDialog = true">
          <b class="q-ml-xs">Показать</b>
        </q-btn>
      </q-card-actions>
    </q-card>
    <q-dialog v-model="claimDialog"  transition-show="scale" transition-hide="scale" @hide="load()">
      <q-card class="bg-white text-center" style="width: 300px">
        <q-card-section class="q-pb-none"  v-if="!claimError">
          <div class="text-h6"><b>Ресурсы получены!</b></div>
          <div class="text-subtitle2"><b>Так держать!</b></div>
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
      <q-card class="q-push full-width text-center ">
        <q-img class="q-mt-sm" src="/images/streak_full.png" width="80px"/>
        <q-card-section>
          <div class="text-h2" style="font-weight: 800"><b>{{ streak.actual_count }}</b></div>
          <div class="text-subtitle1"><b>{{ streak.plural_text }}</b></div>
          <div class="text-caption"><b>Ежедневная серия</b></div>
        </q-card-section>
        <q-card-section>
          <div class="flex full-width justify-center" style="gap: 10px">
            <div v-for="(streakItem, streakItemIndex) in streaks" :key="`streakItemIndex-${streakItemIndex}`"
              class="text-center text-dark">
              <div :class="`text-caption ${(streakItem.is_today) ? 'text-secondary' : ''}`"><b>{{ streakItem.weekday }}</b></div>
              <div :class="`daily-streak text-center text-dark ${ (streakItem.day_count > 0) ? 'has-after' : ''}  q-mt-xs`">
                <q-avatar :size="(streakItem.is_today) ? '32px' : '28px'" :class="`daily-streak-value ${(streakItem.is_inactive) ? 'text-grey' : ''} ${ (streakItem.day_count > 0) ? 'bg-secondary text-white' : ''} ${ (streakItem.is_today > 0) ? 'is-today' : ''}`">
                  <div class="text-subtitle1"> <b>{{ streakItem.monthday }}</b></div>
                </q-avatar>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1" v-if="streak.actual_count > 0"><b>Ты жжёшь!</b></div>
          <div class="text-subtitle1" v-else><b>Нужно поднажать!</b></div>
          <q-btn push v-close-popup class="full-width" color="primary"><b>Продолжить</b></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, watch, toRefs, computed, onActivated, onDeactivated } from 'vue'
import { api } from '../services/index'
import UserResourceBar from '../components/UserResourceBar.vue'
import { useQuest } from '../composables/useQuest'
import { playAudio } from 'src/services/audioService';


const { claimItem } = useQuest()

const streak = ref({})
const streaks = ref([])
const claimDialog = ref(false)
const claimError = ref(false)
const streakDialog = ref(false)

const streakPluralHumanize = (n) => {
  const absN = Math.abs(n)
  const lastDigit = absN % 10
  const lastTwoDigits = absN % 100
  let word = 'дней'
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    word = 'дней'
  } else if (lastDigit === 1) {
    word = 'день'
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    word = 'дня'
  }
  return word
}

const load = async () => {
  const streakListResponse = await api.streak.getList({});
  if(!streakListResponse.error){
    streaks.value = streakListResponse
    const todayIndex = streakListResponse.findIndex((item) => item.is_today)
    streak.value = streakListResponse.find((item) => item.is_today)
    streak.value.actual_count = streaks.value[todayIndex-1].day_count
    streak.value.plural_text = streakPluralHumanize(streak.value.actual_count)
  }
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
})
onDeactivated(() => {
})
</script>
<style lang="scss" scoped>
.daily-streak{
  position: relative;
  &.has-after{
    &:after{
      content: "";
      //position: absolute;
      width: 150%;
      height: 100%;
      top: 0;
      left: 50%;
      background: $secondary;
      z-index: 0;
    }
  }
  .daily-streak-value{
    z-index: 1;
    position: relative;
    &.is-today{
      color: $secondary;
      box-shadow: 0px 0px 0px 2px $secondary;
    }
  }
}
</style>
