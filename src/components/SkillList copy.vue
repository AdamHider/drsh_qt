<template>
  <div >
      <div v-for="(subcategory, subcategoryIndex) in props.list" :key="subcategoryIndex" class="subcategory-block q-py-sm column">

            <q-tree
              :nodes="subcategory.list"
              node-key="id"
              label-key="title"
            />
      </div>
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

</style>
