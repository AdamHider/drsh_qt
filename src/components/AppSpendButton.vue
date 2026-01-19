<template>
    <q-btn :push="props.push" dense :class="`${props.class}`" :loading="loading" :color="props.color" style="padding-right: 2px;">
      <div class="flex justify-between items-center">
        <span v-if="props.label" class="block">{{ props.label }}</span>
        <span v-else class="block">Начать</span>
        <q-icon v-if="props.iconRight" :name="props.iconRight"/>
        <div class="q-ma-xs q-ml-sm" style="background-color: #00000038; border-radius: 8px">
          <q-chip  v-for="(resource, index) in props.resources" :key="index"
            square :text-color="(!props.noLeftoverMark && resource.quantity < resource.quantity_cost) ? 'red' : 'white'"
            color="transparent"
            class="q-ma-none q-px-sm" >
            <q-img v-if="!props.reversed" class="q-mr-sm" width="20px" :src="resource.image" style="filter: hue-rotate(0deg) drop-shadow(1px 3px 3px #00000075);"/>
            <b v-if="props.noLeftoverMark">{{ resource.quantity }}</b>
            <b v-else>{{ resource.quantity_cost }}</b>
            <q-img v-if="props.reversed" class="q-ml-xs" width="20px" :src="resource.image" style="filter: hue-rotate(0deg) drop-shadow(1px 3px 3px #00000075);"/>
            
          </q-chip>
        </div>
      </div>
    </q-btn>
</template>

<script setup>
import { ref, onActivated } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const props = defineProps({
  class: String,
  color: String,
  label: String,
  resources: Array,
  iconRight: String,
  loading: Boolean,
  push: Boolean,
  noLeftoverMark: Boolean,
  reversed: Boolean
})
</script>
