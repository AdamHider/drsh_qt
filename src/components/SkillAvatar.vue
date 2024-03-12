<template>
  <div
    :class="`skill-block color-${props.color} text-center ${(skill.is_gained) ? 'is_gained' : (skill.is_available) ? (skill.is_purchasable) ? 'is_purchasable is_available' : 'is_available' : 'is_blocked'}`">
    <div class="relation"></div>
    <div class="relation-dot"></div>
    <div class="avatar">
      <q-avatar :size="props.size" text-color="white">
        <img class="absolute" :width="props.iconSize" :src="skill.image" />
      </q-avatar>
    </div>
  </div>
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
  z-index: 9;
}
.avatar .q-avatar{
  z-index: 10;
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

.skill-block .relation {
  display: none;
}
.skill-block:not(:first-child) .relation {
  position: absolute;
  bottom: 100%;
  height: 100%;
  left: calc(-2px + 50%);
  width: 4px;
  background: $grey-4;
  display: block;
}
.skill-block:not(:first-child) .relation::before {
  content: "";
  position: absolute;
}
.skill-block:not(:first-child) .relation:after {
  content: "";
  position: absolute;
  top: -10;
  left: 0px;
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

.skill-block.is_blocked {
  opacity: .6;
}

.is_blocked .avatar .q-avatar {
  background: #00000091;
  box-shadow: inset 0px 0px 0px 2px $grey-4;
}

.is_available .avatar .q-avatar {
  background: white;
}

.is_purchasable .avatar .q-avatar {
  background: white;
}

.color-blue.is_purchasable  .avatar:after {
  border: 1px solid $blue;
  animation: blink 2s linear infinite ;
}
.color-blue.is_gained       .avatar .q-avatar { background: $info; box-shadow: inset 0px 0px 0px 3px $info;}
.color-blue.is_available    .avatar .q-avatar { background: $grey-10; box-shadow: inset 0px 0px 0px 3px $info;}
.color-blue.is_purchasable  .avatar .q-avatar { box-shadow: inset 0px 0px 0px 3px $info;}
.color-blue.is_available    .avatar .q-icon { color: $blue-3 !important;}
.color-blue.is_purchasable  .avatar .q-icon { color: $info !important;}
.color-blue.is_purchasable.skill-block .relation,
.color-blue.is_available.skill-block .relation ,
.color-blue.is_gained.skill-block .relation { background: $info; }
.color-blue.is_purchasable.skill-block .relation-dot,
.color-blue.is_available.skill-block .relation-dot,
.color-blue.is_gained.skill-block .relation-dot{ background: $info; }
.color-blue.is_purchasable.skill-block .relation:after{
  animation: relationBlink 2s linear infinite ;
}

.color-orange.is_gained       .avatar:before,
.color-orange.is_available    .avatar:before,
.color-orange.is_purchasable  .avatar:before {
  box-shadow: 0px 0px 5px -1px  $orange-2;
}
.color-orange.is_purchasable  .avatar:after {
  border: 1px solid $orange;
  animation: blink 2s linear infinite ;
}
.color-orange.is_gained       .avatar .q-avatar { background: $orange;  box-shadow: inset 0px 0px 0px 3px $orange;}
.color-orange.is_available    .avatar .q-avatar { background: $grey-10; box-shadow: inset 0px 0px 0px 3px $orange-3;}
.color-orange.is_purchasable  .avatar .q-avatar { box-shadow: inset 0px 0px 0px 3px $orange;}
.color-orange.is_available    .avatar .q-icon { color: $orange-3 !important;}
.color-orange.is_purchasable  .avatar .q-icon { color: $orange !important;}
.color-orange.is_purchasable.skill-block .relation,
.color-orange.is_available.skill-block .relation ,
.color-orange.is_gained.skill-block .relation { border-color: $orange; border-width: 3px; box-shadow: 0px 0px 5px -1px  $orange-2;}
.color-orange.is_purchasable.skill-block .relation-dot,
.color-orange.is_available.skill-block .relation-dot,
.color-orange.is_gained.skill-block .relation-dot{ border-color: $orange; border-width: 6px;  box-shadow: 0px 0px 5px -1px  $orange-2; }
.color-orange.is_purchasable.skill-block .relation:after{
  animation: relationBlink 2s linear infinite ;
}

</style>

