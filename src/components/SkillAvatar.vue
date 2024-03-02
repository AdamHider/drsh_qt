<template>
    <div :class="`skill-block color-${props.color} text-center ${(skill.is_gained) ? 'is_gained' : (skill.is_available) ? (skill.is_purchasable) ? 'is_purchasable is_available' : 'is_available' : 'is_blocked'}`">
      <div class="avatar">
        <q-avatar  :size="props.size"  text-color="white">
          <img  v-if="skill.is_gained || skill.is_available" class="absolute" :width="props.iconSize" :src="skill.image" />
          <q-icon v-else class="absolute" size="35px" name="lock"/>
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

.avatar{
  position: relative;
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
  bottom: 108%;
  border-left: 2px solid $grey-4;
  margin-right: 1px;
  height: 80%;
  left: 47%;
}
.is_blocked .avatar .q-avatar{
  background: linear-gradient(to top, $grey-6, $grey-5);;

  box-shadow: 0px 0px 0px 2px $grey-4;
}
.is_available .avatar .q-avatar{
  background: white;
}
.is_purchasable .avatar .q-avatar{
  background: white;
}
.avatar:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  scale: 1.15;
  box-shadow: 0px 0px 0px 2px $grey-4;
}
.color-blue.is_gained       .avatar .q-avatar { background: linear-gradient(to top, $blue-10, $blue-8); box-shadow: 0px 0px 0px 2px $blue;}
.color-blue.is_available    .avatar .q-avatar { background: linear-gradient(to top, $grey-10, $grey-8); box-shadow: 0px 0px 0px 2px $grey-3;}
.color-blue.is_purchasable  .avatar .q-avatar { box-shadow: 0px 0px 0px 2px $blue;}
.color-blue.is_available    .avatar:after { box-shadow: 0px 0px 0px 2px $grey-3; }
.color-blue.is_purchasable  .avatar:after { box-shadow: 0px 0px 0px 2px $blue; }
.color-blue.is_gained       .avatar:after { box-shadow: 0px 0px 0px 2px $blue; }
.color-blue.is_available    .avatar .q-icon { color: $blue-3 !important;}
.color-blue.is_purchasable  .avatar .q-icon { color: $blue !important;}
.color-blue.is_purchasable.skill-block:before,
.color-blue.is_gained.skill-block:before { border-color: $blue; }
.color-blue.is_available.skill-block:before { border-color: $blue-3;}

.color-orange.is_gained       .avatar .q-avatar { background: linear-gradient(to top, $orange-10, $orange-8);  box-shadow: 0px 0px 0px 2px $orange;}
.color-orange.is_available    .avatar .q-avatar { background: linear-gradient(to top, $grey-10, $grey-8);box-shadow: 0px 0px 0px 2px $orange-3;}
.color-orange.is_purchasable  .avatar .q-avatar { box-shadow: 0px 0px 0px 2px $orange;}
.color-orange.is_gained       .avatar:after { box-shadow: 0px 0px 0px 2px $orange; }
.color-orange.is_available    .avatar:after { box-shadow: 0px 0px 0px 2px $orange-3; }
.color-orange.is_purchasable  .avatar:after { box-shadow: 0px 0px 0px 2px $orange; }
.color-orange.is_available    .avatar .q-icon { color: $orange-3 !important;}
.color-orange.is_purchasable  .avatar .q-icon { color: $orange !important;}
.color-orange.is_purchasable.skill-block:before,
.color-orange.is_gained.skill-block:before { border-color: $orange;}
.color-orange.is_available.skill-block:before { border-color: $orange-3;}
</style>

