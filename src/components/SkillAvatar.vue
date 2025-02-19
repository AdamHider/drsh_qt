<template>
  <q-item flat clickable
    :class="`q-push q-my-sm rounded-borders skill-item bg-blue-grey-1 color-${props.color} text-center ${(skill.is_gained) ? 'is_gained' : (skill.is_available) ? (skill.is_purchasable) ? 'is_purchasable is_available' : 'is_available' : 'is_blocked'}`">
    <q-item-section avatar>
      <q-avatar :size="props.size" text-color="white">
        <img class="absolute" :src="skill.image" />
      </q-avatar>
      </q-item-section>
    <q-item-section class="q-pt-none text-left"><div  class="text-subtitle2" style=""><b>{{ skill.title }}</b></div></q-item-section>
  </q-item>
</template>

<script setup>
import { toRefs } from 'vue'
import { useUserStore } from '../stores/user'

const { getItem } = useUserStore()

const props = defineProps({
  skill: Object,
  size: String,
  color: String
})

const skill = toRefs(props).skill

</script>
<style lang="scss" scoped>
$glow: 0px 0px 5px -1px $blue;

.skill-item.is_blocked { filter: grayscale(1); }
.skill-item.is_gained { background: $gradient-positive !important; color: white; text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.27); }
.skill-item.is_available { background: $gradient-light-blue !important; color: white; text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.27);}
</style>
