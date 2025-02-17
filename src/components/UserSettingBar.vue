<template>
    <q-chip v-if="setting.status !== 'neutral'">
      <q-avatar text-color="white">{{ (props.percentage) ? setting.difference*100 : setting.difference }}</q-avatar>
      {{ setting.title }}
    </q-chip>
</template>

<script setup>
import { ref, watch, toRefs, onActivated, onDeactivated } from 'vue'
import { useUserStore } from '../stores/user'

const { getItem } = useUserStore()

const props = defineProps({
  setting: Object,
  percentage: Boolean,
  size: String
})
const setting = toRefs(props).setting
</script>
<style lang="scss" scoped>
.q-avatar {
  box-shadow: 0px 0px 0px 3px $grey-3;
}
</style>

