<template>
  <div>
    <div class="q-pa-sm" v-for="(category, categoryIndex) in skills" :key="categoryIndex">
      <div class="text-h6">{{ category.title }}</div>
      <div class="flex justify-start q-gutter-md">
        <div class="text-center" v-for="(skill, skillIndex) in category.list" :key="skillIndex" @click="currentSkill = skill; claimDialog = true">
          <q-avatar size="60px" font-size="42px" rounded  color="teal" text-color="white" icon="biotech" />
          <div class="text-caption">{{ skill.title }}</div>
        </div>
      </div>
    </div>
    <q-dialog v-model="claimDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-center" style="width: 300px">
        <q-card-section>
          <div class="text-h6">{{ currentSkill.title }}</div>
          <div class="text-caption">{{ currentSkill.description }}</div>
        </q-card-section>
        <q-card-section v-if="!claimError">
          <div class="flex justify-start q-gutter-md">
            <div class="text-center" v-for="(availableSkill, availableSkillIndex) in currentSkill.available_skills" :key="availableSkillIndex">
              <q-avatar size="60px" font-size="42px" rounded  color="teal" text-color="white" icon="biotech" />
              <div class="text-h6">{{ availableSkill.title }}</div>
              <div class="text-caption">{{ availableSkill.description }}</div>
            </div>
          </div>
        </q-card-section>
        <q-card-section v-else>
          Something went wrong.
        </q-card-section>
        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn class="full-width" label="Okay" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { api } from '../services/index'
import { ref, onActivated } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'

const route = useRoute()
const router = useRouter()
const claimDialog = ref(false)
const claimRewards = ref({})
const claimError = ref(false)
const currentSkill = ref(false)
const skills = ref([])
const error = ref({})

const props = defineProps({
  classroomId: String,
  mode: String,
  activeOnly: Boolean
})

const load = async function (filter) {
  const skillListResponse = await api.skill.getList({ mode: 'by_user' })
  if (skillListResponse.error) {
    error.value = skillListResponse
    skills.value = []
    return []
  }
  skills.value = skillListResponse
}

const claimReward = async function (skillId) {
  const skillRewardResponse = await api.skill.claimReward({ skill_id: skillId })
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
onActivated(() => {
  load()
})

</script>
