<template>
  <q-item flat clickable
    :class="`q-push q-my-sm rounded-borders skill-item bg-blue-grey-1 color-${props.color} text-center
      ${(skill.is_gained) ? 'is_gained' : (skill.is_available) ? (skill.is_purchasable) ? 'is_purchasable is_available q-item-blinking' : 'is_available' : 'is_blocked'}`">
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
    background-image: url('/images/skills/skill_item_background.png');
    background-repeat: no-repeat;
    background-size: 80%;
    opacity: 0.2;
    background-position-y: center;
  }
  .q-img{
    filter: drop-shadow(0px 0px 5px #ffffff5e);
  }
}
.skill-item.is_blocked {
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
</style>
