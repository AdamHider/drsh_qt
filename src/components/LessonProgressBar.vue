<template>
    <div :class="`lesson-progress position-relative full-width q-pa-none ${ (props.dark) ? 'progress-dark' : ''} ${(exercise && exercise.finished_at) ? 'is-finished' : ''}`">
      <q-card flat class="rounded bg-transparent" >
        <q-card-section class="col no-wrap q-pl-none q-pr-md  q-py-sm">
          <div class="full-width flex" >
            <span class="star-item"></span>
            <span class="star-item-delimiter relative-position">
                <img :src="(starsLevel >= 1) ? '/images/star.png' : '/images/star_inactive.png'" :width="props.size" :class="(starsLevel >= 1) ? 'gained' : ''">
            </span>
            <span class="star-item"></span>
            <span class="star-item-delimiter relative-position">
                <img :src="(starsLevel >= 2) ? '/images/star.png' : '/images/star_inactive.png'" :width="props.size" :class="(starsLevel >= 2) ? 'gained' : ''">
            </span>
            <span class="star-item"></span>
            <span class="star-item-delimiter relative-position">
                <img :src="(starsLevel == 3) ? '/images/star.png' : '/images/star_inactive.png'" :width="props.size" :class="(starsLevel == 3) ? 'gained' : ''">
            </span>
          </div>
          <q-progress-bar :dark="props.dark" :value="value" :backfaceValue="backfaceValue" :size="props.size" :color="color"/>
        </q-card-section>
        <div v-if="!props.compact" :class="`flex justify-between items-center q-pa-sm${ (props.dark) ? 'text-white' : '' }`">
          <div v-if="exercise && exercise.finished_at" class="text-left">
            <span class="text-caption text-positive"><b>Изучено</b> <q-icon name="check_circle"/></span>
          </div>
          <div v-else class="text-left">
            <span class="text-caption">Изучено: </span>
            <span><b :class="(value > 0 && value < 100) ? 'text-warning': ''">{{(value) ? value : 0}}%</b></span>
          </div>
          <div v-if="reward">
            <q-btn flat round @click="rewardsDialog = true" :color="(props.dark) ? 'white' : 'primary'" icon="help_outline"  @click.stop="playAudio('click')"/>
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
            <q-item dense clickable v-ripple >
              <q-item-section>
                <div class="row q-gutter-sm q-py-sm">
                  <div v-for="(resource, resourceIndex) in reward[3]" :key="resourceIndex">
                    <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card-actions>
            <q-btn push color="primary" @click="rewardsDialog = false" class="full-width"  @click.stop="playAudio('click')">
              Понятно
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
</template>

<script setup>
import { ref, toRefs, toRef, watch, onMounted, onActivated } from 'vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import { playAudio } from 'src/services/audioService';

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
const value = ref(0);


const color = ref('orange')
const rewardsDialog = ref(false)
const starsLevel = ref(0)
const backfaceValue = ref(0)

const calculateStarsValue = () => {
  if(props.value >= 40 && props.value < 80) starsLevel.value = 1
  if(props.value >=80 && props.value <= 99) starsLevel.value = 2
  if(props.value >= 100) starsLevel.value = 3
}
const calculateBackface = () => {
  if(exercise.value && exercise.value.data?.totals?.prev_points) {
    backfaceValue.value = exercise.value.data.totals.prev_points / exercise.value.data.totals.max_points * 100
  }

  if(backfaceValue.value > 100) {backfaceValue.value = 100}
}

watch(() => props.value, (newValue) => {
  if(exercise.value?.finished_at) {
    color.value = 'positive'
  } else {
    color.value = 'orange'
  }
  calculateStarsValue()
  calculateBackface()
  value.value = props.value
  if(value.value > 100) value.value = 100
})
watch(() => exercise?.value?.data.totals, (newValue) => {
  if(exercise.value?.finished_at) {
    color.value = 'positive'
  } else {
    color.value = 'orange'
  }
  calculateStarsValue()
  calculateBackface()
  value.value = props.value
  if(value.value > 100) value.value = 100
})
onMounted(() => {
  if(exercise.value?.finished_at) {
    color.value = 'positive'
  } else {
    color.value = 'orange'
  }
  calculateStarsValue()
  calculateBackface()
  value.value = props.value
  if(value.value > 100) value.value = 100
})



</script>
<style scoped lang="scss">
.lesson-progress{
  --border-color: #{$grey-3};
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
  img{
    position: absolute;
    z-index: 10;
    top: 0px;
    left: -15px;
    overflow: visible;
    scale: 1.1;
    &.gained{
      filter: drop-shadow(rgba(0, 0, 0, 0.4) 0px 2px 3px);
      scale: 1.1;
    }
  }
}

</style>
