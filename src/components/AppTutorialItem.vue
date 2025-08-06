<template>
  <div ref="tutorialHighlight">
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div class="tutorial-highlight" v-if="tutorialDialog">
        <div class="highlight-background" @click="setIndexNext()"></div>
        <div :class="`highlight-tooltip ${(props.position == 'top') ? 'top' : 'bottom'} ${(props.positionInline == 'right') ? 'right' : 'left'}`"
          :style="`
            ${(positionFixed && positionFixed.bottom !== null) ? 'position: fixed; bottom:'+positionFixed.bottom+'px; top: unset; width: 100%;' : ''}
            ${(positionFixed && positionFixed.left !== null) ? 'position: fixed; left:'+positionFixed.left+'px; right: unset; width: 100%;' : ''}
          `"
        >
          <q-card class="bg-white bg-white q-ma-md" style="min-width: 250px;">
            <q-card-section class="q-pa-none">
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img src="/images/characters/codex_avatar.png"/>
                  </q-avatar>
                </q-item-section>
                <q-item-section class="text-left text-dark" style="text-transform: initial; white-space: wrap;">
                  <div class="text-subtitle2"><b>{{ props.title }}</b></div>
                  <div class="text-caption">{{ props.description }}</div>
                </q-item-section>
              </q-item>
            </q-card-section>
            <q-card-actions class="flex justify-end">
              <q-btn push color="primary" label="Next" @click="setIndexNext()"/>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, watch } from 'vue'
import { useTutorial } from '../composables/useTutorial'

const { tutorial, setIndexNext } = useTutorial()

const tutorialDialog = ref(false)
const tutorialHighlight = ref(null)

const props = defineProps({
  title: String,
  description: String,
  index: Number,
  position: String,
  positionInline: String,
  positionFixed: Object
})

const render = () => {
  tutorialDialog.value = false
  if(!tutorial.status) return
  if(tutorial.index == props.index) {
    tutorialHighlight.value.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
    setTimeout(() => {
      tutorialDialog.value = true
    }, 350)
  }
}

watch(() => tutorial.status, () => {
  render()
})
watch(() => tutorial.index, () => {
  render()
})
onMounted(() => {
  render()
})
onActivated(() => {
  render()
})
</script>
<style scoped lang="scss">
.tutorial-highlight{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 0px 5000px #00000075;
  border-radius: 15px;
  z-index: 2000;
  transition: 0.3s all ease;
  .highlight-tooltip{
    position: absolute;
    &.top{
      bottom: 100%;
    }
    &.bottom{
      top: 100%;
    }
    &.left{
      left: 0;
    }
    &.right{
      right: 0;
    }
  }
  .highlight-background{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

</style>
