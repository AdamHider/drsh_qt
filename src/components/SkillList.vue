<template>
  <div>
      <div v-for="(row, rowIndex) in skills[0]?.table" :key="rowIndex" class="q-pb-sm row content-center justify-center items-center"
          :style="`position: relative; z-index: ${100 - rowIndex}`">
          <div v-for="(skill, columnIndex) in row" :key="columnIndex" :class="`text-center col  ${(!skill.id) ? 'empty' : ''}`">
              <div
                :class="`skill-block text-center q-py-md ${(skill.is_gained) ? 'is_gained' : (skill.is_available) ? 'is_available' : 'is_blocked'} prev-relation-${skill.prev_relation}`"
                @click="openModal(skill)">
                <q-avatar size="50px" font-size="35px"  text-color="white"
                  :icon="(!skill.is_gained && !skill.is_available) ? 'lock' : skill.icon" />
              </div>
          </div>
      </div>
    <q-dialog v-model="claimDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-center" style="width: 300px">
        <q-card-section>
          <div class="text-h6">{{ currentSkill.title }}</div>
          <div class="text-caption">{{ currentSkill.description }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { api } from '../services/index'
import { ref, onActivated } from 'vue'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

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
const openModal = function (skill) {
  if (!skill.id) return
  currentSkill.value = skill
  claimDialog.value = true
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
.col.empty {
  opacity: 0;
}
.col:nth-child(odd) .skill-block{
  transform: translateY(50%);
}
.prev-relation-1:before{
  content: "";
  position: absolute;
  top: -50%;
  border-left: 2px solid lightgray;
  height: 100%;
  left: 50%;
}
.is_available.prev-relation-1:before{
  border-color: $primary;
}
.skill-group-container{
  height: 100%;
  align-items: center;
  display: grid;
}
.is_available .q-avatar{
  background: white;
  color: $primary !important;
  box-shadow: 0px 0px 0px 2px $primary;
}
.is_gained .q-avatar{
  background: $primary;
  box-shadow: 0px 0px 0px 2px $primary;
}
.is_blocked .q-avatar{
  background: $grey-5;
  box-shadow: 0px 0px 0px 2px $grey-6;
}
</style>>
