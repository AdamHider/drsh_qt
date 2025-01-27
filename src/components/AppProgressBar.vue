<template>
    <div :class="`progress full-width relative-position rounded-borders rounded ${ (props.dark) ? 'bg-white-transparent' : 'bg-grey-4' }`"  :style="`height: ${props.size}`">
      <div class="progress-bar absolute-left" :style="`width: ${value}%`">
        <div :class="`progress-bar-fill rounded-borders bg-light-gradient-${props.color}-to-right`" ></div>
      </div>
      <div v-if="props.backfaceValue > 0" class="backface-progress-bar absolute-left" :style="`width: ${props.backfaceValue}%`">
        <div :class="`backface-progress-bar-fill rounded-borders bg-light-gradient-positive-to-right`" ></div>
      </div>
    </div>
</template>

<script setup>
import { ref, toRefs } from 'vue'
const props = defineProps({
  dark: Boolean,
  value: Number,
  size: String,
  backfaceValue: Number,
  color: String
})
const value = toRefs(props).value
</script>
<style scoped lang="scss">

.progress{
  .progress-bar{
    padding: 4px;
    height: 100%;
    z-index: 1;
    transition: 0.5s all;
    .progress-bar-fill{
      height: 100%;
      border-bottom: 3px solid rgba(0, 0, 0, 0.15);
    }
  }
  .backface-progress-bar{
    padding: 4px;
    height: 100%;
    transition: 0.5s all;
    opacity: 0.5;
    .backface-progress-bar-fill{
      height: 100%;
      border-bottom: 3px solid rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
