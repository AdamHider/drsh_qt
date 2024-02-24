<template>
  <q-page-container>
    <q-app-header class="transparent text-white">
        <q-btn flat round dense icon="arrow_back" v-on:click="$router.go(-1);" v:slot="back-button"></q-btn>
        <q-toolbar-title></q-toolbar-title>
    </q-app-header>
    <q-page class="flex justify-center items-end full-height full-width text-center">
      <q-form
        ref="form"
        v-model="formData.valid"
        @submit.prevent="validate()"
        autocomplete="off"
        class="full-width">
        <q-card class="rounded-b-0">
          <q-card-section>
            <div class="text-h6">Join us over again</div>
            <div class="text-grey">Just enter your account data and get ready to lift off</div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="formData.fields.username.value"
              :rules="formData.fields.username.rules"
              :error-messages="formData.fields.username.errors"
              label="Username or e-mail"
              required
            ></q-input>
              <q-input v-if="formData.passwordIsPin"
                :input-style="{letterSpacing: '10px', fontSize: '20px', textAlign: 'center'}"
                v-model="formData.fields.password.value"
                :rules="formData.fields.password.rules"
                :error-messages="formData.fields.password.errors"
                :type="formData.fields.password.reveal ? 'text' : 'password'"
                no-error-icon
                label="Pin password"
                mask="####"
              />
              <q-input v-else
                v-model="formData.fields.password.value"
                :rules="formData.fields.password.rules"
                :error-messages="formData.fields.password.errors"
                :type="formData.fields.password.reveal ? 'text' : 'password'"
                label="Password"
              >
                <template v-slot:append>
                  <q-icon
                    :name="formData.fields.password.reveal ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="formData.fields.password.reveal = !formData.fields.password.reveal"
                  />
                </template>
              </q-input>
              <q-btn-toggle
                  v-model="formData.passwordIsPin"
                  spread
                  no-caps
                  :options="[
                    {label: 'Use pin', value: true},
                    {label: 'Use password', value: false}
                  ]"
                />
          </q-card-section>
          <q-separator />
          <q-card-actions vertical>
            <q-btn
                :disabled="!formData.valid"
                :loading="buttonLoading"
                @click="validate()"
                v-on:keyup.enter="validate()"
                color="primary"
                label="Sign in" />
          </q-card-actions>
        </q-card>
      </q-form>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const form = ref(null)
const buttonLoading = ref(false)
const route = useRoute()
const router = useRouter()

const formData = reactive({
  step: route.params.step * 1,
  passwordIsPin: true,
  valid: true,
  fields: {
    username: {
      value: '',
      rules: [
        v => !!v || 'Username or e-mail is required'
      ]
    },
    password: {
      value: '',
      rules: [
        v => !!v || 'Required.',
        v => (/^[0-9a-zA-Z]{4,}$/.test(v)) || 'Password must contain at least one digit, be of latin and min 8 characters'
      ],
      errors: '',
      reveal: false
    }
  }
})

const { signIn, getAuth } = useUserStore()

const validate = async function () {
  formData.valid = await form.value.validate()
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
}
</script>
