<template>
  <q-page-wrapper>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title>Change password</q-toolbar-title>
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
        <q-input v-if="formData.passwordIsPin"
            :input-style="{letterSpacing: '10px', fontSize: '20px', textAlign: 'center'}"
            v-model="formData.fields.oldPassword.value"
            :rules="formData.fields.oldPassword.rules"
            :error-message="formData.fields.oldPassword.errors"
            :type="formData.fields.oldPassword.reveal ? 'text' : 'password'"
            no-error-icon
            label="Old pin password"
            mask="####"
          />
          <q-input v-else
            v-model="formData.fields.oldPassword.value"
            :rules="formData.fields.oldPassword.rules"
            :error-message="formData.fields.oldPassword.errors"
            :type="formData.fields.oldPassword.reveal ? 'text' : 'password'"
            label="Old Password"
          >
            <template v-slot:append>
              <q-icon
                :name="formData.fields.oldPassword.reveal ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="formData.fields.oldPassword.reveal = !formData.fields.oldPassword.reveal"
              />
            </template>
          </q-input>

          <q-input v-if="formData.passwordIsPin"
            :input-style="{letterSpacing: '10px', fontSize: '20px', textAlign: 'center'}"
            v-model="formData.fields.password.value"
            :rules="formData.fields.password.rules"
            :error-message="formData.fields.password.errors"
            :error="formData.fields.password.errors !== ''"
            :type="formData.fields.password.reveal ? 'text' : 'password'"
            no-error-icon
            label="New pin password"
            mask="####"
          />
          <q-input v-else
            v-model="formData.fields.password.value"
            :rules="formData.fields.password.rules"
            :error-message="formData.fields.password.errors"
            :type="formData.fields.password.reveal ? 'text' : 'password'"
            label="New password"
          >
            <template v-slot:append>
              <q-icon
                :name="formData.fields.password.reveal ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="formData.fields.password.reveal = !formData.fields.password.reveal"
              />
            </template>
          </q-input>

          <q-input v-if="formData.passwordIsPin"
            :input-style="{letterSpacing: '10px', fontSize: '20px', textAlign: 'center'}"
            v-model="formData.fields.passwordConfirm.value"
            :rules="formData.fields.passwordConfirm.rules"
            :error-message="formData.fields.passwordConfirm.errors"
            :type="formData.fields.passwordConfirm.reveal ? 'text' : 'password'"
            no-error-icon
            label="Confirm new pin password"
            mask="####"
          />
          <q-input v-else
            v-model="formData.fields.passwordConfirm.value"
            :rules="formData.fields.passwordConfirm.rules"
            :error-message="formData.fields.passwordConfirm.errors"
            :type="formData.fields.passwordConfirm.reveal ? 'text' : 'password'"
            label="Confirm new password"
          >
            <template v-slot:append>
              <q-icon
                :name="formData.fields.passwordConfirm.reveal ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="formData.fields.passwordConfirm.reveal = !formData.fields.passwordConfirm.reveal"
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
        </q-form>
    </q-page>
  </q-page-wrapper>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const form = ref(null)
const router = useRouter()
const { savePassword } = useUserStore()

const formData = reactive({
  passwordIsPin: true,
  valid: true,
  fields: {
    oldPassword: {
      value: '',
      rules: [
        v => !!v || 'Required.',
        v => (/^[0-9a-zA-Z]{4,}$/.test(v)) || 'Password must contain at least one digit, be of latin and min 8 characters'
      ],
      errors: '',
      reveal: false
    },
    password: {
      value: '',
      rules: [
        v => !!v || 'Required.',
        v => (/^[0-9a-zA-Z]{4,}$/.test(v)) || 'Password must contain at least one digit, be of latin and min 8 characters'
      ],
      errors: '',
      reveal: false
    },
    passwordConfirm: {
      value: '',
      rules: [
        v => !!v || 'Required.',
        v => (v === formData.fields.password.value) || 'Your passwords are different'
      ],
      errors: '',
      reveal: false
    }
  }
})

const saveChanges = async function () {
  formData.valid = await form.value.validate()
  if (formData.valid) {
    const data = {
      old_password: formData.fields.oldPassword.value,
      password: formData.fields.password.value,
      password_confirm: formData.fields.passwordConfirm.value
    }
    const saved = await savePassword(data)
    if (!saved.error) {
      return router.go(-1)
    } else {
      formData.fields[saved.data].errors = saved.message
    }
    console.log(formData.fields[saved.data])
  }
}
</script>
