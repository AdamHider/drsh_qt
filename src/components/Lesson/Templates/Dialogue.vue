<template>
    <q-card>
        <q-img 
            cover
            width="250px" 
            :src="`${CONFIG.API_HOST}/${pageData?.data.image}`" />  
    </q-card>
    <q-list>
      <q-item  v-for="(replica, index) in pageData?.data.replica_list" :key="index" >
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar2.jpg">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1"><b>{{ replica.name }}</b></q-item-label>
          <q-item-label lines="2" v-html="replica.text"></q-item-label>
        </q-item-section>
        <q-item-section side top>
          1 min ago
        </q-item-section>
      </q-item>
    </q-list>

    <div v-for="(input, index) in pageData?.fields" :key="index">
        <Teleport :to="`\#input_${input.index}`">
            <q-select
                dense bordered
                hide-dropdown-icon
                v-model="formData.fields[index].value"
                :options="formData.fields[index].options"
                :style="{ display: 'inline-block', minWidth: '50px', height: '35px', textAlign: 'center' }"
                :input-style="{ height: '25px', backgroundColor: 'black' }"
            >
                <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" class="positive">
                        <q-item-section avatar >
                            <q-icon v-if="scope.opt.is_correct" name="check" />
                            <q-icon v-else name="close" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label >{{ scope.opt.label }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>
        </Teleport>
    </div>

</template>

<script setup>
import { reactive, watch, defineEmits } from 'vue'
import { CONFIG } from '../../../config.js'

const props = defineProps({
    pageData: Object
})
const emits = defineEmits(['update-answer'])


const formData = reactive({
    fields: []
})
const renderData = () => {
    for(var i in props.pageData.data.replica_list){
        if(props.pageData.data.replica_list[i].text.indexOf('input') > -1){
            let inputIndex = props.pageData.data.replica_list[i].text.match(/{{input[0-9]+}}/g)[0].match(/[0-9]+/g)[0];
            props.pageData.data.replica_list[i].text = props.pageData.data.replica_list[i].text.replace(/\{\{input[0-9]+\}\}/, `<span id="input_${inputIndex}"></span>` )
        }
    }
}
const renderFields = () => {
    for(var k in props.pageData.fields){
        let field = props.pageData.fields[k]
        let value = ''
        let options = field.variants
        if(field.answer){
            if(field.answer.is_correct == 'wrong') {
                value = field.answer.wrong_answer
                options = [
                    {label: field.answer.wrong_answer, disable: true, is_correct: false},
                    {label: field.answer.correct_answer, disable: true, is_correct: true}
                ]
            } else {
                value = field.answer.correct_answer
                options = [{label: field.answer.correct_answer, disable: true, is_correct: true}]
            }
        }
        formData.fields.push({value: value, options: options})
    }
}

renderData()
renderFields()

watch(formData.fields, (newValue, oldValue) => {
    var answers = []
    for(var i in formData.fields){
        answers.push(formData.fields[i].value)
    }
    
    console.log(answers)
    emits('update-answer', answers)
})

</script>
