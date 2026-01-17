<template>
  <q-item v-ripple clickable
    :class="`q-push q-my-sm rounded-borders skill-item bg-blue-grey-1 color-${props.color} text-center relative-position
     ${(skill.price > 0) ? 'is_payment ' : ''} ${(skill.is_gained) ? 'is_gained' : (skill.is_available) ? (skill.is_purchasable) ? 'is_purchasable is_available q-item-blinking' : 'is_available' : 'is_blocked'} ${props.class}`">
    <q-item-section avatar :class="(skill.price > 0 || skill.is_available) ? 'q-item-blinking' : ''">
      <q-avatar :size="props.size" text-color="white">
        <q-img class="absolute" :src="`${skill.image}?w=70&h=70`" no-spinner/>
      </q-avatar>
      </q-item-section>
    <q-item-section class="q-pt-none text-left"><div  class="text-subtitle2" style=""><b>{{ skill.title }}</b></div></q-item-section>
    <div class="absolute-top-left q-pa-xs">
      <q-avatar v-if="skill.is_quest === true" size="18px" font-size="12px" color="secondary" text-color="white" icon="priority_high" class="vertical-middle q-ml-xs" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;"/>
    </div>
  </q-item>

</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  skill: Object,
  size: String,
  color: String,
  class: String
})

const skill = toRefs(props).skill

</script>
<style lang="scss" scoped>
$glow: 0px 0px 5px -1px $blue;
.skill-item{
  position: relative;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.37);
  &:before{
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: url('/images/skills/skill_item_background.png');
    background-repeat: no-repeat;
    background-size: 80%;
    opacity: 0.2;
    background-position-y: center;
  }
  .q-img{
    filter: drop-shadow(0px 0px 5px #ffffff5e);
  }
  &:after{
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: black;
    transition: 0.3s all ease;
    opacity: 0;
    z-index: 0;
    border-radius: inherit;
  }
  &.is-active:after{
    opacity: 0.2;
  }
}
.skill-item.is_blocked {
  text-shadow: none !important;
  filter: grayscale(1);
  &:before{
    background-image: url('/images/skills/skill_item_background_dark.png');
    opacity: 0.05;
  }
}
.skill-item.is_gained { background: $gradient-positive !important; color: white; text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.27); }
.skill-item.is_available {
  background: $gradient-primary !important;
  color: white;
  border-bottom: 4px solid $primary;
}
.skill-item.is_payment {
  background: $gradient-primary-purple !important;
  color: white;
  border-bottom: 4px solid $primary-dark;
}
.skill-item.is_payment.is_gained {
  background: $gradient-positive !important;
  border-bottom: 4px solid #198031  !important;
}

</style>
