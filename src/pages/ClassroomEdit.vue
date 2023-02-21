<template>
  <q-app-header class="bg-white rounded-b-md bordered" reveal>
      <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
      <q-toolbar-title>Classroom Edit</q-toolbar-title>
      <q-btn flat icon="check" @click="saveChanges()"/>
  </q-app-header>
  <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
      <q-form
        ref="form"
        v-model="formData.valid"
        @submit.prevent="validate()"
        autocomplete="off"
        class="full-width"
      >
          <div class="text-bold q-my-md">Description</div>
          <q-input
            outlined
            v-model="formData.fields.username.value"
            :rules="formData.fields.username.rules"
            :error-message="formData.fields.username.errors"
            :error="formData.fields.username.errors !== ''"
            label="Name"
            required
          >
          </q-input>
          <q-input
            outlined
            v-model="formData.fields.description.value"
            type="textarea"
            counter
            :rules="formData.fields.description.rules"
            :error-message="formData.fields.description.errors"
            :error="formData.fields.description.errors !== ''"
            label="Description"
          ></q-input>
          <div class="text-bold q-my-md">Privacy</div>
          <q-input
            outlined
            v-model="formData.fields.phone.value"
            :rules="formData.fields.phone.rules"
            :error-message="formData.fields.phone.errors"
            :error="formData.fields.phone.errors !== ''"
            mask="+# (###) ### - ## - ##"
            fill-mask
            unmasked-value
            label="Phone"
          ></q-input>

      </q-form>
  </q-page>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import { useClassroom } from '../composables/useClassroom'
import { reactive, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const form = ref(null)
const route = useRoute()
const router = useRouter()
const { user, checkUsername, checkdescription, saveItem } = useUserStore()
const { classroom, getItem } = useClassroom()

const formData = reactive({
  step: route.params.step,
  passwordIsPin: true,
  valid: true,
  fields: {
    username: {
      value: user.active.data.username,
      rules: [
        v => !!v || 'Username is required',
        v => v.length > 3 || 'Username must be at least 3 characters long'
      ],
      errors: '',
      suggestions: []
    },
    description: {
      value: user.active.data.description,
      rules: [
        v => v.length <= 300 || 'Description must be maximum 300 characters long'
      ],
      errors: ''
    },
    phone: {
      value: user.active.data.phone,
      rules: [
        v => v === '' || (v !== '' && (/\(?([0-9]{4})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(v))) || 'Phone must be valid'
      ],
      errors: '',
      suggestions: []
    }
  }
})

const saveChanges = async function () {
  formData.valid = await form.value.validate()
  if (formData.valid) {
    const data = {
      user_id: user.active.data.id,
      username: formData.fields.username.value,
      description: formData.fields.description.value,
      phone: formData.fields.phone.value
    }
    const saved = await saveItem(data)
    if (!saved.error) {
      return router.go(-1)
    } else {
      formData.fields[saved.data].errors = saved.message
    }
  }
}

watch(() => formData.fields.username.value, async (currentValue, oldValue) => {
  formData.fields.username.errors = ''
  const result = await checkUsername({ username: currentValue })
  if (result) {
    formData.fields.username.suggestions = result
    formData.fields.username.errors = 'Username is in use'
  }
})
watch(() => formData.fields.description.value, async (currentValue, oldValue) => {
  formData.fields.description.errors = ''
  if (!currentValue || /.+@.+\..+/.test(currentValue) === false) return
  const result = await checkdescription({ description: currentValue })
  console.log(result.messages)
  if (result.error) {
    formData.fields.description.errors = result.messages.error
    formData.valid = false
  }
})
onMounted(() => {
  getItem(route.params.classroom_id)
})
watch(() => route.params.classroom_id, (newData, oldData) => {
  getItem(route.params.classroom_id)
})
</script>
