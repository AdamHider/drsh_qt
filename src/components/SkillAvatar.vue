<template>
  <q-item flat clickable
    :class="`q-my-sm rounded-sm skill-item bg-grey-3 color-${props.color} text-center ${(skill.is_gained) ? 'is_gained' : (skill.is_available) ? (skill.is_purchasable) ? 'is_purchasable is_available' : 'is_available' : 'is_blocked'}`">
    <q-item-section avatar>
      <q-avatar :size="props.size" text-color="white">
        <img class="absolute" :width="props.iconSize" :src="skill.image" />
      </q-avatar>
      </q-item-section>
    <q-item-section class="q-pt-none text-left"><div  class="text-subtitle2" style=""><b>{{ skill.title }}</b></div></q-item-section>
  </q-item>
</template>

<script setup>
import { ref, watch, toRefs, onMounted, onDeactivated } from 'vue'
import { useUserStore } from '../stores/user'

const { getItem } = useUserStore()

const props = defineProps({
  skill: Object,
  size: String,
  iconSize: String,
  color: String
})

const skill = toRefs(props).skill

</script>
<style lang="scss" scoped>
$glow: 0px 0px 5px -1px $blue;

@keyframes relationBlink {
  0% {top: -10px; opacity: 0.6; transform: scale(5);}
  25% {top: 100%; transform: scale(1);}
  100% {top: 100%; opacity: 0;}
}
@keyframes blink {
  0% { transform: scale(1); opacity: 0}
  25% { transform: scale(1); opacity: 1;}
  50% {transform: scale(1.2);opacity: 0.6;}
  100% {transform: scale(1.4); opacity: 0;}
}
.skill-item.is_blocked {
  filter: grayscale(1);
}
.is_blocked .avatar .q-avatar {
  filter: grayscale(1);
}
.skill-item.is_gained { background: $gradient-positive !important; color: white; }
.skill-item.is_available { box-shadow: inset 0px 0px 0px 3px $positive }

.color-blue.skill-block.is_purchasable.skill-block  .relation:after{ animation: relationBlink 2s linear infinite ; }

</style>
