<template>
  <div v-if="formData.fields.length > 0">
        <div v-for="(input, index) in formData.fields" :key="index">
            <Teleport :to="`\#input_${input.index}`">
                <div class="row justify-between  full-width">
                  <div class="col-6 q-pa-sm " v-for="(image, imageIndex) in formData.fields[index].options" :key="imageIndex">
                    <q-card
                      :class="`${(formData.fields[index].value == image.text) ?  'bg-purple text-white' : ''}`"
                      @click="formData.fields[index].value = image.text" >
                        <q-img v-if="image.image"
                          :src="`${CONFIG.API_HOST}/${image.image}`"
                        >
                        </q-img>
                        <q-card-section
                          vertical
                          class="flex flex-center text-center"
                        >
                          <b>{{ image.text }}</b>
                        </q-card-section>
                    </q-card>
                  </div>
                </div>
            </Teleport>
        </div>
  </div>
</template>

<script setup>
import { reactive, watch, defineEmits } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { CONFIG } from '../../../config.js'

const emits = defineEmits(['update-answer', 'onAnswerSaved'])
const { lesson } = useLesson()

const formData = reactive({
  fields: []
})
const renderFields = () => {
  formData.fields = []
  if (!lesson.active.page.fields) return
  for (const k in lesson.active.page.fields) {
    const field = lesson.active.page.fields[k]
    let value = false
    const options = field.variants
    if (field.answer) {
      value = field.answer.value
    }
    formData.fields.push({ value, options, index: field.index, answer: field.answer, label: field.label })
  }
  emits('update-answer', formData.fields)
}

renderFields()

watch(() => lesson.active.page, (newValue, oldValue) => {
  renderFields()
})

watch(formData.fields, (newValue, oldValue) => {
  emits('update-answer', formData.fields)
})
</script>

<style>
.q-radio__inner{
  display: none;
}

</style>
