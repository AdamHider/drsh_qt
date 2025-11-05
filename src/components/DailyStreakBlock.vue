<template>
    <q-card :class="`${(props.lite) ? 'no-shadow bg-grey-3 rounded-sm' : 'q-push'} full-width text-left`"  @click="streakDialog = true" v-if="today.streak" @click.stop="playAudio('click')">
        <q-card-section :class="` q-px-sm q-py-none ${(today.streak.day_count == 1 && !today.streak.is_defended) ? 'bg-light-gradient-grey' : 'bg-light-gradient-flame'} text-white`">
          <q-item dense class="q-pa-none ">
            <q-item-section avatar >
              <q-img class="q-mt-sm" src="/images/streak_full.png" width="35px" style="margin-top: -15px; filter: drop-shadow(0px 2px 5px #ffcf97);"/>
            </q-item-section>
            <q-item-section>
              <q-item-label><b>Серия </b><span class="text-h5" style="font-weight: 800"><b>{{ today.streak.day_count }}</b></span> <b>{{ today.streak.plural_text }}</b>
              </q-item-label>
            </q-item-section>
            <q-item-section class="text-right q-pr-sm">
              <div v-if="today.streak.day_count == 1 && !today.streak.is_defended" class="text-caption"><b>Рейтинг падает!</b></div>
              <div v-else class="text-caption"><b>Рейтинг растёт!</b></div>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <div class="flex full-width justify-around">
            <div v-for="(streakItem, streakItemIndex) in streaks" :key="`streakItemIndex-${streakItemIndex}`" class="text-center text-dark" style="flex: 1">
              <div :class="`text-caption ${(streakItem.is_today) ? 'text-flame' : (streakItem.is_inactive) ? 'text-grey' : ''}`"><b>{{ streakItem.weekday }}</b></div>
              <div :class="`daily-streak text-center text-dark ${(streakItem.streak?.id && streakItem?.streak?.has_previous) ? 'has-previous' : ''} q-mt-xs`">
                <q-avatar size="30px" :class="`daily-streak-value ${(streakItem.is_inactive) ? 'text-grey' : ''} ${ (streakItem.streak?.is_defended) ? 'bg-flame text-white' : 'bg-white'} ${ (streakItem.is_today) ? 'is-today' : ''}`">
                  <div class="text-subtitle2"><b>{{ streakItem.monthday }}</b></div>
                </q-avatar>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator v-if="!props.lite" />
        <q-card-section class="q-item-blinking blink-red relative-position q-pa-sm flex no-wrap items-end" v-if="today.quest && !today.streak.is_defended">
          <div v-if="!props.lite"  class="arrow-top"></div>
          <div class="full-width">
            <div class="flex justify-between q-pb-xs items-center no-wrap">
              <div class="text-caption q-ml-sm q-pr-sm" style="line-height: 1.4;">
                <b>
                  <span v-if="today.quest.code == 'total_lessons'">Изучи</span>
                  <span v-else-if="today.quest.code == 'resource'">Собери</span>
                  <span v-if="today.quest.progress > 0">ещё</span> {{ (today.quest.value-today.quest.progress).toLocaleString() }}
                {{ today.quest.plural_text }}
                для <span v-if="today.streak.day_count == 1 && !today.streak.is_defended">начала</span><span v-else>защиты</span> серии!</b>
              </div>
              <div class="text-caption q-mr-lg"><b>{{ today.quest.progress }}/{{ today.quest.value }}</b></div>
            </div>
            <q-progress-bar
              :value="today.quest.progress/today.quest.value*100"
              size="24px"
              :color="(today.quest.progress >= today.quest.value) ? 'positive' : 'flame'"
            />
          </div>
          <q-img class="q-mt-sm" src="/images/streak_full.png" width="35px"  style="margin-left: -25px; filter: drop-shadow(0px 2px 5px #ffcf97);"/>
        </q-card-section>
    </q-card>

    <q-dialog v-model="streakDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="q-push full-width text-center ">
        <q-card-section :class="`q-item-blinking  ${(today.streak.day_count == 1 && !today.streak.is_defended) ? 'bg-light-gradient-grey' : 'bg-light-gradient-flame'} q-pa-none  text-white`">
          <q-item class="q-py-none text-left">
            <q-item-section >
              <div class="text-subtitle2"><b>Ежедневная серия</b></div>
            </q-item-section>
            <q-item-section side>
              <q-btn size="sm" class="text-shadow-none rounded-xs" padding="xs" push color="white" text-color="flame" icon="question_mark" @click="infoDialog = true" style="z-index: 1" @click.stop="playAudio('click')"></q-btn>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section class="q-pb-none q-pt-sm text-left">
          <q-item class="q-px-none">
            <q-item-section avatar>
              <q-img style="margin-top: -30px; filter: drop-shadow(0px 2px 4px #0000006b);" src="/images/streak_full.png" width="80px" />
            </q-item-section>
            <q-item-section>
              <div>
                <span class="text-h2 text-flame" style="font-weight: 800"><b>{{ today.streak.day_count }}</b></span>
                <span class="text-subtitle1 q-ml-xs"><b>{{ today.streak.plural_text }}</b></span>
              </div>
              <div class="text-subtitle1" v-if="today.streak.is_defended"><b>Ты жжёшь!</b></div>
              <div class="text-subtitle1" v-else><b>Защити серию!</b></div>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section class="q-py-none">
            <div class="row q-gutter-sm items-center justify-center" >
              <div v-for="(modifier, modifierIndex) in today.modifiers" :key="`modifierIndex-${modifierIndex}`" >
                <q-chip class="q-push" color="positive" text-color="white">
                  <div class="text-sm"><b>{{ modifier.setting.title }}:</b></div>
                  <div class="text-caption q-ml-xs"><b>{{ modifier.value }}</b></div>
                </q-chip>
              </div>
              <q-chip class="q-push" v-if="today.streak.is_defended || today.streak.day_count*1 > 1" color="positive" text-color="white">
                <div class="text-sm"><b>Рейтинг растёт!</b></div>
              </q-chip>
              <q-chip class="q-push" v-else color="negative" text-color="white">
                <div class="text-sm"><b>Рейтинг падает!</b></div>
              </q-chip>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-sm">
          <div class="flex full-width justify-around no-wrap">
            <div v-for="(streakItem, streakItemIndex) in streaks" :key="`streakItemIndex-${streakItemIndex}`" style="flex: 1"
              class="text-center text-dark relative-position">
              <div :class="`text-caption ${(streakItem.is_today) ? 'text-flame' : ''}`"><b>{{ streakItem.weekday }}</b></div>
              <div :class="`daily-streak text-center text-dark ${(streakItem.streak?.id && streakItem.streak?.has_previous) ? 'has-previous' : ''} q-mt-xs`">
                <q-avatar size="30px" :class="`daily-streak-value ${(streakItem.is_inactive) ? 'text-grey' : ''} ${ (streakItem.streak?.is_defended) ? 'bg-flame text-white' : 'bg-white'} ${ (streakItem.is_today) ? 'is-today' : ''}`">
                  <div class="text-subtitle2"> <b>{{ streakItem.monthday }}</b></div>
                </q-avatar>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="relative-position q-py-sm text-left" v-if="today.quest">
          <div v-if="!today.streak.is_defended" class="full-width text-center q-pb-xs"><b>Цель дня:</b></div>
          <div v-if="!today.streak.is_defended" class="flex no-wrap items-end ">
            <div class="arrow-top"></div>
            <div class="full-width">
              <div class="flex justify-between q-pb-xs items-end no-wrap">
                <div class="text-caption q-ml-sm" style="line-height: 1.4;">
                  <b>
                  <span v-if="today.quest.code == 'total_lessons'">Изучи</span>
                  <span v-else-if="today.quest.code == 'resource'">Собери</span>
                  <span v-if="today.quest.progress > 0">ещё</span> {{ (today.quest.value-today.quest.progress).toLocaleString() }}
                  {{ today.quest.plural_text }}
                  для <span v-if="today.streak.day_count == 1 && !today.streak.is_defended">начала</span><span v-else>защиты</span> серии!</b>
                </div>
                <div class="text-subtitle2 q-mr-lg"><b>{{ today.quest.progress }}/{{ today.quest.value }}</b></div>
              </div>
              <q-progress-bar
                :value="today.quest.progress/today.quest.value*100"
                size="24px"
                :color="(today.quest.progress >= today.quest.value) ? 'positive' : 'flame'"
              />
            </div>
            <q-img class="q-mt-sm" src="/images/streak_full.png" width="35px"  style="margin-left: -25px; filter: drop-shadow(0px 2px 5px #ffcf97);"/>
          </div>
          <div v-else class="text-center full-width">
            <div class="text-subtitle1"><b>Так держать!</b></div>
            <div class="text-caption"><b>Серия защищена!</b></div>
          </div>
        </q-card-section>
        <q-card-section v-if="today.streak.reward?.length > 0  && !today.streak.is_defended" class="q-pt-sm">
          <div class="full-width q-pb-sm rounded-sm bg-grey-2">
            <div class="text-center text-subtitle2 q-pa-xs"><b>Награда: </b></div>
            <div class="row q-gutter-sm items-center justify-center">
              <div v-for="(resource, resourceIndex) in today.streak.reward" :key="`resource-${resourceIndex}`" >
                  <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-btn push v-close-popup class="full-width" color="primary" @click.stop="playAudio('click')"><b>Продолжить</b></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="infoDialog" maximized transition-show="fade" transition-hide="fade" style="z-index: 10000">
      <div class="bg-dark-gradient-cosmic full-width full-height row justify-center items-center">
        <q-list class="text-white full-width column">
          <q-item class="self-start q-my-lg">
            <q-item-section avatar></q-item-section>
            <q-item-section>
              <div class="text-subtitle1"><b>Заходи каждый день!</b></div>
              <div class="text-caption"><b>И защищай серию, выполняя цель дня</b></div>
            </q-item-section>
          </q-item>
          <q-item class="q-my-lg">
            <q-item-section avatar></q-item-section>
            <q-item-section>
              <div class="text-subtitle1"><b>Получай бонусы за серию!</b></div>
              <div class="text-caption"><b>Чем больше серия, тем выше ежедневный бонус</b></div>
            </q-item-section>
          </q-item>
          <q-item class="self-start q-my-lg">
            <q-item-section avatar></q-item-section>
            <q-item-section>
              <div class="text-subtitle1"><b>Пропускать серию опасно!</b></div>
              <div class="text-caption"><b>При пропуске серии, накопленные бонусы тратятся, а рейтинг начинает ежедневно падать</b></div>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="full-width  text-center">
          <q-btn v-close-popup flat color="white" @click.stop="playAudio('click')"><b>Нажми, чтобы продолжить</b></q-btn>
        </div>
      </div>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { api } from '../services/index'
import UserResourceBar from '../components/UserResourceBar.vue'
import { playAudio } from 'src/services/audioService';

const props = defineProps({
  lite: Boolean
})

const streaks = ref([])
const today = ref({})
const claimDialog = ref(false)
const claimError = ref(false)
const streakDialog = ref(false)
const infoDialog = ref(false)
const isLoading = ref(false)

const questTargetsHumanizer = ref({
  total_lessons: ['планет','планету','планеты',],
  resource: ['звёзд','звезду','звезды',]
})

const pluralHumanize = (n, wordsConfig) => {
  const absN = Math.abs(n)
  const lastDigit = absN % 10
  const lastTwoDigits = absN % 100
  let word = wordsConfig[0]
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    word = wordsConfig[0]
  } else if (lastDigit === 1) {
    word = wordsConfig[1]
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    word = wordsConfig[2]
  }
  return word
}

const load = async () => {
  isLoading.value = true
  const streakListResponse = await api.streak.getList({});
  if(!streakListResponse.error){
    streaks.value = streakListResponse
    today.value = streakListResponse.find((item) => item.is_today)
    today.value.streak.plural_text = pluralHumanize(today.value.streak.day_count, ['дней','день','дня'])
    if(today.value.quest){
      today.value.quest.plural_text = pluralHumanize(today.value.quest.value - today.value.quest.progress, questTargetsHumanizer.value[today.value.quest.code])
    }
  }
  isLoading.value = false
}

onActivated(async () => {
  if(isLoading.value) return
  await load()
})
onMounted(async () => {
  if(isLoading.value) return
  await load()
})
onBeforeRouteLeave((to, from) => {
  if (infoDialog.value) {
    infoDialog.value = false
    return false
  }
  if (streakDialog.value) {
    streakDialog.value = false
    return false
  }
  return true
})
</script>
<style lang="scss" scoped>
.daily-streak{
  position: relative;
  &.has-previous{
    &:before{
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      right: 50%;
      background: $flame;
      z-index: 0;
    }
  }
  .daily-streak-value{
    z-index: 1;
    position: relative;
    &.is-today{
      color: $flame;
      box-shadow: 0px 0px 0px 2px $flame;
    }
  }
}
.arrow-top{
  position: absolute;
  left: calc(50% - 6px);
  bottom: 100%;
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  border-top: 6px solid transparent;
  border-bottom: 6px solid $flame;
}
</style>
