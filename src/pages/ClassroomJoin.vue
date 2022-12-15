<template>
  <q-page class="flex justify-center items-end full-height full-width text-center">
      <q-form
        ref="form"
        v-model="formData.valid"
        @submit.prevent="validate()"
        autocomplete="off"
        class="full-width"
      >
        <q-card class="rounded-b-0">
          <q-card-section>
            <div class="text-h6">Join a new classroom</div>
            <div class="text-gray">Just fill a code of a classroom and ride on!</div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="formData.fields.classroom_code.value"
              :rules="formData.fields.classroom_code.rules"
              :error="!formData.valid"
              :error-message="formData.fields.classroom_code.errors"
              label="Classroom code"
              required
            ></q-input>
          </q-card-section>
          <q-card-actions vertical>
            <q-btn
              :disabled="!formData.valid"
              :loading="loading"
              color="primary"
              @click="validate()"
              v-on:keyup.enter="validate()"
              label="Join"
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </q-page>
</template>

<script setup >
import { useRouter, useRoute } from 'vue-router'
import { onMounted, reactive, ref, watch } from 'vue'

import { useClassroom } from '../composables/useClassroom'
import { useUserStore } from '../stores/user'

const form = ref(null)
const loading = ref(false)
const router = useRouter()
const { checkIfExists } = useClassroom()
const { user, signIn, signOut } = useUserStore()

const formData = reactive({
  valid: true,
  fields: {
    classroom_code: {
      value: '',
      rules: [
        v => !!v || 'Classroom code is required',
        v => (v && v.length > 5) || 'Classroom code must be valid'
      ],
      errors: ''
    }
  }
})

const validate = async function () {
  const valid = await form.value.validate()
  loading.value = true
  if (valid) {
    const auth = {
      username: user.active.authorization.username,
      password: user.active.authorization.password,
      classroom_code: formData.fields.classroom_code.value
    }
    await signOut()
    const isset = await signIn(auth)
    loading.value = false
    if (isset) return router.push('/user-startup')
    formData.fields.classroom_code.errors = 'Error'
  }
}

const route = useRoute()
if (route.params.code != 0) {
  formData.fields.classroom_code.value = route.params.code
}

onMounted(() => {
  if (route.params.code != 0) {
    validate()
  }
})

watch(() => formData.fields.classroom_code.value, async (currentValue, oldValue) => {
  if (currentValue.length > 5) {
    const checkResponse = await checkIfExists(currentValue)
    if (!checkResponse.success) {
      formData.valid = false
      formData.fields.classroom_code.errors = checkResponse.message
      return
    }
  }
  formData.fields.classroom_code.errors = ''
  formData.valid = true
})

</script>
