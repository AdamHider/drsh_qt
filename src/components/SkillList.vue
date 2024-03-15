<template>
  <div>

  <div class="justify-center   ">
      <div v-for="(subcategory, subcategoryIndex) in props.list" :key="subcategoryIndex" class="subcategory-block">
          <div class="q-pa-sm q-mt-sm">
            <div class="row justify-between ">
              <div><b>{{subcategory.title}} </b> <b class="text-blue">({{subcategory.gained_total}}/{{subcategory.total}})</b></div>
              <div><q-badge color="white" text-color="blue"><b>{{(subcategory.gained_total/subcategory.total*100).toFixed(2)}}%</b></q-badge></div>
            </div>
            <q-linear-progress rounded size="15px" :value="subcategory.gained_total/subcategory.total" color="blue" class="q-mt-sm"/>
          </div>
          <div class="overflow-auto">
              <swiper :slides-per-view="'auto'" spaceBetween="40">
                <swiper-slide  v-for="(skillCol, skillColIndex) in subcategory.list" :key="skillColIndex" class="flex column text-center" style="width: fit-content; height: auto !important;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;">
                  <SkillAvatar v-for="(skill, skillIndex) in skillCol.slots" :key="skillIndex"
                    :skill="skill"
                    @click="openModal(skill)"
                    :style="`position: relative; `"
                    size="60px"
                    iconSize="40px"
                    :color="props.color"
                  />
                  <div v-for="(relation, relationIndex) in skillCol.relations" :key="relationIndex" :class="`relation relation-${relation.direction} relation-${relation.is_gained}`"></div>
            </swiper-slide>
          </swiper>
          </div>
      </div>
    </div>
    <q-dialog v-model="claimDialog"  transition-show="scale" transition-hide="scale" full-width>
      <q-card :class="`skill-card ${(currentSkill.is_gained) ? 'is_gained' : (currentSkill.is_available) ? (currentSkill.is_purchasable) ? 'is_purchasable is_available' : 'is_available' : 'is_blocked'} text-center q-pb-sm`">
        <q-card-section class="q-mt-lg flex justify-center" >
          <q-avatar size="90px" text-color="white">
            <img class="absolute" :src="currentSkill.image" />
          </q-avatar>
        </q-card-section>
        <q-card-section>
          <div class="text-h6"><b>{{ currentSkill.title }}</b></div>
          <div class="text-caption">{{ currentSkill.description }}</div>
        </q-card-section>
        <q-separator/>
        <q-card-actions >
          <div v-if="currentSkill.is_available" class="full-width">
            <div v-if="currentSkill.cost" class="q-pa-sm text-center">
              <div class="text-h6">Необходимо: </div>
              <div class="row justify-center q-gutter-sm q-py-sm">
                  <q-chip class="bg-transparent" :text-color="`${resource.color}-9`" v-for="(resource, resourceIndex) in currentSkill.cost" :key="resourceIndex">
                    <q-avatar class="bg-transparent">
                      <q-icon :color="`${resource.color}-9`" :name="resource.icon" size="25px"></q-icon>
                    </q-avatar>
                    <b>{{ resource.quantity }}</b>
                  </q-chip>
              </div>
            </div>
            <q-btn v-if="currentSkill.is_purchasable" color="primary" class="full-width" icon="file_upload" label="Upgrade" @click="claimSkill(currentSkill.id)"/>
            <q-btn v-else color="gray" flat class="full-width" label="Not enough resources"/>
          </div>
          <div v-if="currentSkill.is_gained" class="full-width">
            <q-btn color="white" icon="check" flat class="full-width" label="Upgraded"/>
          </div>
          <div v-if="!currentSkill.is_gained && !currentSkill.is_available" class="full-width">
            <div class="text-h6">Необходимо: </div>
            <q-list class="text-left">
              <q-item  clickable  v-for="(requiredSkill, requiredSkillIndex) in currentSkill.required_skills" :key="requiredSkillIndex"  @click="openModal(requiredSkill)">
                <q-item-section avatar>
                  <q-avatar size="50px" text-color="white">
                    <img class="absolute" :src="requiredSkill.image" />
                  </q-avatar>
                </q-item-section>
                <q-item-section class="q-pl-sm">
                  <q-item-label lines="1"><b>{{ requiredSkill.title }}</b></q-item-label>
                  <q-item-label caption>{{ requiredSkill.description }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { api } from '../services/index'
import { ref, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import SkillAvatar from '../components/SkillAvatar.vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const claimDialog = ref(false)
const claimError = ref(false)
const currentSkill = ref(false)

const props = defineProps({
  list: Array,
  color: String,
  activeOnly: Boolean
})

const emit = defineEmits(['onClaim'])

const openModal = function (skill) {
  if (!skill.id) return
  currentSkill.value = skill
  claimDialog.value = true
}

const claimSkill = async function (skillId) {
  const skillRewardResponse = await api.skill.claimSkill({ skill_id: skillId })
  if (skillRewardResponse.error) {
    claimError.value = true
  } else {
    emit('onClaim')
    claimDialog.value = false
  }
}
onBeforeRouteLeave((to, from) => {
  if (claimDialog.value) {
    claimDialog.value = false
    return false
  }
  return true
})
</script>
<style lang="scss" scoped>

.skill-swiper .swiper-wrapper .swiper-slide{
  align-self: stretch;
  height: auto;
  display: grid;
}
.skill-swiper .swiper-wrapper .swiper-slide:first-child{
  border-left: none;
}
.skill-swiper .swiper-wrapper .swiper-slide .q-card{
  background: none;
  align-items: center;
  display: grid;
}
.skill-block{
  position: relative;
}
.skill-card.is_gained { background: $gradient-positive !important; color: white; }
.skill-card.is_available { border: 3px solid $positive }
.subcategory-block{
  /*
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;
  margin-right: -1px;*/
}
@mixin line               { height: 0; border-bottom-width: 4px; }
@mixin angle_top_left     { border-top-width: 4px; border-left-width: 4px; border-top-left-radius: 10px; }
@mixin angle_top_right    { border-top-width: 4px; border-right-width: 4px; border-top-right-radius: 10px; }
@mixin angle_bottom_left  { border-bottom-width: 4px; border-left-width: 4px; border-bottom-left-radius: 10px; }
@mixin angle_bottom_right { border-bottom-width: 4px; border-right-width: 4px; border-bottom-right-radius: 10px; }

.relation{
  position: absolute;
  border-color: $grey-3;
  border-style: solid;
  border-width: 0px;
  left: 100%;
  width: 20px;
}
.relation:after{
  content: "";
  position: absolute;
  border-color: $grey-3;
  border-style: solid;
  border-width: 0px;
  left: 100%;
  height: 100%;
  width: 20px;
}
.relation-is_gained{
  background: $positive;
}
.relation-1-0-0-1{
  bottom: calc(-2px + 50%);
  width: 40px;
  border-bottom-width: 4px;
}
.relation-1-0-0-2{
  @include angle_bottom_right;
  bottom: calc(-2px + 50%);
  height: 11%;
  &:after{
    @include angle_top_left;
    bottom: 100%;
  }
}
.relation-1-0-1-2{
  top: calc(-2px + 50%);
  height: 11%;
  @include angle_top_right;
  &:after{
    @include angle_bottom_left;
    top: 100%;
  }
}
.relation-2-0-0-1{
  @include angle_top_right;
  top: calc(-2px + 25%);
  height: 11%;
  &:after{
    @include angle_bottom_left;
    top: 100%;
  }
}
.relation-2-1-0-1{
  bottom: calc(-2px + 25%);
  height: 11%;
  @include angle_bottom_right;
  &:after{
    @include angle_top_left;
    bottom: 100%;
  }
}

.relation-2-0-0-2{
  @include line;
  top: calc(-2px + 25%);
  &:after{
  @include line;
    top: 100%;
  }
}
.relation-2-1-1-2{
  @include line;
  bottom: calc(-2px + 25%);
  &:after{
    @include line;
    top: 100%;
  }
}
.relation-2-1-0-2{
  @include angle_top_right;
  top: calc(-2px + 25%);
  height: 11%;
  &:after{
    @include angle_bottom_left;
    top: 100%;
  }
}
.relation-2-0-1-2{
  @include angle_top_right;
  top: calc(-2px + 25%);
  height: 24%;
  &:after{
    @include angle_bottom_left;
    top: 100%;
  }
}



</style>
