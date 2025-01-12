<template>
  <q-card flat class="bg-transparent rounded-sm rounded-borders full-height">
    <q-card-section class="flex full-height position-relative q-pa-none">
      <div class="vertical-progress-sections full-height flex column justify-around q-py-sm" style="margin-right: -1px;">
        <div class="star-item bg-dark-transparent col flex items-center rounded-sm rounded-r-0 q-px-xs">
          <q-avatar size="22px"><img src="https://cdn-icons-png.flaticon.com/128/7656/7656139.png"></q-avatar>
        </div>
        <div class="star-item bg-dark-transparent col flex items-center rounded-sm rounded-r-0 q-px-xs ">
          <q-avatar size="22px"><img src="https://cdn-icons-png.flaticon.com/128/7656/7656139.png"></q-avatar>
        </div>
        <div class="star-item bg-dark-transparent col flex items-center rounded-sm rounded-r-0 q-px-xs ">
          <q-avatar size="22px"><img src="https://cdn-icons-png.flaticon.com/128/7656/7656139.png"></q-avatar>
        </div>
      </div>
      <div class="vertical-progress full-height relative-position rounded-borders bg-dark-transparent">
        <div class="progress-bar absolute-bottom" :style="`height: ${props.value}%;`">
          <div class="progress-bar-fill rounded-borders"></div>
        </div>
        <div class="vertical-progress-delimiters full-height full-width justify-around flex column q-py-sm absolute-right" style="margin-right: -1px;">
          <span class="vertical-progress-section"/>
          <span class="vertical-progress-delimiter"/>
          <span class="vertical-progress-section"/>
          <span class="vertical-progress-delimiter"/>
          <span class="vertical-progress-section"/>
        </div>
      </div>
    </q-card-section>

    <div v-if="reward" class="flex justify-center q-gutter-sm ">
      <div v-for="(resource, resourceIndex) in reward[2]" :key="resourceIndex" >
        <q-item class="text-left rounded-borders bg-dark-transparent-50" >
            <q-item-section avatar >
                <q-img width="25px" :src="resource.image" style="filter: hue-rotate(0deg) drop-shadow(1px 3px 3px #00000075)"/>
            </q-item-section>
            <q-item-section>
                <q-item-label><b>{{resource.quantity}}</b></q-item-label>
                <q-item-label class="text-sm"><b>{{resource.title}}</b></q-item-label>
            </q-item-section>
        </q-item>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, watch, toRefs, onActivated, onDeactivated } from 'vue'

const props = defineProps({
  exercise: Object,
  reward: Object,
  dark: Boolean,
  value: Number
})
const exercise = toRefs(props).exercise
const reward = toRefs(props).reward

</script>
<style scoped lang="scss">
.star-item{
  border: 1px solid rgba(255, 255, 255, 0.28);
  margin: 2px 0;
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
  border: 1px solid rgba(255, 255, 255, 0.28);
  .progress-bar{
    width: 100%;
    padding: 2px;
    .progress-bar-fill{
      background: red;
      height: 100%;
    }
  }
  .vertical-progress-delimiters{
    .vertical-progress-delimiter{
      height: 1px;
      background: rgba(255, 255, 255, 0.15);
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
