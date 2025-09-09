<template>
  <q-page-wrapper>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title><b>Изменить пароль</b></q-toolbar-title>
        <q-btn v-if="!hasErrors" flat icon="check" @click="saveChanges()"/>
    </q-app-header>
    <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
        <q-form
          ref="form"
          v-model="formData.valid"
          @submit.prevent="validate()"
          no-error-focus
          autocomplete="off"
          class="full-width q-py-sm"
        >
          <q-input
            v-model="formData.fields.oldPassword.value"
            :rules="formData.fields.oldPassword.rules"
            :error-message="formData.fields.oldPassword.errors"
            :error="formData.fields.oldPassword.errors !== ''"
            :type="formData.fields.oldPassword.reveal ? 'text' : 'password'"
            label="Старый пароль"
            standout
          >
            <template v-slot:append>
              <q-icon
                :name="formData.fields.oldPassword.reveal ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="formData.fields.oldPassword.reveal = !formData.fields.oldPassword.reveal"
              />
            </template>
          </q-input>

          <q-input
            v-model="formData.fields.password.value"
            :rules="formData.fields.password.rules"
            :error-message="formData.fields.password.errors"
            :error="formData.fields.password.errors !== ''"
            :type="formData.fields.password.reveal ? 'text' : 'password'"
            label="Новый пароль"
            class="q-my-md"
            standout
          >
            <template v-slot:append>
              <q-icon
                :name="formData.fields.password.reveal ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="formData.fields.password.reveal = !formData.fields.password.reveal"
              />
            </template>
          </q-input>

          <q-input
            v-model="formData.fields.passwordConfirm.value"
            :rules="formData.fields.passwordConfirm.rules"
            :error-message="formData.fields.passwordConfirm.errors"
            :error="formData.fields.passwordConfirm.errors !== ''"
            :type="formData.fields.passwordConfirm.reveal ? 'text' : 'password'"
            label="Повтори новый пароль"
            class="q-my-md"
            standout
          >
            <template v-slot:append>
              <q-icon
                :name="formData.fields.passwordConfirm.reveal ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="formData.fields.passwordConfirm.reveal = !formData.fields.passwordConfirm.reveal"
              />
            </template>
          </q-input>
        </q-form>
    </q-page>
  </q-page-wrapper>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import { reactive, ref, computed, watch, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'

const form = ref(null)
const router = useRouter()
const { savePassword } = useUserStore()
const hasChanges = ref(false)

const hasErrors = computed(() => {
  return !formData.valid || formData.fields.oldPassword.errors != '' || formData.fields.password.errors != '' || formData.fields.passwordConfirm.errors != ''
})

const formData = reactive({
  valid: false,
  fields: {
    oldPassword: {
      value: '',
      rules: [
        v => !!v || 'Обязательное поле',
        v => (/^[0-9a-zA-Z]{4,}$/.test(v)) || 'Пароль должен быть не менее 4 символов'
      ],
      errors: ''
    },
    password: {
      value: '',
      rules: [
        v => !!v || 'Обязательное поле',
        v => (/^[0-9a-zA-Z]{4,}$/.test(v)) || 'Пароль должен быть не менее 4 символов',
        v => v !== formData.fields.oldPassword.value || 'Пароль должен отличаться от старого'
      ],
      errors: ''
    },
    passwordConfirm: {
      value: '',
      rules: [
        v => !!v || 'Обязательное поле',
        v => (v === formData.fields.password.value) || 'Пароли не совпадают'
      ],
      errors: ''
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
      if(saved.messages.error == 'wrong_password'){
        formData.fields.oldPassword.errors = 'Неверный старый пароль'
      }
      if(saved.messages.error == 'empty_password'){
        formData.fields.password.errors = 'Пароль не может быть пустым'
      }
      if(saved.messages.error == 'different_password'){
        formData.fields.passwordConfirm.errors = 'Пароли не совпадают'
      }
    }
  }
}
onActivated(async () => {
  formData.fields.oldPassword.value = ''
  formData.fields.password.value = ''
  formData.fields.passwordConfirm.value = ''
  await form.value.reset()
})
onDeactivated(async () => {
  formData.fields.oldPassword.value = ''
  formData.fields.password.value = ''
  formData.fields.passwordConfirm.value = ''
  await form.value.reset()
})


watch(() => formData.fields.oldPassword.value, async (currentValue, oldValue) => {
  formData.valid = await form.value.validate()
})
watch(() => formData.fields.password.value, async (currentValue, oldValue) => {
  formData.valid = await form.value.validate()
})
watch(() => formData.fields.passwordConfirm.value, async (currentValue, oldValue) => {
  formData.valid = await form.value.validate()
})

</script>
