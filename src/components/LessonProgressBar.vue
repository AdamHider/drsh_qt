<template>
    <div :class="`lesson-progress position-relative full-width q-pa-none ${ (props.dark) ? 'progress-dark' : ''}`">
      <q-card flat class="rounded-sm bg-transparent" >
        <q-card-section class="col no-wrap q-pl-none q-pr-md  q-py-sm">
          <div class="full-width flex" >
            <span class="star-item"></span>
            <span class="star-item-delimiter relative-position">
              <q-avatar :class="`${(starsLevel == 1) ? 'active' : ''}`" :size="props.size" class="absolute" color="grey-2"><img src="/images/star_1.png"></q-avatar>
            </span>
            <span class="star-item"></span>
            <span class="star-item-delimiter relative-position">
              <q-avatar :class="`${(starsLevel == 2) ? 'active' : ''}`" :size="props.size" class="absolute" color="grey-2"><img src="/images/star_2.png"></q-avatar>
            </span>
            <span class="star-item"></span>
            <span class="star-item-delimiter relative-position">
              <q-avatar :class="`${(starsLevel == 3) ? 'active' : ''}`" :size="props.size" class="absolute" color="grey-2"><img src="/images/star_3.png"></q-avatar>
            </span>
          </div>
          <div :class="`vertical-progress full-width relative-position rounded-borders rounded-xs ${ (props.dark) ? 'bg-white-transparent' : 'bg-grey-4' }`"  :style="`height: ${props.size}`">
            <div class="progress-bar absolute-left" :style="(props.vertical) ? `height: ${props.value}%;` : `width: ${props.value}%`">
              <div :class="`progress-bar-fill rounded-borders bg-light-gradient-${color}-to-right`" ></div>
            </div>
          </div>
        </q-card-section>
        <div v-if="!props.compact" :class="`flex justify-between items-center q-pa-sm${ (props.dark) ? 'text-white' : '' }`">
          <div class="text-left">
            <span class="text-caption">Изучено: </span>
            <span><b :class="(props.value > 0 && props.value < 100) ? 'text-warning': ''">{{(props.value) ? props.value : 0}}%</b></span>
          </div>
          <div>
            <q-btn flat round @click="rewardsDialog = true" :color="(props.dark) ? 'white' : 'primary'" icon="help_outline"/>
          </div>
        </div>
      </q-card>
      <q-dialog
        v-if="!props.compact"
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
import { ref, toRefs, onMounted } from 'vue'
import { CONFIG } from '../config.js'

const props = defineProps({
  exercise: Object,
  reward: Object,
  dark: Boolean,
  value: Number,
  vertical: Boolean,
  size: String,
  compact: Boolean
})
const exercise = toRefs(props).exercise
const reward = toRefs(props).reward
const showReward = ref(false)
const tab = ref('threestars')
const tabSelected = ref('threestars')
const color = ref('orange')
const rewardsDialog = ref(false)
const starsLevel = ref(0)

const selectTab = (name) => {
  if (tabSelected.value === name) {
    showReward.value = !showReward.value
  } else {
    showReward.value = true
  }
  tabSelected.value = name
}

onMounted(() => {
  if(props.value >= 40 && props.value < 80) starsLevel.value = 1
  if(props.value >=80 && props.value < 100) starsLevel.value = 2
  if(props.value == 100) starsLevel.value = 3
})
</script>
<style scoped lang="scss">
.lesson-progress{
  --border-color: #{$grey-3};
}
.lesson-progress.progress-dark{
  --border-color: white;
  .star-item-delimiter .q-avatar:not(.active){
    filter: grayscale(1) brightness(0.8);
    box-shadow: 0 0 0 3px #e0e0e038;
  }
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
    z-index: 1;
    top: 0px;
    left: -15px;
    box-shadow: 0 0 0 2px #ffaa2c;
    background: white !important;
    &:not(.active) {
      box-shadow: 0 0 0 2px #e0e0e0 ;
      img{
        filter: grayscale(1) brightness(0.8);
      }
    }
  }
}

.vertical-progress{
  .progress-bar{
    padding: 4px;
    height: 100%;
    .progress-bar-fill{
      height: 100%;
      border-radius: 4px;
      border-bottom: 3px solid rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
