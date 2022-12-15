<template>
  <q-page class="bg-white q-pa-sm">
      <q-form
        ref="form"
        v-model="formData.valid"
        @submit.prevent="validate()"
        autocomplete="off"
        class="full-width"
      >
        <q-input
          v-model="formData.fields.name.value"
          :rules="formData.fields.name.rules"
          :error-message="formData.fields.name.errors"
          :error="formData.fields.name.errors !== ''"
          label="Name"
          required
        >
          <template v-if="formData.valid" v-slot:append-inner>
              <v-icon color="success" icon="mdi-check"></v-icon>
          </template>
        </q-input>
        <q-input
          v-model="formData.fields.username.value"
          :rules="formData.fields.username.rules"
          :error-message="formData.fields.username.errors"
          :error="formData.fields.username.errors !== ''"
          label="Name"
          required
        >
          <template v-if="formData.valid" v-slot:append-inner>
              <v-icon color="success" icon="mdi-check"></v-icon>
          </template>
          <template  v-slot:append-outer>
              <v-icon color="success" icon="mdi-change"></v-icon>
          </template>
        </q-input>
        <q-card
          v-if="(formData.fields.username.suggestions.length > 0)"
          class="mx-auto pa-2"
        >
          <q-list bordered separator>
            <q-item
              v-for="(item, index) in formData.fields.username.suggestions"
              :key="index"
              :value="item"
              @click="(formData.fields.username.value = item); formData.fields.username.suggestions = []"
            >
              <q-item-section class="text-left">{{ item }}</q-item-section>
              <q-item-section side>
                <q-icon name="check" color="positive" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
        <q-btn
            class="full-width"
            rounded="lg"
            to="edit/password"
            append-icon="mdi-pencil"
            label="Change password"
        />
        <q-input
          v-model="formData.fields.email.value"
          :rules="formData.fields.email.rules"
          :error-message="formData.fields.email.errors"
          label="E-mail"
          required
        ></q-input>
      </q-form>
  </q-page>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const form = ref(null)
const route = useRoute()
const router = useRouter()
const { user, checkUsername, checkEmail, save } = useUserStore()

const formData = reactive({
  step: route.params.step,
  passwordIsPin: true,
  valid: true,
  fields: {
    name: {
      value: user.active.data.name,
      rules: [
        v => !!v || 'Name is required',
        v => v.length > 3 || 'Name must be at least 3 characters long'
      ],
      errors: '',
      suggestions: []
    },
    username: {
      value: user.active.data.username,
      rules: [
        v => !!v || 'Username is required',
        v => v.length > 3 || 'Username must be at least 3 characters long'
      ],
      errors: '',
      suggestions: []
    },
    email: {
      value: user.active.data.email,
      rules: [
        v => v === '' || ((/.+@.+\..+/.test(v)) || 'E-mail must be valid')
      ],
      errors: '',
      required: false
    },
    terms: {
      value: false
    }
  }
})

const saveChanges = async function () {
  formData.valid = await form.value.validate()
  if (formData.valid) {
    const data = {
      name: formData.fields.name.value,
      username: formData.fields.username.value,
      email: formData.fields.email.value
    }
    const saved = await save(data)
    if (saved.success) {
      return router.push('/user')
    } else {
      formData.fields[saved.data].errors = saved.message
    }
  }
}

watch(() => formData.fields.username.value, async (currentValue, oldValue) => {
  formData.fields.username.errors = ''
  const result = await checkUsername({ username: currentValue })
  if (!result.success) {
    formData.fields.username.errors = result.message
  }
  formData.fields.username.suggestions = result.data
})
watch(() => formData.fields.email.value, async (currentValue, oldValue) => {
  formData.fields.email.errors = ''
  if (!currentValue) return
  const result = await checkEmail({ email: currentValue })
  if (!result.success) {
    formData.fields.email.errors = result.message
    formData.valid = false
  }
})
defineExpose({
  saveChanges
})
</script>
