<template>
  <q-page-container>
    <q-app-header class="transparent text-white">
        <q-btn flat round dense icon="arrow_back" v-on:click="$router.go(-1);" v:slot="back-button"></q-btn>
        <q-toolbar-title></q-toolbar-title>
    </q-app-header>
    <q-page class="flex justify-center items-end full-height full-width text-center" style="padding-top: 50px">
      <q-form
        v-if="!mainStoryDialog"
        ref="form"
        v-model="formData.valid"
        @submit.prevent="validate()"
        autocomplete="off"
        class="full-width full-height column justify-end">

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
                  label="Вперёд!" />
            </q-card-actions>
          </q-card>
          <q-card v-else-if="formData.step == 2" class="ful-width rounded-b-0">
            <q-card-section>
              <div class="text-h6"><b>Как Вас зовут?</b></div>
              <div class="text-grey">Придумайте имя для своего героя</div>
            </q-card-section>
            <q-card-actions vertical>
              <q-btn
                  @click="validate()"
                  push
                  v-on:keyup.enter="validate()"
                  color="primary"
                  label="Вперёд!"/>
            </q-card-actions>
          </q-card>
          <q-card v-else-if="formData.step == 3" class="ful-width rounded-b-0">
            <q-card-section>
              <div class="text-h6"><b>Придумайте пин-код</b></div>
              <div class="text-grey">Он нужен для того, чтобы в любой момент продолжить путешествие</div>
            </q-card-section>
            <q-card-section>
              <q-pin-field
                :modelValue="formData.fields.password.value"
                :rules="formData.fields.password.rules"
                v-on:update:onUpdate="formData.fields.password.value = $event"/>
            </q-card-section>
            <q-separator/>
            <q-card-actions vertical>
              <q-btn
                  push
                  :disabled="!formData.valid"
                  @click="validate()"
                  v-on:keyup.enter="validate()"
                  color="primary"
                  label="Продолжить" />
            </q-card-actions>
          </q-card>
          <q-card v-else-if="formData.step == 4" class="ful-width rounded-b-0">
            <q-card-section>
              <div class="text-h6"><b>Повторите пин-код</b></div>
              <div class="text-grey">И убедитесь, что помните его</div>
            </q-card-section>
            <q-card-section>
              <q-pin-field
                modelValue="formData.fields.passwordConfirm.value"
                :rules="formData.fields.passwordConfirm.rules"
                v-on:update:onUpdate="formData.fields.passwordConfirm.value = $event"
              />
            </q-card-section>
            <q-separator />
            <q-card-actions vertical>
              <q-btn
                  push
                  :disabled="!formData.valid"
                  @click="validate()"
                  v-on:keyup.enter="validate()"
                  color="primary"
                  label="Продолжить" />
            </q-card-actions>
          </q-card>
          <q-card v-else-if="formData.step == 5" class="ful-width rounded-b-0">
            <q-card-section>
              <div class="text-h6">Do you agree with our Terms?</div>
              <div class="text-grey">It would be very nice, maybe</div>
            </q-card-section>
            <q-card-section>
              <q-item class="text-left" tag="label">
                <q-item-section avatar>
                  <q-field
                    borderless
                    hide-bottom-space
                    v-model="formData.fields.terms.value"
                    :rules="formData.fields.terms.rules"
                    no-error-icon
                  >
                    <template v-slot:control>
                      <q-checkbox
                        v-model="formData.fields.terms.value"
                      >
                      </q-checkbox>
                    </template>
                  </q-field>
                </q-item-section>
                <q-item-section>
                  <q-item-label>I agree with the Terms</q-item-label>
                </q-item-section>
              </q-item>
              <q-btn
                  class="full-width"
                  color="white"
                  text-color="primary"
                  icon="visibility"
                  @click="termsDialog = true;"
                  label="I want to see these terms" />
            </q-card-section>
            <q-separator />
            <q-card-actions vertical>
              <q-btn
                  :disabled="!formData.valid"
                  :loading="buttonLoading"
                  @click="validate()"
                  v-on:keyup.enter="validate()"
                  color="primary"
                  label="Sign Up" />
            </q-card-actions>
          </q-card>
      </q-form>

      <q-dialog v-model="mainStoryDialog" maximized transition-show="fade" transition-hide="fade">
        <AppMainStorySlider @onEnded="mainStoryDialog = false"/>
      </q-dialog>
    <q-dialog v-model="termsDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Terms Of Use</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Rerum repellendus sit voluptate voluptas eveniet porro.
          Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Rerum repellendus sit voluptate voluptas eveniet porro.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</q-page-container>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import PinField from 'components/PinField.vue'
import AppMainStorySlider from 'components/AppMainStorySlider.vue'
import { reactive, ref, watch, onActivated } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const { user, signUp, signIn } = useUserStore()
const route = useRoute()
const router = useRouter()
const mainStoryDialog = ref(true)

const buttonLoading = ref(false)
const termsDialog = ref(false)
const form = ref(null)
const formData = reactive({
  step: route.params.step * 1,
  passwordIsPin: true,
  valid: false,
  fields: {
    name: {
      value: '',
      rules: [
        v => !!v || 'Name is required'
      ],
      errors: '',
      isError: false,
      required: true
    },
    gender: {
      value: '',
      rules: [
        v => !!v || 'Gender is required'
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
    passwordConfirm: {
      value: '',
      rules: [
        v => !!v || '',,
        v => (/^[0-9]{4,}$/.test(v)) || '',
        v => (v === formData.fields.password.value) || 'Your passwords are different'
      ],
      reveal: false,
      required: true
    },
    terms: {
      value: false,
      rules: [
        v => !!v
      ]
    }
  }
})

const steps = [
  '', '', 'name', 'password', 'passwordConfirm', 'terms'
]
const validate = async function () {
  formData.valid = await form.value.validate()
  if (formData.step === 5) {
    buttonLoading.value = true
    const credentials = {
      password: formData.fields.password.value,
      passwordConfirm: formData.fields.passwordConfirm.value
    }
    const authResponse = await signUp(credentials)
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
  return router.push('/authorization/sign-up/step' + formData.step)
}
onActivated(() => {
  mainStoryDialog.value = true
})
watch(formData.fields, async (currentValue, oldValue) => {
  formData.valid = await form.value.validate()
})
watch(() => formData.fields.password.value, async (currentValue, oldValue) => {
  if (currentValue.length === 4) setTimeout(() => { validate()}, 100)
})
watch(() => formData.fields.passwordConfirm.value, async (currentValue, oldValue) => {
  if (currentValue.length === 4) validate()
})
watch(() => route.params.step, async (currentValue, oldValue) => {
  if(route.name !== 'sign-up') return
  if (!formData.valid && route.params.step > formData.step) {
    router.go(-1)
    return false
  }
  formData.step = route.params.step * 1
  if (formData.fields[steps[formData.step]] && formData.fields[steps[formData.step]]?.reveal === false) {
    formData.fields[steps[formData.step]].value = ''
  }
  if (formData.fields[steps[formData.step]] && formData.fields[steps[formData.step]].value === '') formData.valid = false
})

</script>
