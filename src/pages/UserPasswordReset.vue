<template>
    <q-page-container>
        <q-page class="flex justify-center items-end  full-width text-center">
          <q-card v-if="isVerified" flat class="full-width rounded-b-0">
              <q-card-section >
                <q-form
                    ref="form"
                    v-model="formData.valid"
                    @submit.prevent="validate()"
                    no-error-focus
                    autocomplete="off"
                    class="full-width q-py-sm"
                  >
                    <q-input
                      v-model="formData.fields.password.value"
                      :rules="formData.fields.password.rules"
                      :error-message="formData.fields.password.errors"
                      :error="formData.fields.password.errors !== ''"
                      :type="formData.fields.password.reveal ? 'text' : 'password'"
                      label="Новый пароль"
                      @focus="playAudio('click')"
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
                      @focus="playAudio('click')"
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
              </q-card-section>
            <q-card-actions>
                <q-btn push color="primary" class="full-width" @click="resetPasswords()" :disabled="hasErrors" @click.stop="playAudio('click')"><b>Сохранить</b></q-btn>
            </q-card-actions>
          </q-card>
        </q-page>
    </q-page-container>
</template>

<script setup>
import { ref, watch, computed, reactive, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter, useRoute } from 'vue-router'
import { playAudio } from 'src/services/audioService';

const router = useRouter()
const route = useRoute()

const form = ref(null)
const isVerified = ref(false)

const { checkPasswordReset, finishPasswordReset } = useUserStore()

const hasErrors = computed(() => {
  return !formData.valid || formData.fields.password.errors != '' || formData.fields.passwordConfirm.errors != ''
})

const formData = reactive({
  valid: false,
  fields: {
    password: {
      value: '',
      rules: [
        v => !!v || 'Обязательное поле',
        v => (/^[0-9a-zA-Z]{4,}$/.test(v)) || 'Пароль должен быть не менее 4 символов',
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
const resetPasswords = async() => {
  const data = {
    password: formData.fields.password.value,
    password_confirm: formData.fields.passwordConfirm.value,
    code: route.params.reset_hash
  };
  const userPasswordResetResponse = await  finishPasswordReset(data)
  if(!userPasswordResetResponse.error){
      return router.push('/authorization')
  }
}
onMounted(async () => {
  const userPasswordResetVerificationResponse = await checkPasswordReset({code: route.params.reset_hash});
  if(!userPasswordResetVerificationResponse.error){
    isVerified.value = true;
  }
})
watch(() => formData.fields.password.value, async (currentValue, oldValue) => {
  formData.valid = await form.value.validate()
})
watch(() => formData.fields.passwordConfirm.value, async (currentValue, oldValue) => {
  formData.valid = await form.value.validate()
})
</script>
