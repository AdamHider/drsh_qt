<template>
      <div class="q-pa-sm row ">
        <div class="col-5 q-pa-sm">
          <q-card :class="`q-push full-height bg-light-gradient-${streak.color} text-white`" style="background-image: url('/images/streak_bg.jpg'); background-position: 90% bottom; background-size: cover;">
            <q-card-section >
              <div class="text-subtitle2"><b>Серия</b></div>
              <span class="text-h4" style="line-height: 1; font-weight: 800;">{{ streak.quantity }}</span> <span><b>дня</b></span>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-7 q-pa-sm" v-if="daily_goal">
          <q-card class="q-push full-height text-white bg-gradient-primary">
            <q-card-section class="q-pb-sm">
              <div class="text-subtitle2"><b>Цель на сегодня</b></div>
              <div class="text-sm"><b>{{ daily_goal.description }}</b></div>
            </q-card-section>
            <q-card-section class="q-pt-none q-px-sm q-pb-sm">
                <div class="flex full-width q-px-sm q-pb-sm bg-dark-transparent rounded-sm" style="gap: 4px;">
                  <div v-for="(dailyGoalBar, dailyGoalBarIndex) in dailyGoalBars" :key="`barIndex${dailyGoalBarIndex}`" style="flex: 1; height: 18px;" >
                    <q-chip :class="`q-push bg-${(dailyGoalBar.isFilled) ? 'gradient-gold' : 'grey'} full-height full-width rounded-xs q-my-none q-pa-none`"/>
                  </div>
                </div>
            </q-card-section>

          </q-card>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, toRefs, computed, onDeactivated, onMounted } from 'vue'

const props = defineProps({
  streak: Object,
  daily_goal: Object
})
const streak = toRefs(props).streak
const daily_goal = toRefs(props).daily_goal

const dailyGoalBars = computed(() => {
  const result = []
  const totalBars = daily_goal.value.value
  let isFilled = true
  for(var i = 1; i <= totalBars; i++){
    if((i > daily_goal.value.progress)){
      isFilled = false
    }
    result.push({
      index: i,
      isFilled: isFilled,
    })
  }
  return result
})
</script>
