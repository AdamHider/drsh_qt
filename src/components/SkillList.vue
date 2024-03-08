<template>
  <div>

  <div class="flex justify-evenly">
      <div v-for="(subcategory, subcategoryIndex) in props.list" :key="subcategoryIndex" class="subcategory-block q-py-sm column">
          <div class="chain-block q-mb-md" v-for="(chain, chainIndex) in subcategory.list" :key="chainIndex" >
              <SkillAvatar v-for="(skill, skillIndex) in chain" :key="skillIndex"
                :skill="skill"
                @click="openModal(skill)"
                :style="`position: relative; z-index: ${100 - skillIndex}; margin-bottom: 65px;`"
                size="65px"
                iconSize="40px"
                :color="props.color"
              />
          </div>
      </div>
    </div>
    <q-dialog v-model="claimDialog"  transition-show="slide-up" transition-hide="slide-down" position="bottom">
      <q-card dark class="text-center q-pb-sm rounded-b-0" >
        <q-card-section class="q-mt-lg flex justify-center" >
          <SkillAvatar :skill="currentSkill" size="70px" icon-size="45px" :color="props.color"/>
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
            <q-btn color="positive" icon="check" flat class="full-width" label="Upgraded"/>
          </div>
          <div v-if="!currentSkill.is_gained && !currentSkill.is_available" class="full-width">
            <div class="text-h6">Необходимо: </div>
            <q-list class="text-left">
              <q-item  clickable @click="openModal(currentSkill.required_skill)">
                <q-item-section avatar>
                  <SkillAvatar :skill="currentSkill.required_skill" size="40px" icon-size="25px" :color="props.color"/>
                </q-item-section>
                <q-item-section class="q-pl-sm">
                  <q-item-label lines="1"><b>{{ currentSkill.required_skill.title }}</b></q-item-label>
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
import SkillAvatar from '../components/SkillAvatar.vue'

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
.subcategory-block.column:nth-child(odd){
  margin-top: 50px;
}

.subcategory-block .skill-block:nth-child(odd){
  transform: translateX(50%);
}
.subcategory-block .skill-block:nth-child(even){
  transform: translateX(-50%);
}
</style>
