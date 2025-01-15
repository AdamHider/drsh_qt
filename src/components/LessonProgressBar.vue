<template>
    <div class="position-relative q-pa-none">
      <q-card flat  class="rounded-sm bg-transparent" >
        <q-card-section class="col no-wrap q-pa-xs ">
          <div class="vertical-progress full-width relative-position border-md rounded-borders rounded-xs bg-dark-transparent">
            <div class="progress-bar absolute-left" :style="(props.vertical) ? `height: ${props.value}%;` : `width: ${props.value}%;`">
              <div :class="`progress-bar-fill rounded-borders bg-light-gradient-${color}-to-top`" ></div>
            </div>
            <div class="vertical-progress-delimiters full-width justify-around flex q-px-sm absolute-right">
              <span class="vertical-progress-section">
              </span>
              <span class="vertical-progress-delimiter full-height bg-white relative-position">
                <q-avatar size="22px" class=""><img src="https://cdn-icons-png.flaticon.com/128/7656/7656139.png"></q-avatar>
              </span>
              <span class="vertical-progress-section">
              </span>
              <span class="vertical-progress-delimiter full-height bg-white relative-position">
                <q-avatar size="22px" class=" absolute"><img src="https://cdn-icons-png.flaticon.com/128/7656/7656139.png"></q-avatar>
              </span>
              <span class="vertical-progress-section">
              </span>
              <span class="vertical-progress-delimiter full-height bg-white relative-position">
                <q-avatar size="28px" class=""><img src="https://cdn-icons-png.flaticon.com/128/18587/18587906.png"></q-avatar>
              </span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
</template>

<script setup>
import { ref, toRefs } from 'vue'
import { CONFIG } from '../config.js'

const props = defineProps({
  exercise: Object,
  reward: Object,
  dark: Boolean,
  value: Number,
  vertical: Boolean
})
const exercise = toRefs(props).exercise
const reward = toRefs(props).reward
const showReward = ref(false)
const tab = ref('threestars')
const tabSelected = ref('threestars')
const color = ref('orange')

const selectTab = (name) => {
  if (tabSelected.value === name) {
    showReward.value = !showReward.value
  } else {
    showReward.value = true
  }
  tabSelected.value = name
}
</script>
<style scoped lang="scss">
.star-item{
  border: 1px solid rgba(255, 255, 255, 0.28);
  margin: 0 2px;
  min-height: unset;
  &:nth-child(1){
    flex: 5;
  }
  &:nth-child(2){
    flex: 3;
  }
  &:nth-child(3){
    flex: 2;
  }
}
.vertical-progress{
  height: 25px;
  .progress-bar{
    height: 100%;
    padding: 2px;
    .progress-bar-fill{
      height: 100%;
      border-radius: 4px;
    }
  }
  .vertical-progress-delimiters{
    .vertical-progress-delimiter{
      width: 2px;
      .q-avatar{
        top: -25px;
        left: -10px;
      }
    }
    .vertical-progress-section{
      margin: 0 2px;
      &:nth-child(1){
        flex: 4;
      }
      &:nth-child(3){
        flex: 4;
      }
      &:nth-child(5){
        flex: 2;
      }
    }
  }
}
</style>
