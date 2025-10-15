<template>
  <q-page-container>
    <q-app-header class="transparent text-white">
        <q-btn flat round dense icon="arrow_back" @click="formData.step--" v:slot="back-button" @click.stop="playAudio('click')"></q-btn>
        <q-toolbar-title></q-toolbar-title>
    </q-app-header>
    <q-page class="flex justify-center items-end full-height full-width text-center" style="padding-top: 50px">
      <q-form
        ref="form"
        v-model="formData.valid"
        @submit.prevent="null"
        autocomplete="off"
        class="full-width q-desc-mx-quart">
        <q-card v-if="formData.step == 1" class="rounded-b-0">
          <q-card-section>
              <div class="text-h6"><b>Ваш логин</b></div>
              <div class="text-grey">Это может быть имя, никнейм или адрес электронной почты</div>
          </q-card-section>
          <q-card-section>
            <q-input
              standout
              v-model="formData.fields.username.value"
              :rules="formData.fields.username.rules"
              :error-messages="formData.fields.username.errors"
              :error="formData.fields.username.isError"
              @update:model-value="clearErrors()"
              v-on:keyup.enter="checkUsernameValue()"
              placeholder="Введите логин..."
              bottom-slots
              @focus="playAudio('click')"
              required
              autofocus
            >
            <template v-slot:error v-if="formData.fields.username.isError">
              <span>{{ formData.fields.username.errors }}</span>
            </template></q-input>
          </q-card-section>
          <q-card-actions vertical>
            <q-btn
                push
                :loading="buttonLoading"
                :disabled="!formData.valid"
                @click="checkUsernameValue()"
                color="primary" @click.stop="playAudio('click')"><b>Продолжить</b></q-btn>
          </q-card-actions>
        </q-card>
        <q-card v-if="formData.step == 2" class="rounded-b-0">
          <div v-if="!passwordResetDialog">
            <q-card-section>
                <div class="text-h6"><b>Ваш пароль</b></div>
                <div class="text-grey">Тот самый, который вы придумали, когда регистрировались</div>
            </q-card-section>
            <q-card-section>
              <q-input
                  standout
                  v-model="formData.fields.password.value"
                  :rules="formData.fields.password.rules"
                  :type="formData.fields.password.reveal ? 'text' : 'password'"
                  :error-messages="formData.fields.password.errors"
                  :error="formData.fields.password.isError"
                  v-on:keyup.enter="validate()"
                  @update:model-value="clearErrors()"
                  bottom-slots
                  @focus="playAudio('click')"
                  autofocus
                >
                  <template v-slot:append>
                    <q-icon
                      :name="formData.fields.password.reveal ? 'visibility' : 'visibility_off'"
                      class="cursor-pointer"
                      @click="formData.fields.password.reveal = !formData.fields.password.reveal"
                    />
                  </template>
                  <template v-slot:error v-if="formData.fields.password.isError">
                    <span>{{ formData.fields.password.errors }}</span>
                  </template>
                </q-input>
            </q-card-section>
            <q-card-actions vertical>
              <q-btn
                  push
                  :loading="buttonLoading"
                  :disabled="!formData.valid"
                  @click="validate()"
                  color="primary" @click.stop="playAudio('click')"><b>Войти</b></q-btn>
              <q-btn
                  flat
                  @click="passwordResetDialog = true"
                  color="primary"  @click.stop="playAudio('click')"><b>Не помню пароль</b></q-btn>
            </q-card-actions>
          </div>
        </q-card>
      </q-form>
      <q-dialog v-model="passwordResetDialog">
        <q-card style="min-width: 300px">
            <q-card-section v-if="!resetSent">
                <div class="text-subtitle1">Восстановление пароля</div>
                <div class="text-caption" v-if="!resetError">Введи адрес привязанной и подтвержденной электронной почты, а мы отправим туда ссылку для сброса пароля.</div>
                <div class="text-caption" v-else>Возникла ошибка. Проверь правильность электронной почты.</div>
                <q-input
                  ref="emailInput"
                  standout
                  v-model="formData.fields.email.value"
                  :rules="formData.fields.email.rules"
                  :error-messages="formData.fields.email.errors"
                  :error="formData.fields.email.isError"
                  v-on:keyup.enter="resetPassword()"
                  bottom-slots
                  @focus="playAudio('click')"
                  autofocus
                />
            </q-card-section>
            <q-card-section v-else>
                <div class="text-subtitle1">Восстановление пароля</div>
                <div class="text-caption">Мы отправили ссылку на указанную почту. Перейди по ней и создай новый пароль.</div>
            </q-card-section>
            <q-card-actions  v-if="!resetSent">
                <q-btn push color="primary" class="full-width" @click="resetPassword()" :disabled="emailInput.hasError" @click.stop="playAudio('click')"><b>Отправить</b></q-btn>
            </q-card-actions>
          </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import { reactive, ref, watch, onMounted, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { playAudio } from 'src/services/audioService';

const form = ref(null)
const buttonLoading = ref(false)
const route = useRoute()
const router = useRouter()

const { signIn, checkUsernameAuth, getAuth, sendResetPassword } = useUserStore()

const dialog = ref(false)
const passwordResetDialog = ref(false)
const resetSent = ref(false)
const emailInput = ref({})
const resetError = ref(false)

const formData = reactive({
  step: route.params.step * 1,
  valid: true,
  fields: {
    username: {
      value: '',
      realValue: '',
      rules: [
        v => !!v || 'Нужно ввести логин'
      ],
      errors: '',
      isError: false,
      required: true
    },
    password: {
      value: '',
      rules: [
        v => !!v || 'Нужно ввести пароль',
      ],
      errors: '',
      isError: false,
      reveal: false,
      required: true
    },
    email: {
      value: '',
      rules: [
        v => v === null || (v !== null && ((/.+@.+\..+/.test(v)))) || 'Электронная почта должна быть корректной'
      ],
      errors: ''
    },
  }
})

const validate = async function () {
  formData.valid = await form.value.validate()
  if (formData.step === 2) {
    buttonLoading.value = true
    const credentials = {
      username: formData.fields.username.realValue,
      password: formData.fields.password.value
    }
    const authResponse = await getAuth(credentials)
    if (!authResponse.error) {
      const logged = await signIn(authResponse.auth_key)
      buttonLoading.value = false
      if (logged && !logged.error) {
        return router.push('/user')
      }
    } else{
      formData.valid = false
      formData.fields.password.isError = true
      if(authResponse.messages.error == 'wrong_password') formData.fields.password.errors = 'Неверный пароль'
      if(authResponse.messages.error == 'blocked') formData.fields.password.errors = 'Герой заблокирован'
      if(authResponse.messages.error == 'not_found') formData.fields.password.errors = 'Такого героя не существует'
      if(authResponse.messages.error == 'too_many_attempts') formData.fields.password.errors = 'Многовато попыток. Повторите через пару минут'


    }
    return
  }
  if (formData.valid) formData.step++
}

const clearErrors = function () {
  formData.fields.username.isErrror = null;
  formData.fields.username.errors = null;
  formData.fields.password.isErrror = null;
  formData.fields.password.errors = null;
}
const checkUsernameValue = async function() {
  buttonLoading.value = true
  const checkUsernameResponse = await checkUsernameAuth({ username: formData.fields.username.value })
  buttonLoading.value = false
  if (checkUsernameResponse && checkUsernameResponse.error) {
    formData.valid = false
    formData.fields.username.isError = true
    formData.fields.username.errors = 'Такого героя не существует'
  } else {
    formData.fields.username.realValue = checkUsernameResponse
    validate()
  }
}
const resetPassword = async () => {
  const checkUsernameResponse = await sendResetPassword({email: formData.fields.email.value})
  if (checkUsernameResponse && checkUsernameResponse.error) {
    resetError.value = true
  } else {
    resetSent.value = true
    resetError.value = false
  }
}

onMounted(() => {
  formData.step = 1
  formData.fields.username.value = "";
  formData.fields.username.realValue = "";
  formData.fields.password.value = "";
})
onActivated(() => {
  formData.step = 1
  formData.fields.username.value = "";
  formData.fields.username.realValue = "";
  formData.fields.password.value = "";
})
watch(formData.fields, async (currentValue, oldValue) => {
  formData.valid = await form.value.validate()
  console.log(formData.fields.email.errors)
})


watch(() => formData.step, async (currentValue, oldValue) => {
  if(formData.step <= 0) router.go(-1);
  setTimeout(async () => {
    if(form.value){
      formData.valid = await form.value.validate()
    }
  }, 0)
})
</script>
