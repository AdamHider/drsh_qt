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
                color="primary"
                label="Продолжить"
                @click.stop="playAudio('click')"/>
          </q-card-actions>
        </q-card>
        <q-card v-if="formData.step == 2" class="rounded-b-0">
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
                color="primary"
                label="Войти" @click.stop="playAudio('click')"/>
          </q-card-actions>
        </q-card>
      </q-form>
      <q-dialog v-model="dialog">
          <q-card style="min-width: 300px">
              <q-card-section>
                  <div class="text-h6">Choose user</div>
              </q-card-section>
                  <q-list lines="two">
                      <q-item clickable v-ripple
                          v-for="(userItem, index) in user.list" :key="index">

                          <q-item-section>
                              <q-item-label lines="1">{{userItem.data?.username}}</q-item-label>
                              <q-item-label caption><b>Level:</b> {{userItem.data?.level?.level}}</q-item-label>
                          </q-item-section>

                          <q-item-section side>
                              <q-btn
                                  flat
                                  :disabled="(userItem.data?.id == user.active.data.id)"
                                  :loading="btnLoading[index]"
                                  @click="switchUser(userItem, index)"
                              >Sign In</q-btn>
                          </q-item-section>
                      </q-item>
                  </q-list>
              <q-card-actions align="right" class="bg-white text-teal">
                  <q-btn flat label="Закрыть" v-close-popup @click.stop="playAudio('click')"/>
              </q-card-actions>
              <q-separator color="white" v-if="(Object.keys(user.list).length > 0)" class="q-mx-md"></q-separator>
              <q-card-section  v-if="(Object.keys(user.list).length > 0)">
                <q-btn color="dark" push @click="dialog=true">Выбрать аккаунт</q-btn>
              </q-card-section>
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

const { signIn, checkUsernameAuth, getAuth } = useUserStore()

const dialog = ref(false)

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
const switchUser = async (userItem, key) => {
  btnLoading.value[key] = true
  await signIn(userItem.authorization)
  btnLoading.value[key] = false
  dialog.value = false
  return router.push('/user')
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
})


watch(() => formData.step, async (currentValue, oldValue) => {
  if(formData.step <= 0) router.go(-1);
  setTimeout(async () => {
    if(form.value){
      //formData.valid = await form.value.validate()
    }
  }, 0)
})
</script>
