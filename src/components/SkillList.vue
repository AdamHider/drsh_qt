<template>
  <div>

  <div class="justify-center">
      <div v-for="(subcategory, subcategoryIndex) in props.list" :key="subcategoryIndex" class="subcategory-block">
          <div class="q-pa-sm q-mt-sm">
            <div class="row justify-between ">
              <div><b>{{subcategory.title}} </b> <b class="text-blue">({{subcategory.gained_total}}/{{subcategory.total}})</b></div>
              <div><q-badge color="white" text-color="blue"><b>{{(subcategory.gained_total/subcategory.total*100).toFixed(0)}}%</b></q-badge></div>
            </div>
            <q-linear-progress rounded size="15px" :value="subcategory.gained_total/subcategory.total" color="gradient-blue" class="q-mt-sm q-progress--push"/>
          </div>
          <div >
              <swiper :class="`q-pa-sm`"  slides-per-view="auto" spaceBetween="50" >
                <swiper-slide  v-for="(skillCol, skillColIndex) in subcategory.list" :key="skillColIndex" class="flex column text-center q-pa-sm">
                  <SkillAvatar v-for="(skill, skillIndex) in skillCol.slots" :key="skillIndex"
                    :skill="skill"
                    @click="openModal(skill)"
                    size="60px"
                    style="z-index: 10; width: 165px;"
                    :color="props.color"
                  />
                  <div v-for="(relation, relationIndex) in skillCol.relations" :key="relationIndex" :class="`relation relation-${relation.direction} ${(relation.is_gained) ? 'relation-is_gained' : ''}`"></div>
            </swiper-slide>
          </swiper>
          </div>
      </div>
    </div>
    <q-dialog v-model="claimDialog"  transition-show="slide-up" transition-hide="slide-down" full-width position="bottom">
      <q-card :class="`q-pt-sm skill-card ${(currentSkill.is_gained) ? 'is_gained' : (currentSkill.is_available) ? (currentSkill.is_purchasable) ? 'is_purchasable is_available' : 'is_available' : 'is_blocked'} text-center q-pb-sm`">
        <q-img width="90px" :src="currentSkill.image" />
        <q-card-section>
          <div class="text-h6"><b>{{ currentSkill.title }}</b></div>
          <div class="text-caption">{{ currentSkill.description }}</div>
        </q-card-section>
        <q-separator/>
        <q-card-section v-if="currentSkill.modifiers">
          <div class="text-center"><b>Эффекты: </b></div>
          <q-list>
            <q-item v-for="(modifier, modifierIndex) in currentSkill.modifiers" :key="modifierIndex" class="text-left rounded-borders" >
                <q-item-section>
                    <q-item-label caption><b>{{modifier.title}}</b></q-item-label>
                    <q-item-label ><b>{{modifier.description}}</b></q-item-label>
                </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-separator/>
        <q-card-actions >
          <div v-if="currentSkill.is_available" class="full-width">
            <div v-if="currentSkill.cost" class="q-pa-sm">
              <div class="text-center"><b>Необходимо: </b></div>
              <div class="row justify-center q-gutter-sm q-py-sm">
                <div v-for="(resource, resourceIndex) in currentSkill.cost" :key="resourceIndex" >
                  <q-item :class="`bg-grey-3 text-${(resource.quantity > resource.quantity_cost) ? resource.color : 'red'} text-left rounded-borders`" >
                      <q-item-section avatar>
                          <q-img width="28px" :src="resource.image" style="filter: hue-rotate(0deg) drop-shadow(1px 3px 3px #00000075 );;"/>
                      </q-item-section>
                      <q-item-section>
                          <q-item-label><b>{{resource.quantity}}/{{ resource.quantity_cost }}</b></q-item-label>
                      </q-item-section>
                  </q-item>
                </div>
              </div>
            </div>
            <q-btn v-if="currentSkill.is_purchasable" color="primary" class="full-width" icon="file_upload" label="Upgrade" @click="claimSkill(currentSkill.id)"/>
            <q-btn v-else color="gray" flat class="full-width" label="Not enough resources"/>
          </div>
          <div v-if="currentSkill.is_gained" class="full-width">
            <q-btn color="white" icon="check" flat class="full-width" label="Upgraded"/>
          </div>
          <div v-if="!currentSkill.is_gained && !currentSkill.is_available" class="full-width">
            <div><b>Сначала изучите: </b></div>
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
.swiper-slide{
  width: fit-content;
  height: auto !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.skill-card.is_gained { background: $gradient-positive !important; color: white; }
.skill-card.is_blocked .avatar { filter: grayscale(1); }

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
  left: calc(-10px + 100%);
  width: 30px;
}
.relation:before{
  content: "";
  position: absolute;
  border-color: $grey-3;
  border-style: solid;
  border-width: 0px;
  left: 100%;
  height: 100%;
  width: 30px;
}
.relation:after{
  content: "";
  position: absolute;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid $grey-3;
  left: 60px;
}
.relation-is_gained{
  border-color: $positive;
  &:before{ border-color: $positive; }
  &:after{ border-left-color: $positive; }
}
.relation-1-0-0-1{
  @include line;
  bottom: calc(-2px + 50%);
  &:before{ @include line; top: 100%; }
  &:after{ top: calc(-6px + 50%); }
}
.relation-1-0-0-2{
  @include angle_bottom_right;
  bottom: calc(-2px + 50%);
  height: 11%;
  &:before{ @include angle_top_left; bottom: 100%; }
  &:after{ bottom: calc(-6px + 200%); }
}
.relation-1-0-1-2{
  @include angle_top_right;
  top: calc(-2px + 50%);
  height: 11%;
  &:before{ @include angle_bottom_left; top: 100%; }
  &:after{ top: calc(-6px + 200%); }
}
.relation-2-0-0-1{
  @include angle_top_right;
  top: calc(-2px + 25%);
  height: 11%;
  &:before{ @include angle_bottom_left; top: 100%; }
  &:after{ top: calc(-6px + 200%); }
}
.relation-2-1-0-1{
  @include angle_bottom_right;
  bottom: calc(-2px + 25%);
  height: 11%;
  &:before{ @include angle_top_left; bottom: 100%; }
  &:after{ bottom: calc(-6px + 200%); }
}

.relation-2-0-0-2{
  @include line;
  top: calc(-2px + 25%);
  &:before{ @include line; top: 100%; }
  &:after{ top: calc(-6px + 50%); }
}
.relation-2-1-1-2{
  @include line;
  bottom: calc(-2px + 25%);
  &:before{ @include line; top: 100%; }
  &:after{ top: calc(-6px + 50%); }
}
.relation-2-1-0-2{
  @include angle_bottom_right;
  bottom: calc(-2px + 25%);
  height: 24%;
  &:before{ @include angle_top_left; bottom: 100%; }
  &:after{ bottom: calc(-6px + 200%); }
}
.relation-2-0-1-2{
  @include angle_top_right;
  top: calc(-2px + 25%);
  height: 24%;
  &:before{ @include angle_bottom_left; top: 100%; }
  &:after{ top: calc(-6px + 200%); }
}
</style>
