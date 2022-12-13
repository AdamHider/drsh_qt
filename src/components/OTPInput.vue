<template>
    <div class="otp-container" @click="focus()">
      <div>{{label}}</div>
      <div ref="otpCont" class="v-digit-container">
        <input
          :type="type"
          class="v-digit-box ml-2 mr-2"
          v-for="(el, ind) in digits"
          :key="el+ind"
          v-model="digits[ind]"
          :autofocus="ind === 0"
          maxlength="1"
          @keydown="handleKeyDown($event, ind)"
        >
      </div>
    </div>
  </template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  default: String,
  digitCount: {
    type: Number,
    required: true
  },
  value: String,
  type: String,
  label: String,
  fieldConfig: Object
})
const emit = defineEmits(['update:otp', 'validate:otp'])

const digits = reactive([])

if (props.default && props.default.length === props.digitCount) {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = props.default.charAt(i)
  }
} else {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = null
  }
}

const otpCont = ref(null)

const handleKeyDown = function (event, index) {
  if (event.key !== 'Tab' &&
        event.key !== 'ArrowRight' &&
        event.key !== 'ArrowLeft'
  ) {
    event.preventDefault()
  }

  if (event.key === 'Backspace') {
    digits[index] = null

    if (index !== 0) {
      (otpCont.value.children)[index - 1].focus()
    }
    emit('update:otp', validate())
    return
  }

  if ((new RegExp('^([0-9])$')).test(event.key)) {
    digits[index] = event.key

    if (index !== props.digitCount - 1) {
      (otpCont.value.children)[index + 1].focus()
    }
  }
  emit('update:otp', validate())
}
const validate = function () {
  const value = digits.join('')
  const result = {
    value,
    valid: true
  }
  for (const i in props.fieldConfig.rules) {
    const validity = props.fieldConfig.rules[i](value)
    if (validity !== true) {
      result.valid = false
    }
  }
  console.log(result)
  return result
}
const focus = function () {
  let activeIndex = digits.join('').length
  if (activeIndex > digits.length - 1) {
    activeIndex = digits.length - 1
  }
  (otpCont.value.children)[activeIndex].focus()
}

emit('update:otp', validate())

</script>

<style scoped>
.otp-container{
  width: 100%;
}
.otp-container .v-label{
  --v-field-label-scale: 0.75em;
  font-size: var(--v-field-label-scale);
}
.v-digit-container{
  display: flex;
  justify-content: space-between;
}
.v-digit-box {
  height: 56px;
  width: 3rem;
  font-size: 30px;
  display: inline-block;
  border-radius: 4px 4px 0 0;
  position: relative;
  text-align: center;
  border: none;
  border-bottom: 1px solid lightgray;
  background: transparent;
}
.v-digit-box:focus {
  outline: none;
}

</style>
