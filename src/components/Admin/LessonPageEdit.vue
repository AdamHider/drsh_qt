<template>
  <q-card>
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">{{ pageData.title }}</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-card-section>
      <q-card v-if="props.pageData.image" class="q-ma-md">
        <q-card-section class="q-pa-none ">
          <q-img
              class="rounded-borders"
              cover
              :src="`${CONFIG.API_HOST}/${props.pageData.image}`" />
          </q-card-section>
      </q-card>
      <q-list class="q-mb-md">
        <q-item  v-for="(replica, index) in props.pageData.template_config.replica_list" :key="index" >
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar2.jpg">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1"><b>{{ replica.name }}</b></q-item-label>
            <q-item-label style="white-space: break-spaces;"><div v-html="replica.text"></div></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { CONFIG } from '../../config.js'


const props = defineProps({
  pageData: Object
})
const emits = defineEmits(['onRendered'])

/*
const PageTemplate = computed(() => pageTemplateTitle.value ? defineAsyncComponent(() => import(`../components/Lesson/PageTemplates/${pageTemplateTitle.value}Page.vue`)) : null)
const FormTemplate = computed(() => formTemplateTitle.value ? defineAsyncComponent(() => import(`../components/Lesson/FormTemplates/${formTemplateTitle.value}Form.vue`)) : null)
*/
const replicaList = reactive({
  list: []
})

const renderData = () => {
  replicaList.list = []
  for (const i in props.pageData.replica_list) {
    if (props.pageData.replica_list[i].text.indexOf('input') > -1) {
      const inputs = props.pageData.replica_list[i].text.match(/{{input[0-9]+}}/g)
      for (const k in inputs) {
        const inputIndex = inputs[k].match(/[0-9]+/g)[0]
        props.pageData.replica_list[i].text = props.pageData.replica_list[i].text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
      }
    }
    replicaList.list.push(props.pageData.replica_list[i])
  }
}

renderData()
console.log(props.pageData)
onMounted(() => {
  emits('onRendered', true)
})

</script>
