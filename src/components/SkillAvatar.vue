<template>
    <div :class="`skill-block color-${props.color} text-center ${(skill.is_gained) ? 'is_gained' : (skill.is_available) ? (skill.is_purchasable) ? 'is_purchasable is_available' : 'is_available' : 'is_blocked'}`">
      <div class="avatar">
        <q-avatar  :size="props.size"  text-color="white">
          <img  class="absolute" :width="props.iconSize" :src="skill.image" />
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

$glow: 0px 0px 5px -1px  $info;

.avatar{
  position: relative;
  border-radius: 100%;
}
.avatar .q-avatar{
  /*transform: rotate(45deg);*/
}
.avatar .q-icon{
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: white;
}
.skill-block:not(:first-child):before{
  content: "";
  position: absolute;
  bottom: 100%;
  border-left: 4px solid $grey-4;
  margin-right: 1px;
  height: 100%;
  left: 47%;
}
.skill-block:not(:first-child):after{
  content: "";
  position: absolute;
  top: -60%;
  left: 27px;
  border-radius: 10px;
  border: 6px solid white;
}
.skill-block.is_blocked{
  opacity: .6;
}
.is_blocked .avatar .q-avatar{
  background: linear-gradient(to top, $grey-8, $grey-7);
  box-shadow: inset 0px 0px 0px 2px $grey-4;
}
.is_available .avatar .q-avatar{
  background: white;
}
.is_purchasable .avatar .q-avatar{
  background: white;
}
.color-blue.is_gained       .avatar ,
.color-blue.is_available    .avatar ,
.color-blue.is_purchasable  .avatar {
  box-shadow: 0px 0px 5px -1px  $info;
}
.color-blue.is_gained       .avatar .q-avatar { background: linear-gradient(to top, $blue-10, $blue-8); box-shadow: inset 0px 0px 0px 3px $info;}
.color-blue.is_available    .avatar .q-avatar { background: linear-gradient(to top, $grey-10, $grey-9); box-shadow: inset 0px 0px 0px 3px $grey-3;}
.color-blue.is_purchasable  .avatar .q-avatar { box-shadow: inset 0px 0px 0px 3px $info;}
.color-blue.is_available    .avatar .q-icon { color: $blue-3 !important;}
.color-blue.is_purchasable  .avatar .q-icon { color: $blue !important;}
.color-blue.is_purchasable.skill-block:before,
.color-blue.is_available.skill-block:before ,
.color-blue.is_gained.skill-block:before { border-color: $info; border-width: 4px; box-shadow: 0px 0px 5px -1px  $info; }
.color-blue.is_purchasable.skill-block:after,
.color-blue.is_available.skill-block:after,
.color-blue.is_gained.skill-block:after{ border-color: $info; border-width: 6px;  box-shadow: 0px 0px 5px -1px  $info; }

.color-orange.is_gained       .avatar ,
.color-orange.is_available    .avatar ,
.color-orange.is_purchasable  .avatar {
  box-shadow: 0px 0px 5px -1px  $orange-2;
}
.color-orange.is_gained       .avatar .q-avatar { background: linear-gradient(to top, $orange-10, $orange-8);  box-shadow: inset 0px 0px 0px 3px $orange;}
.color-orange.is_available    .avatar .q-avatar { background: linear-gradient(to top, $grey-10, $grey-9);box-shadow: inset 0px 0px 0px 3px $orange-3;}
.color-orange.is_purchasable  .avatar .q-avatar { box-shadow: inset 0px 0px 0px 3px $orange;}
.color-orange.is_available    .avatar .q-icon { color: $orange-3 !important;}
.color-orange.is_purchasable  .avatar .q-icon { color: $orange !important;}
.color-orange.is_purchasable.skill-block:before,
.color-orange.is_available.skill-block:before ,
.color-orange.is_gained.skill-block:before { border-color: $orange; border-width: 3px; box-shadow: 0px 0px 5px -1px  $orange-2;}
.color-orange.is_purchasable.skill-block:after,
.color-orange.is_available.skill-block:after,
.color-orange.is_gained.skill-block:after{ border-color: $orange; border-width: 6px;  box-shadow: 0px 0px 5px -1px  $orange-2; }
</style>

