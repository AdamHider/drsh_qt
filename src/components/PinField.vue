<template>
    <q-field
      borderless
      :model-value="model"
      :rules="rules"
      hide-bottom-space
      hide-hint
      no-error-icon
      :error-messages="false">
        <template v-slot:control>
          <div :class="`q-input-pin row justify-between ${(!showPassword) ? 'hide-pass' : ''}`">
            <div class="col"><div class="subfield">
              <div v-if="model.split('')[0]">
                <b v-if="showPassword">{{model.split('')[0]}}</b>
                <b v-else class="dot">•</b>
              </div>
            </div></div>
            <div class="col"><div class="subfield">
              <div v-if="model.split('')[1]">
                <b v-if="showPassword">{{model.split('')[1]}}</b>
                <b v-else class="dot">•</b>
              </div>
            </div></div>
            <div class="col"><div class="subfield">
              <div v-if="model.split('')[2]">
                <b v-if="showPassword">{{model.split('')[2]}}</b>
                <b v-else class="dot">•</b>
              </div>
            </div></div>
            <div class="col"><div class="subfield">
              <div v-if="model.split('')[3]">
                <b v-if="showPassword">{{model.split('')[3]}}</b>
                <b v-else class="dot">•</b>
              </div>
            </div></div>
          </div>
        </template>
      </q-field>
      <div class="q-pa-md">
        <div class="row">
          <div class="col"><q-btn color="primary" class="full-width" size="lg" flat label="1" @click="press(1)" /></div>
          <div class="col"><q-btn color="primary" class="full-width" size="lg" flat label="2" @click="press(2)" /></div>
          <div class="col"><q-btn color="primary" class="full-width" size="lg" flat label="3" @click="press(3)" /></div>
        </div>
        <div class="row">
          <div class="col"><q-btn color="primary" class="full-width" size="lg" flat label="4" @click="press(4)" /></div>
          <div class="col"><q-btn color="primary" class="full-width" size="lg" flat label="5" @click="press(5)" /></div>
          <div class="col"><q-btn color="primary" class="full-width" size="lg" flat label="6" @click="press(6)" /></div>
        </div>
        <div class="row">
          <div class="col"><q-btn color="primary" class="full-width" size="lg" flat label="7" @click="press(7)" /></div>
          <div class="col"><q-btn color="primary" class="full-width" size="lg" flat label="8" @click="press(8)" /></div>
          <div class="col"><q-btn color="primary" class="full-width" size="lg" flat label="9" @click="press(9)" /></div>
        </div>
        <div class="row">
          <div class="col"><q-btn color="grey" class="full-width" size="lg" flat @click="showPassword = !showPassword" >
            <q-icon size="sm" :name="(showPassword) ? 'visibility' : 'visibility_off'"></q-icon></q-btn>
          </div>
          <div class="col"><q-btn color="primary" class="full-width" size="lg" flat label="0" @click="press(0)" /></div>
          <div class="col"><q-btn color="grey" class="full-width" size="lg" flat @click="backspace()" ><q-icon size="sm" name="backspace"></q-icon></q-btn></div>
        </div>
      </div>
</template>
<script setup>
import { ref, watch, toRefs, onMounted, onDeactivated } from 'vue'

const props = defineProps({
  modelValue: String,
  rules: Array,
  label: String
})
const emit = defineEmits(['update:onUpdate'])

const model = ref('')
const showPassword = ref(false)
const pressed = ref(false)
const rules = toRefs(props).rules

const backspace = () => {
  model.value = model.value.substring(0, model.value.length - 1)
}
const press = (val) => {
  if (pressed.value) {
      return;
  }
  pressed.value = true;
  model.value += val
  setTimeout(function(){
    pressed.value = false;
  }, 10);

}
watch(model, () => {
  emit('update:onUpdate', model.value)
})
onMounted(() => {
  emit('update:onUpdate', model.value)
})
onDeactivated(() => {
  console.log('deactivated')
  model.value = props.modelValue
  emit('update:onUpdate', model.value)
})
</script>
<style scoped>
.q-input-pin{
  margin: 0 auto;
}
.q-input-pin .subfield{
  background: #eee;
  height: 4em;
  width: 3em;
  margin: 0.5em;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.q-input-pin .subfield b{
  font-size: 2em;
  line-height: 3em;
}
.q-input-pin .subfield b.dot{
  font-size: 3em;
}
</style>
