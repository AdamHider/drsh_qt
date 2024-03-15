<template>
  <q-item flat clickable
    :class="`q-my-sm rounded-sm skill-item bg-grey-3 color-${props.color} text-center ${(skill.is_gained) ? 'is_gained' : (skill.is_available) ? (skill.is_purchasable) ? 'is_purchasable is_available' : 'is_available' : 'is_blocked'}`">
    <div class="relation"></div>
    <div class="relation-dot"></div>
      <q-item-section avatar>
        <q-avatar :size="props.size" text-color="white">
          <img class="absolute" :width="props.iconSize" :src="skill.image" />
        </q-avatar>
        </q-item-section>
      <q-item-section class="q-pt-none"><div  class="text-subtitle2" style=""><b>{{ skill.title }}</b></div></q-item-section>
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

.avatar {
  position: relative;
  border-radius: 100%;
}

.avatar:before,
.avatar:after  {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 100%;
}
.avatar .q-avatar{
}
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

.avatar .q-icon {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: white;
}

.skill-item .relation {
  display: none;
}
.skill-block:not(:first-child) .relation:after {
  content: "";
  position: absolute;
  left: 1px;
  background: white;
  width: 2px;
  height: 2px;
  border-radius: 5px;
  z-index: 10;
  opacity: 0;
  box-shadow: 0px 0px 5px 1px  $blue;
}
.skill-block .relation-dot {
  display: none;
}
.skill-block:not(:first-child) .relation-dot {
  content: "";
  position: absolute;
  top: -60%;
  left: calc(-4px + 50%);
  border-radius: 10px;
  width: 8px;
  height: 8px;
  background: white;
  display: block;
}
.skill-item.is_blocked {
  opacity: .6;
  filter: grayscale(1);
}
.is_blocked .avatar .q-avatar {
  filter: grayscale(1);
}
.is_available .avatar .q-avatar {
  //background: white;
}
.is_purchasable .avatar .q-avatar {
  //background: white;
}

.color-blue.skill-item.is_gained { background: $gradient-positive !important; color: white; }
.color-blue.skill-item.is_available { border: 3px solid $positive }
.color-blue.skill-item.is_purchasable  .relation,
.color-blue.skill-item.is_available    .relation ,
.color-blue.skill-item.is_gained       .relation { background: $positive; }

.color-blue.skill-block.is_purchasable  .avatar:after { border: 1px solid $blue; animation: blink 2s linear infinite ; }
.color-blue.skill-block.is_gained       .avatar .q-avatar { background: $info; box-shadow: inset 0px 0px 0px 2px $info;}
.color-blue.skill-block.is_available    .avatar .q-avatar { background: $grey-10; box-shadow: inset 0px 0px 0px 2px $info;}
.color-blue.skill-block.is_purchasable  .avatar .q-avatar { box-shadow: inset 0px 0px 0px 2px $info;}
.color-blue.skill-block.is_available    .avatar .q-icon { color: $blue-3 !important;}
.color-blue.skill-block.is_purchasable  .avatar .q-icon { color: $info !important;}
.color-blue.skill-block.is_purchasable.skill-block  .relation-dot,
.color-blue.skill-block.is_available.skill-block    .relation-dot,
.color-blue.skill-block.is_gained.skill-block       .relation-dot{ background: $info; }
.color-blue.skill-block.is_purchasable.skill-block  .relation:after{ animation: relationBlink 2s linear infinite ; }

.color-orange.is_purchasable  .avatar:after { border: 1px solid $orange; animation: blink 2s linear infinite ; }
.color-orange.is_gained       .avatar .q-avatar { background: $orange; box-shadow: inset 0px 0px 0px 2px $orange;}
.color-orange.is_available    .avatar .q-avatar { background: $grey-10; box-shadow: inset 0px 0px 0px 2px $orange;}
.color-orange.is_purchasable  .avatar .q-avatar { box-shadow: inset 0px 0px 0px 2px $orange;}
.color-orange.is_available    .avatar .q-icon { color: $orange-3 !important;}
.color-orange.is_purchasable  .avatar .q-icon { color: $orange !important;}
.color-orange.is_purchasable.skill-block  .relation,
.color-orange.is_available.skill-block    .relation ,
.color-orange.is_gained.skill-block       .relation { background: $orange; }
.color-orange.is_purchasable.skill-block  .relation-dot,
.color-orange.is_available.skill-block    .relation-dot,
.color-orange.is_gained.skill-block       .relation-dot{ background: $orange; }
.color-orange.is_purchasable.skill-block  .relation:after{ animation: relationBlink 2s linear infinite ; }
</style>
