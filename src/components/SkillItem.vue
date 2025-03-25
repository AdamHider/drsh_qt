<template>
  <q-item flat clickable
    :class="`q-push q-my-sm rounded-borders skill-item bg-blue-grey-1 color-${props.color} text-center ${(skill.is_gained) ? 'is_gained' : (skill.is_available) ? (skill.is_purchasable) ? 'is_purchasable is_available' : 'is_available' : 'is_blocked'}`">
    <q-item-section avatar>
      <q-avatar :size="props.size" text-color="white">
        <q-img class="absolute" :src="skill.image" no-spinner/>
      </q-avatar>
      </q-item-section>
    <q-item-section class="q-pt-none text-left"><div  class="text-subtitle2" style=""><b>{{ skill.title }}</b></div></q-item-section>
  </q-item>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  skill: Object,
  size: String,
  color: String
})

const skill = toRefs(props).skill

</script>
<style lang="scss" scoped>
$glow: 0px 0px 5px -1px $blue;
.skill-item{
  position: relative;
  &:before{
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: url('/images/skills/skill_item_background_dark.png');
    background-repeat: no-repeat;
    background-size: 80%;
    opacity: 0.1;
    background-position-y: center;
  }
}
.skill-item.is_blocked { filter: grayscale(1); }
.skill-item.is_gained { background: $gradient-positive !important; color: white; text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.27); }
.skill-item.is_available {
  background: $gradient-primary !important;
  color: white;
  border-bottom: 4px solid $primary;
  overflow: hidden;
  &:after{
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 30px;
    height: 200%;
    background: white;
    opacity: .2;
    animation: blinkbutton 3s ease infinite;
    transform: rotate(-45deg);
  }
}
@keyframes blinkbutton {
  0% {
    left: -50%;
  }
  40%, 100% {
    left: 150%;
  }
}
</style>
