<template>
  <router-link v-if="!props.dialog" :to="props.to"><slot/></router-link>
  <q-btn v-else @click="dialog = true"><slot/></q-btn>
  <q-dialog
    v-model="dialog"
    persistent
    maximized
    transition-show="slide-left"
    transition-hide="slide-right"
  >
  <q-layout view="Lhh lpR fff" container class="bg-white text-dark">
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="dialog = false" v:slot="back-button"/>
        <q-toolbar-title>Achievements</q-toolbar-title>
    </q-app-header>
    <component :is="Component"/>
    </q-layout>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps({
  page: String,
  dialog: Boolean
})
const Component = computed(() => props.page ? defineAsyncComponent(() => import(`../pages/${props.page}.vue`)) : null)

const dialog = ref(false)
onUnmounted(() => {
  dialog.value = false
})

</script>
