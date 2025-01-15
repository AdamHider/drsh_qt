<template>
    <div class="flex no-wrap justify-end full-height position-relative q-pa-none">
      <transition
          appear
          enter-active-class="animated fadeInLeft"
          leave-active-class="animated fadeOutLeft"
      >
        <q-card v-if="showReward"  flat class="q-mr-sm bg-transparent" style="padding-top: 30px;">
          <img :src="`${CONFIG.API_HOST}/image/common/${tab}.png`" style="position: absolute; top: -30px;  z-index: 20;  width: 80%;  left: 10%; "/>
          <q-card-section class="q-pa-none">
            <q-tab-panels
              v-model="tab"
              animated
              transition-prev="fade"
              transition-next="fade"
              class="rounded-borders full-height"
              style="padding-top: 15px;"
            >
                <q-tab-panel name="threestars" class="position: relative;">
                  <div class="text-h6"><b>Отлично</b></div>
                  <div class="text-caption">За три <q-avatar size="22px"><img src="https://cdn-icons-png.flaticon.com/128/7656/7656139.png"></q-avatar> вы получите:</div>
                  <q-separator/>
                  <div class="row q-gutter-sm q-py-sm">
                    <div v-for="(resource, resourceIndex) in reward[3]" :key="resourceIndex" >
                      <q-item :class="`text-left rounded-borders bg-light-gradient-${resource?.color} text-white`" >
                          <q-item-section avatar style="min-width: unset;">
                              <q-img width="25px" :src="resource.image" style="filter: drop-shadow(1px 3px 3px #00000075)"/>
                          </q-item-section>
                          <q-item-section>
                              <q-item-label><b>{{resource.quantity}}</b></q-item-label>
                              <q-item-label class="text-sm"><b>{{resource.title}}</b></q-item-label>
                          </q-item-section>
                      </q-item>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="twostars">
                  <div class="text-h6"><b>Хорошо</b></div>
                  <div class="text-caption">За две <q-avatar size="22px"><img src="https://cdn-icons-png.flaticon.com/128/7656/7656139.png"></q-avatar> вы получите:</div>
                  <q-separator/>
                  <div class="row q-gutter-sm q-py-sm">
                    <div v-for="(resource, resourceIndex) in reward[2]" :key="resourceIndex" >
                      <q-item :class="`text-left rounded-borders bg-light-gradient-${resource?.color} text-white`" >
                          <q-item-section avatar style="min-width: unset;">
                              <q-img width="25px" :src="resource.image" style="filter: drop-shadow(1px 3px 3px #00000075)"/>
                          </q-item-section>
                          <q-item-section>
                              <q-item-label><b>{{resource.quantity}}</b></q-item-label>
                              <q-item-label class="text-sm"><b>{{resource.title}}</b></q-item-label>
                          </q-item-section>
                      </q-item>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="onestar">
                  <div class="text-h6"><b>Можно и лучше</b></div>
                  <div class="text-caption">За одну <q-avatar size="22px"><img src="https://cdn-icons-png.flaticon.com/128/7656/7656139.png"></q-avatar> вы получите:</div>
                  <q-separator/>
                  <div class="row q-gutter-sm q-py-sm">
                    <div v-for="(resource, resourceIndex) in reward[1]" :key="resourceIndex" >
                      <q-item :class="`text-left rounded-borders bg-light-gradient-${resource?.color} text-white`" >
                          <q-item-section avatar style="min-width: unset;">
                              <q-img width="25px" :src="resource.image" style="filter: drop-shadow(1px 3px 3px #00000075)"/>
                          </q-item-section>
                          <q-item-section>
                              <q-item-label><b>{{resource.quantity}}</b></q-item-label>
                              <q-item-label class="text-sm"><b>{{resource.title}}</b></q-item-label>
                          </q-item-section>
                      </q-item>
                    </div>
                  </div>
                </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </transition>
      <q-card flat dark class="column bg-transparent" >
        <q-card-section class="flex col no-wrap q-pa-none">
          <q-tabs
              v-model="tab"
              stretch
              indicator-color="transparent"
              active-class="bg-primary"
              content-class="column q-py-sm"
            >
            <q-tab name="threestars" :class="`star-item ${(props.dark) ? 'bg-dark-transparent' : 'bg-white'} rounded-sm rounded-r-0 q-pa-none`" @click="selectTab('threestars')">
                <q-avatar size="22px"><img src="https://cdn-icons-png.flaticon.com/128/7656/7656139.png"></q-avatar>
            </q-tab>
            <q-tab  name="twostars" :class="`star-item ${(props.dark) ? 'bg-dark-transparent' : 'bg-white'} rounded-sm rounded-r-0 q-pa-none`" @click="selectTab('twostars')">
                <q-avatar size="22px"><img src="https://cdn-icons-png.flaticon.com/128/7656/7656139.png"></q-avatar>
            </q-tab>
            <q-tab  name="onestar" :class="`star-item ${(props.dark) ? 'bg-dark-transparent' : 'bg-white'} rounded-sm rounded-r-0 q-pa-none`" @click="selectTab('onestar')">
                <q-avatar size="22px"><img src="https://cdn-icons-png.flaticon.com/128/7656/7656139.png"></q-avatar>
            </q-tab>

          </q-tabs>
          <div class="vertical-progress full-height relative-position border-md rounded-borders rounded-xs bg-dark-transparent">
            <div class="progress-bar absolute-bottom" :style="`height: ${props.value}%;`">
              <div :class="`progress-bar-fill rounded-borders bg-light-gradient-${color}-to-top`" ></div>
            </div>
            <div class="vertical-progress-delimiters full-height full-width justify-around flex column q-py-sm absolute-right" style="margin-right: -1px;">
              <span class="vertical-progress-section"/>
              <span class="vertical-progress-delimiter bg-white"/>
              <span class="vertical-progress-section"/>
              <span class="vertical-progress-delimiter bg-white"/>
              <span class="vertical-progress-section"/>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="justify-center">
            <q-btn v-if="!showReward" icon="chevron_left" flat @click="showReward = true" color="dark" class="bg-white"></q-btn>
            <q-btn v-else icon="chevron_right" flat @click="showReward = false" color="dark" class="bg-warning"></q-btn>
        </q-card-actions>
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
  value: Number
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
  margin: 2px 0;
  min-height: unset;
  &:nth-child(1){
    flex: 1;
  }
  &:nth-child(2){
    flex: 2;
  }
  &:nth-child(3){
    flex: 3;
  }
}
.vertical-progress{
  width: 20px;
  overflow: hidden;
  .progress-bar{
    width: 100%;
    padding: 2px;
    .progress-bar-fill{
      height: 100%;
      border-radius: 4px;
    }
  }
  .vertical-progress-delimiters{
    .vertical-progress-delimiter{
      height: 1px;
    }
    .vertical-progress-section{
      margin: 2px 0;
      &:nth-child(1){
        flex: 1;
      }
      &:nth-child(3){
        flex: 2;
      }
      &:nth-child(5){
        flex: 3;
      }
    }
  }
}
</style>
