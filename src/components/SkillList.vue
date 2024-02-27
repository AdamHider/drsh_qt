<template>
  <div>
  <div class="flex justify-evenly">
      <div v-for="(subcategory, subcategoryIndex) in props.list" :key="subcategoryIndex" class="subcategory-block q-py-sm column">
          <div class="chain-block q-mb-md" v-for="(chain, chainIndex) in subcategory.list" :key="chainIndex" >
              <div v-for="(skill, skillIndex) in chain" :key="skillIndex"
                :class="`skill-block text-center q-mb-xl ${(skill.is_gained) ? 'is_gained' : (skill.is_available) ? (skill.is_purchasable) ? 'is_purchasable' : 'is_available' : 'is_blocked'}`"
                @click="openModal(skill)"
                :style="`position: relative; z-index: ${100 - skillIndex}`">
                <div class="avatar">
                  <q-avatar class="rounded-sm" size="50px" square  text-color="white"/>
                  <q-icon class="absolute" size="35px" :name="(!skill.is_gained && !skill.is_available) ? 'lock' : skill.icon" />
                </div>
              </div>
          </div>
      </div>
    </div>
    <q-dialog v-model="claimDialog"  transition-show="slide-up" transition-hide="slide-down" position="bottom">
      <q-card class="bg-white text-center q-pb-sm rounded-b-0" >
        <q-card-section :class="`q-mt-lg ${(currentSkill.is_gained) ? 'is_gained' : (currentSkill.is_available) ? (currentSkill.is_purchasable) ? 'is_purchasable' : 'is_available'  : 'is_blocked'}`" >
          <div class="avatar">
           <q-avatar class="rounded-sm" size="70px" square text-color="white"/>
           <q-icon class="absolute" size="55px" :name="(!currentSkill.is_gained && !currentSkill.is_available) ? 'lock' : currentSkill.icon" />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">{{ currentSkill.title }}</div>
          <div class="text-caption">{{ currentSkill.description }}</div>
        </q-card-section>
        <q-separator/>
        <q-card-actions >
          <div v-if="currentSkill.is_available" class="full-width">
            <div v-if="currentSkill.cost" class="q-pa-sm text-center">
              <div class="text-h6">Необходимо: </div>
              <div class="row justify-center q-gutter-sm q-py-sm">
                  <q-chip outline color="primary" v-for="(resource, resourceIndex) in currentSkill.cost" :key="resourceIndex">
                    <q-avatar color="primary" text-color="white">{{ resource.quantity }}</q-avatar>
                    <b>{{ resource.title }}</b>
                  </q-chip>
              </div>
            </div>
            <q-btn v-if="currentSkill.is_purchasable" color="primary" class="full-width" icon="file_upload" label="Upgrade"/>
            <q-btn v-else color="gray" flat class="full-width" label="Not enough resources"/>
          </div>
          <div v-if="currentSkill.is_gained" class="full-width">
            <q-btn color="positive" icon="check" flat class="full-width" label="Upgraded"/>
          </div>
          <div v-if="!currentSkill.is_gained && !currentSkill.is_available" class="full-width">
            <div class="text-h6">Необходимо: </div>
            <q-list class="text-left">
              <q-item :class="`${(currentSkill.required_skill.is_gained) ? 'is_gained' : (currentSkill.required_skill.is_available) ? (currentSkill.required_skill.is_purchasable) ? 'is_purchasable' : 'is_available' : 'is_blocked'}`"
                clickable @click="openModal(currentSkill.required_skill)">
                <q-item-section avatar>
                  <div class="avatar q-pa-sm">
                    <q-avatar class="rounded-sm" size="50px" square text-color="white"/>
                    <q-icon class="absolute" size="35px" :name="(!currentSkill.required_skill.is_gained && !currentSkill.required_skill.is_available) ? 'lock' : currentSkill.required_skill.icon" />
                  </div>
                </q-item-section>
                <q-item-section class="q-pl-sm">
                  <q-item-label lines="1">{{ currentSkill.required_skill.title }}</q-item-label>
                  <q-item-label caption>{{ currentSkill.required_skill.description }}</q-item-label>
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

const claimDialog = ref(false)
const claimRewards = ref({})
const claimError = ref(false)
const currentSkill = ref(false)

const props = defineProps({
  list: Array,
  mode: String,
  activeOnly: Boolean
})
const openModal = function (skill) {
  if (!skill.id) return
  currentSkill.value = skill
  claimDialog.value = true
}

const claimSkill = async function (skillId) {
  const skillRewardResponse = await api.skill.claimSkill({ skill_id: skillId })
  claimDialog.value = true
  claimError.value = false
  if (skillRewardResponse.error) {
    claimError.value = true
    claimRewards.value = false
  } else {
    claimRewards.value = skillRewardResponse.reward
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
.subcategory-block.column:nth-child(odd){
  margin-top: 50px;
}
.skill-block:not(:first-child):before{
  content: "";
  position: absolute;
  bottom: 100%;
  border-left: 2px solid $grey-4;
  margin-right: 1px;
  height: 200%;
  left: 48%;
}
.is_purchasable.skill-block:before,
.is_gained.skill-block:before{
  border-color: $primary;
}
.is_available.skill-block:before{
  border-color: $blue-3;
}
.avatar{
  position: relative;
}
.avatar .q-avatar{
  transform: rotate(45deg);
}
.avatar .q-icon{
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: white;
}
.is_gained .avatar .q-avatar{
  background: $primary;
}
.is_available .avatar .q-avatar{
  background: white;
  box-shadow: 0px 0px 0px 2px $blue-3;

}
.is_available .avatar .q-icon{
  color: $blue-3 !important;
}
.is_purchasable .avatar .q-avatar{
  background: white;
  box-shadow: 0px 0px 0px 2px $primary;
}
.is_purchasable .avatar .q-icon{
  color: $primary !important;
}
.is_blocked .avatar .q-avatar{
  background: $grey-4;
  box-shadow: 0px 0px 0px 2px $grey-4;
}
</style>>
