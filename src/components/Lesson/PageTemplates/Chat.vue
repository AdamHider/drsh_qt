<template>
    <q-card>
        <q-img 
            cover
            width="250px" 
            :src="`${CONFIG.API_HOST}/${pageData?.data.image}`" />  
    </q-card>
    <q-list>
      <q-item  v-for="(replica, index) in replicaList.list" :key="index" >
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
    <div :id="`input_${formData.fields[current_input_index]?.index}`"></div>

    <div v-if="formData.fields[current_input_index]">
        <Teleport :to="`\#input_${formData.fields[current_input_index].index}`">
            <q-input
                dense
                v-model="formData.fields[current_input_index].value"
                :options="formData.fields[current_input_index].options"
                :color="(formData.fields[current_input_index].answer) ? ((formData.fields[current_input_index].answer.is_correct == 'correct') ? 'green' : 'negative') : 'primary'"
                :style="{ display: 'inline-block', minWidth: '50px', height: '18px', justifyContent: 'center', verticalAlign: 'bottom'  }"
                behavior="menu"
                :class="`q-select-inline ${(formData.fields[current_input_index].answer) ? ((formData.fields[current_input_index].answer.is_correct == 'correct') ? 'correct-answer' : 'wrong-answer') : ''}`"
                highlighted
            >
                <template v-slot:after>
                <q-btn round dense flat icon="send" />
                </template>
            </q-input>
        </Teleport>
    </div>

</template>

<script setup>
import { reactive, ref, watch, defineEmits, onActivated } from 'vue'
import { CONFIG } from '../../../config.js'

const props = defineProps({
    pageData: Object
})
const emits = defineEmits(['update-answer'])

const replicaList = reactive({
    list: []
})
const formData = reactive({
    fields: {}
})

const funny_emojis = ['😀', '😉', '😊', '😎', '😍', '🙂', '👍'];
const sad_emojis = ['😟', '😞', '😥', '😨', '😩'];
const current_answer_index = ref(0);
const current_input_index = ref(0);

const markRendered = function (){
    replicaList.list.reverse();
    let replicas_reversed = replicaList.list
    for(var i in replicas_reversed){
        if(replicas_reversed[i].type == 'answer') break
        replicas_reversed[i].rendered = false
    }
    
    replicas_reversed.reverse()
    replicaList.list = replicas_reversed
}

const setSortIndex = function (){
    let sort_index = 1
    for(var i in replicaList.list){
        replicaList.list[i].sort_index = 1
        if(!replicaList.list[i].rendered){
            replicaList.list[i].sort_index = sort_index
            sort_index++
        }
    }
}

const renderData = () => {
    for(var i in props.pageData.data.replica_list){
        let replica = props.pageData.data.replica_list[i]
        replica.rendered = true
        if(replica.type == 'answer'){
            if(!props.pageData.answers.answers || !props.pageData.answers.answers[current_answer_index.value]){
                break;
            } else {
                var answer = props.pageData.answers.answers[current_answer_index.value];
                console.log(answer)
                if(answer.is_correct == 'correct'){
                    replica.text = answer.correct_answer;
                    replica.reaction = funny_emojis[current_input_index.value];
                } else {
                    replica.text = answer.wrong_answer;
                    replica.reaction = sad_emojis[current_input_index.value];
                }
                if(answer.tmp_answer !== ""){
                    replicaList.list.push({
                        rendered: true,
                        type: 'answer',
                        reaction: replica.reaction,
                        text: answer.tmp_answer
                    });
                    replicaList.list.push({
                        rendered: true,
                        type: 'question',
                        text: 'I dont understand'
                    });
                    if(answer.is_temp){
                        break
                    }
                }
            }
            current_answer_index.value++;
            current_input_index.value++;
        }
        replicaList.list.push(replica)
        
        if(replica.type == 'answer'){
            if(answer && answer.tmp_answer && answer.is_correct !== 'correct'){
                replicaList.list.push({
                    "rendered": true,
                    "type": 'question',
                    "reaction": replica.reaction,
                    "text": 'Okay'
                });
            }
        }
        /*
        if(empty($system_answers[$index])){
            $current_input_index = $index + 1;
            break;
        }*/
    }
        console.log(current_answer_index)
        console.log(replicaList.list)
    markRendered();
    setSortIndex();

}
const renderFields = () => {
    if(!props.pageData.fields || props.pageData.answers.is_finished) return
    let field = props.pageData.fields[current_answer_index.value]
    let value = ''
    let options = field.variants
    if(field.answer){
        if(field.answer.is_correct == 'wrong') {
            value = field.answer.wrong_answer
        } else {
            value = field.answer.correct_answer
        }
    }
    formData.fields[current_answer_index.value] = {value: value, options: options, index: field.index };
    emits('update-answer', formData.fields)
}

renderData()
renderFields()

onActivated(() => {
    renderData()
    renderFields()
})

watch(formData.fields, (newValue, oldValue) => {
    emits('update-answer', formData.fields)
})

</script>

<style lang="scss">
.q-select.q-select-inline .q-field__control,
.q-select.q-select-inline .q-field__native {
  min-height: 18px;
  padding: 0;
}

.q-select.correct-answer.q-field--standard .q-field__control::before{
    border-color: $positive;
}
.q-select.wrong-answer.q-field--standard .q-field__control::before{
    border-color: $negative;
}
</style>