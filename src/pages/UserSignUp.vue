<template>
  <q-page-container>
    <q-app-header class="transparent text-white">
        <q-btn flat round dense icon="arrow_back" @click="formData.step--" v:slot="back-button" @click.stop="playAudio('click')"></q-btn>
        <q-toolbar-title></q-toolbar-title>
    </q-app-header>
    <q-page class="flex justify-center items-end full-height full-width text-center" style="padding-top: 50px">
      <q-form
        v-if="!mainStoryDialog"
        ref="form"
        v-model="formData.valid"
        @submit.prevent="validate()"
        autocomplete="off"
        class="full-width full-height column justify-end q-desc-mx-quart">
          <q-card v-if="formData.step == 1" class="ful-width rounded-b-0">
            <q-card-section>
              <div class="text-h6"><b>Создание нового героя</b></div>
              <div class="text-grey">Создайте своего героя и начните приключение</div>
            </q-card-section>
            <q-card-actions vertical>
              <q-btn
                  @click="validate()"
                  push
                  v-on:keyup.enter="validate()"
                  color="primary"
                  label="Вперёд!"
                  @click.stop="playAudio('click')"/>
              <div class="text-caption text-grey q-py-sm">Продолжая, вы соглашаетесь с <a class="cursor-pointer" @click="termsDialog = true;" @click.stop="playAudio('click')">нашими правилами</a>.</div>
            </q-card-actions>
          </q-card>
          <q-card v-else-if="formData.step == 2" class="ful-width rounded-b-0">
            <q-card-section>
              <div class="text-h6"><b>Как зовут героя?</b></div>
              <div class="text-grey">Придумай имя для своего героя</div>
            </q-card-section>
            <q-card-section>
              <q-input
                v-model="formData.fields.name.value"
                :rules="formData.fields.name.rules"
                :error-messages="formData.fields.name.errors"
                :error="formData.fields.name.isError"
                placeholder="Введи имя..."
                bottom-slots
                standout
                @focus.stop="playAudio('click')"
                debounce="400"
                required
              >
              <template v-slot:error>
                <span>{{ formData.fields.name.errors }}</span>
              </template></q-input>
              <div v-if="formData.fields.username.value !== ''" class="">Ваш никнейм будет: <b>{{ formData.fields.username.value }}</b></div>
            </q-card-section>
            <q-card-actions vertical>
              <q-btn
                  :disabled="!formData.valid"
                  @click="validate()"
                  push
                  v-on:keyup.enter="validate()"
                  color="primary"
                  label="Продолжить"
                  @click.stop="playAudio('click')"/>
            </q-card-actions>
          </q-card>
          <q-card v-else-if="formData.step == 3" class="ful-width rounded-b-0">
            <q-card-section>
              <div class="text-h6"><b>Мальчик или девочка?</b></div>
              <div class="text-grey">Этот выбор нельзя будет изменить</div>
            </q-card-section>
            <q-card-section>
              <q-btn-toggle
                v-model="formData.fields.gender.value"
                :rules="formData.fields.gender.rules"
                class="rounded-sm"
                push
                @click.stop="playAudio('click')"
                :text-color="(formData.fields.gender.value == 'male') ? 'red-4' : 'blue-4'"
                :toggle-color="(formData.fields.gender.value == 'male') ? 'blue' : 'red'"
                toggle-text-color="white"
                :options="[
                  {value: 'male', slot: 'maleSlot'},
                  {value: 'female', slot: 'femaleSlot'}
                ]"
                required
              >
              <template v-slot:maleSlot>
                <span style="text-shadow: none">Я мальчик</span>
              </template>
              <template v-slot:femaleSlot>
                <span style="text-shadow: none">Я девочка</span>
              </template>
              </q-btn-toggle>
            </q-card-section>
            <q-card-actions vertical>
              <q-btn
                  :disabled="!formData.valid"
                  @click="validate()"
                  push
                  v-on:keyup.enter="validate()"
                  color="primary"
                  label="Продолжить" @click.stop="playAudio('click')"/>
            </q-card-actions>
          </q-card>
          <q-card v-else-if="formData.step == 4" class="ful-width rounded-b-0">
            <q-card-section>
              <div class="text-h6"><b>Придумай пароль</b></div>
              <div class="text-grey">Он нужен для того, чтобы в любой момент продолжить путешествие</div>
            </q-card-section>
            <q-card-section>
              <q-input
                standout
                v-model="formData.fields.password.value"
                :rules="formData.fields.password.rules"
                :type="formData.fields.password.reveal ? 'text' : 'password'"
                placeholder="Придумай пароль..."
                @focus="playAudio('click')"
              >
                <template v-slot:append>
                  <q-icon
                    :name="formData.fields.password.reveal ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="formData.fields.password.reveal = !formData.fields.password.reveal; playAudio('click')"
                  />
                </template>
              </q-input>
            </q-card-section>
            <q-card-actions vertical>
              <q-btn
                  push
                  :disabled="!formData.valid"
                  @click="validate()"
                  v-on:keyup.enter="validate()"
                  color="primary"
                  label="Продолжить" @click.stop="playAudio('click')" />
            </q-card-actions>
          </q-card>
          <q-card v-else-if="formData.step == 5" class="ful-width rounded-b-0">
            <q-card-section>
              <div class="text-h6"><b>Повтори пароль</b></div>
              <div class="text-grey">И убедись, что помнишь его</div>
            </q-card-section>
            <q-card-section>
              <q-input
                standout
                v-model="formData.fields.passwordConfirm.value"
                :rules="formData.fields.passwordConfirm.rules"
                :type="formData.fields.passwordConfirm.reveal ? 'text' : 'password'"
                placeholder="Повтори пароль..."
                @focus="playAudio('click')"
              >
                <template v-slot:append>
                  <q-icon @click.stop="playAudio('click')"
                    :name="formData.fields.passwordConfirm.reveal ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="formData.fields.passwordConfirm.reveal = !formData.fields.passwordConfirm.reveal; ; playAudio('click')"
                  />
                </template>
              </q-input>
            </q-card-section>
            <q-card-actions vertical>
              <q-btn
                  push
                  :loading="buttonLoading"
                  :disabled="!formData.valid"
                  @click="validate()"
                  v-on:keyup.enter="validate()"
                  color="primary"
                  label="Продолжить" @click.stop="playAudio('click')"/>
            </q-card-actions>
          </q-card>
      </q-form>

    <q-dialog v-model="mainStoryDialog" maximized transition-show="fade" transition-hide="fade" class="full-width-important">
      <AppMainStorySlider @onEnded="mainStoryDialog = false"/>
    </q-dialog>
    <q-dialog v-model="termsDialog">
      <q-card class="q-push">
        <q-card-section>
          <div class="text-h6"><b>Правила пользования</b></div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          У нашего приключения есть определённые правила, которые необходимо соблюдать. Ознакомиться с ними можно <a @click.stop="playAudio('click')" href="https://docs.mektepium.com/terms.html" target="_blank">здесь</a>. Продолжая создание героя вы подтверждаете, что согласны с нашими условиями и правилами.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat  color="primary" v-close-popup @click.stop="playAudio('click')"><b>Окей</b></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</q-page-container>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import AppMainStorySlider from 'components/AppMainStorySlider.vue'
import { reactive, ref, watch, onActivated, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { playAudio } from 'src/services/audioService';

const { user, signUp, signIn, generateUsername } = useUserStore()
const route = useRoute()
const router = useRouter()
const mainStoryDialog = ref(false)

const buttonLoading = ref(false)
const termsDialog = ref(false)
const form = ref(null)

const formData = reactive({
  step: 1,
  passwordIsPin: true,
  valid: false,
  fields: {
    name: {
      value: '',
      rules: [
        v => !!v || 'Нужно ввести имя',
        v => v.length > 3 || 'Имя должно быть длиннее 3 символов',
        v => !(/[^A-Za-zА-Яа-я0-9\_ ]/.test(v)) || 'Только буквы и цифры'
      ],
      errors: '',
      isError: false,
      required: true
    },
    username: { value: '' },
    gender: {
      value: '',
      rules: [
        v => !!v || 'Нужно выбрать'
      ],
      errors: '',
      isError: false,
      required: true
    },
    password: {
      value: '',
      rules: [
        v => !!v || 'Нужно придумать пароль',
        v => v.length > 3 || 'Пароль должен быть не менее 4 символов'
      ],
      reveal: false,
      required: true
    },
    passwordConfirm: {
      value: '',
      rules: [
        v => !!v || 'Нужно подтвердить пароль',
        v => v.length > 3 || 'Пароль должен быть не менее 4 символов',
        v => v === formData.fields.password.value || 'Пароли не совпадают'
      ],
      reveal: false,
      required: true
    }
  }
})

const steps = [
  '', '', 'name', 'gender', 'password', 'passwordConfirm'
]
const validate = async function () {
  formData.valid = await form.value.validate()
  if (formData.step === 5) {
    buttonLoading.value = true
    const data = {
      name: formData.fields.name.value,
      username: formData.fields.username.value,
      password: formData.fields.password.value,
      passwordConfirm: formData.fields.passwordConfirm.value,
      gender: formData.fields.gender.value,
    }
    if(route.params.inviter_hash){
      data.inviter_hash = route.params.inviter_hash
    }
    const authResponse = await signUp(data)
    if (!authResponse.error) {
      const logged = await signIn(authResponse.auth_key)
      buttonLoading.value = false
      if (!logged.error) {
        return router.push('/user')
      }
    } else {
      formData.fields[steps[formData.step]].errors = authResponse.message
    }
    return
  }
  if (formData.valid) formData.step++
}
onActivated(() => {
  formData.fields.name.value = "";
  formData.fields.username.value = "";
  formData.fields.gender.value = "";
  formData.fields.password.value = "";
  formData.fields.passwordConfirm.value = "";
  formData.step = 1
  mainStoryDialog.value = true
})
onMounted(() => {
  formData.fields.name.value = "";
  formData.fields.username.value = "";
  formData.fields.gender.value = "";
  formData.fields.password.value = "";
  formData.fields.passwordConfirm.value = "";
  formData.step = 1
  mainStoryDialog.value = true
})
watch(formData.fields, async (currentValue, oldValue) => {
  formData.valid = await form.value.validate()
})
watch(() => formData.fields.name.value, async (currentValue, oldValue) => {
  setTimeout( async () => {
    if(!formData.valid || formData.fields.name.value == '') {
      return formData.fields.username.value = ''
    }
    const generateUsernameResponse = await generateUsername({ name: currentValue })
    if (!generateUsernameResponse.error) {
      formData.fields.username.value = generateUsernameResponse
    }
  }, 100)
})
watch(() => formData.step, async (currentValue, oldValue) => {
  if(formData.step <= 0) router.go(-1);
  if (formData.fields[steps[formData.step]] && formData.fields[steps[formData.step]].value === '') return formData.valid = false
  setTimeout(async () => {
    if(form.value){
      formData.valid = await form.value.validate()
    }
  }, 0)
})

</script>
