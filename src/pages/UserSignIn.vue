<template>
  <q-page-container>
    <q-app-header class="transparent text-white">
        <q-btn flat round dense icon="arrow_back" v-on:click="$router.go(-1);" v:slot="back-button"></q-btn>
        <q-toolbar-title></q-toolbar-title>
    </q-app-header>
    <q-page class="flex justify-center items-end full-height full-width text-center" style="padding-top: 50px">
      <q-form
        ref="form"
        v-model="formData.valid"
        @submit.prevent="validate()"
        autocomplete="off"
        class="full-width">
        <q-card v-if="formData.step == 1" class="rounded-b-0">
          <q-card-section>
            <div class="text-h6">Enter username</div>
            <div class="text-grey"></div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="formData.fields.username.value"
              :rules="formData.fields.username.rules"
              :error-messages="formData.fields.username.errors"
              :error="formData.fields.username.isError"
              label="Username or e-mail"
              bottom-slots
              required
            >
            <template v-slot:error>
              <span>{{ formData.fields.username.errors }}</span>
            </template></q-input>
          </q-card-section>
          <q-separator/>
          <q-card-actions vertical>
            <q-btn
                :disabled="!formData.valid"
                @click="checkUsernameValue()"
                v-on:keyup.enter="checkUsernameValue()"
                color="primary"
                label="Continue" />
          </q-card-actions>
        </q-card>
        <q-card v-if="formData.step == 2" class="rounded-b-0">
          <q-card-section>
            <div class="text-h6">Enter Pin</div>
            <div class="text-grey">It may be a pin or a standart password</div>
          </q-card-section>
          <q-card-section>
            <q-pin-field
              :modelValue="formData.fields.password.value"
              :rules="formData.fields.password.rules"
              v-on:update:onUpdate="formData.fields.password.value = $event"/>
          </q-card-section>
        </q-card>

      </q-form>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const form = ref(null)
const buttonLoading = ref(false)
const route = useRoute()
const router = useRouter()

const steps = [
  '', 'username', 'password'
]
const formData = reactive({
  step: route.params.step * 1,
  valid: true,
  fields: {
    username: {
      value: '',
      rules: [
        v => !!v || 'Username or e-mail is required'
      ],
      errors: '',
      isError: false,
      required: true
    },
    password: {
      value: '',
      rules: [
        v => !!v || '',
        v => (/^[0-9]{4,}$/.test(v)) || ''
      ],
      reveal: false,
      required: true
    },
  }
})

const { signIn, checkUsername, getAuth } = useUserStore()

const validate = async function () {
  formData.valid = await form.value.validate()
  if (formData.step === 2) {
    buttonLoading.value = true
    const credentials = {
      username: formData.fields.username.value,
      password: formData.fields.password.value
    }
    const authResponse = await getAuth(credentials)
    if (!authResponse.error) {
      const logged = await signIn(authResponse.auth_key)
      buttonLoading.value = false
      if (!logged.error) {
        return router.push('/user')
      }
    }
    return
  }
  if (formData.valid) formData.step++
  return router.push('/authorization/sign-in/step' + formData.step)
}

const checkUsernameValue = async function() {
  const checkUsernameResponse = await checkUsername({ username: formData.fields.username.value })
  if (!checkUsernameResponse) {
    formData.valid = false
    formData.fields.username.isError = true
    formData.fields.username.errors = 'No such user'
  } else {
    validate()
  }
}
watch(formData.fields, async (currentValue, oldValue) => {
  formData.valid = await form.value.validate()
})
watch(() => formData.fields.username.value, async (currentValue, oldValue) => {
  if (currentValue.length > 0) setTimeout(() => { formData.fields.username.isError = false }, 100)
})
watch(() => formData.fields.password.value, async (currentValue, oldValue) => {
  if (currentValue.length === 4) setTimeout(() => { validate()}, 100)
})
watch(() => route.params.step, async (currentValue, oldValue) => {
  if(route.name !== 'sign-in') return
  if (!formData.valid && route.params.step > formData.step) {
    router.go(-1)
    return false
  }
  formData.step = route.params.step * 1
  form.value.validate()
})
</script>
