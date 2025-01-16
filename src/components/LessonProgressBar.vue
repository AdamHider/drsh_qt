<template>
    <div :class="`lesson-progress position-relative full-width q-pa-none ${ (props.dark) ? 'progress-dark' : ''}`">
      <q-card flat  class="rounded-sm bg-transparent" >
        <q-card-section class="col no-wrap q-px-xs q-pt-sm q-pr-md  q-pb-none">
          <div class="full-width flex" :style="`height: ${props.size}`">
            <span class="star-item"></span>
            <span class="star-item-delimiter relative-position">
              <q-avatar :size="props.size" class="absolute"><img src="/images/star_1.png"></q-avatar>
            </span>
            <span class="star-item"></span>
            <span class="star-item-delimiter relative-position">
              <q-avatar :size="props.size" class="absolute"><img src="/images/star_2.png"></q-avatar>
            </span>
            <span class="star-item"></span>
            <span class="star-item-delimiter relative-position">
              <q-avatar :size="props.size" class="absolute"><img src="/images/star_3.png"></q-avatar>
            </span>
          </div>
          <div :class="`vertical-progress full-width relative-position border-md rounded-borders rounded-xs ${ (props.dark) ? 'bg-dark-transparent' : 'bg-grey-2' }`">
            <div class="progress-bar absolute-left" :style="(props.vertical) ? `height: ${props.value}%;` : `width: ${props.value}%;`">
              <div :class="`progress-bar-fill rounded-borders bg-light-gradient-${color}-to-right`" ></div>
            </div>
            <div class="vertical-progress-delimiters full-width flex absolute-right">
              <span class="vertical-progress-section">
              </span>
              <span class="vertical-progress-delimiter full-height relative-position">
              </span>
              <span class="vertical-progress-section">
              </span>
              <span class="vertical-progress-delimiter full-height relative-position">
              </span>
              <span class="vertical-progress-section">
              </span>
              <span class="vertical-progress-delimiter full-height relative-position">
              </span>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-dialog
        v-model="rewardsDialog"
        position="bottom"
      >
        <q-card class="rounded-b-0">
          <q-list bordered separator>
            <q-item-label header class="q-pb-sm"><b>Награды:</b></q-item-label>
            <q-item dense clickable v-ripple>
              <q-item-section avatar>
                <q-avatar rounded>
                  <img src="/images/star_1.png">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <div class="row q-gutter-sm q-py-sm">
                  <div v-for="(resource, resourceIndex) in reward[1]" :key="resourceIndex" >
                    <q-item :class="`text-left rounded-borders bg-light-gradient-${resource?.color} text-white`" >
                        <q-item-section avatar style="min-width: unset;">
                            <q-img width="25px" :src="resource.image" style="filter: drop-shadow(1px 3px 3px #00000075)"/>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label><b>{{resource.quantity}}</b></q-item-label>
                        </q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-item-section>
            </q-item>

            <q-item dense clickable v-ripple>
              <q-item-section avatar>
                <q-avatar rounded>
                  <img src="/images/star_2.png">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <div class="row q-gutter-sm q-py-sm">
                  <div v-for="(resource, resourceIndex) in reward[2]" :key="resourceIndex" >
                    <q-item :class="`text-left rounded-borders bg-light-gradient-${resource?.color} text-white`" >
                        <q-item-section avatar style="min-width: unset;">
                            <q-img width="25px" :src="resource.image" style="filter: drop-shadow(1px 3px 3px #00000075)"/>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label><b>{{resource.quantity}}</b></q-item-label>
                        </q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-item-section>
            </q-item>

            <q-item dense clickable v-ripple>
              <q-item-section avatar>
                <q-avatar rounded>
                  <img src="/images/star_3.png">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <div class="row q-gutter-sm q-py-sm">
                  <div v-for="(resource, resourceIndex) in reward[3]" :key="resourceIndex" >
                    <q-item dense :class="`text-left rounded-borders  bg-light-gradient-${resource?.color} text-white`" >
                        <q-item-section avatar style="min-width: unset;">
                            <q-img width="25px" :src="resource.image" style="filter: drop-shadow(1px 3px 3px #00000075)"/>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label><b>{{resource.quantity}}</b></q-item-label>
                        </q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card-actions>
            <q-btn push color="primary" @click="rewardsDialog = false" class="full-width">
              Понятно
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
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
  vertical: Boolean,
  size: String
})
const exercise = toRefs(props).exercise
const reward = toRefs(props).reward
const showReward = ref(false)
const tab = ref('threestars')
const tabSelected = ref('threestars')
const color = ref('orange')
const rewardsDialog = ref(false)

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
.lesson-progress{
  --border-color: #{$grey-4};
}
.lesson-progress.progress-dark{
  --border-color: white;
}
.star-item{
  margin: 0 1px;
  &:nth-child(1){
    margin-left: 0px;
    flex: 4;
  }
  &:nth-child(3){
    flex: 4;
  }
  &:nth-child(5){
    margin-right: 0px;
    flex: 2;
  }
}
.star-item-delimiter{
  width: 0px;
  &:before{
  }
  .q-avatar{
    top: -3px;
    left: -15px;
  }
}
.vertical-progress{
  height: 25px;
  border-color: var(--border-color);
  .progress-bar{
    height: 100%;
    padding: 2px;
    .progress-bar-fill{
      height: 100%;
      border-radius: 4px;
      border-bottom: 3px solid rgba(0, 0, 0, 0.15);
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), inset 0px -1px 0px 0px rgba(255, 255, 255, 0.1), inset 0px 1px 0px 0px rgba(255, 255, 255, 0.1);
    }
  }
  .vertical-progress-delimiters{
    overflow: hidden;
    .vertical-progress-delimiter{
      width: 0px;
      background: var(--border-color);
      &:before{
        content: "";
        position: absolute;
        top: 0;
        right: -3px;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-top: 3px solid var(--border-color);
      }
      &:after{
        content: "";
        position: absolute;
        bottom: 0;
        right: -3px;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-bottom: 3px solid var(--border-color);
      }
    }
    .vertical-progress-section{
      margin: 0 1px;
      &:nth-child(1){
        margin-left: 0px;
        flex: 4;
        box-shadow: 0px 0px 0px 2px var(--border-color);
        border-radius: 7px;
      }
      &:nth-child(3){
        flex: 4;
        box-shadow: 0px 0px 0px 2px var(--border-color);
        border-radius: 7px;
      }
      &:nth-child(5){
        flex: 2;
        box-shadow: 0px 0px 0px 2px var(--border-color);
        border-radius: 7px;
        margin-right: 0px;
      }
    }
  }
}
</style>
