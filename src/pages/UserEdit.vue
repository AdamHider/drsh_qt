<template>
  <q-page-container>
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
          <q-input
            v-model="formData.fields.username.value"
            :rules="formData.fields.username.rules"
            :error-message="formData.fields.username.errors"
            :error="formData.fields.username.errors !== ''"
            label="Name"
            required
          >
            <template v-if="formData.fields.username.errors == ''" v-slot:append>
                <q-icon color="success" name="check"></q-icon>
            </template>
          </q-input>
          <q-card
            v-if="(formData.fields.username.suggestions.length > 0)"
            class="mx-auto pa-2"
          >
            <q-list bordered separator class="q-my-sm">
              <q-item
                v-for="(item, index) in formData.fields.username.suggestions"
                :key="index"
                clickable
                :value="item"
                @click="(formData.fields.username.value = item); formData.fields.username.suggestions = []"
              >
                <q-item-section class="text-left">{{ item }}</q-item-section>
                <q-item-section side>
                  <q-icon name="check" color="positive" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
          <router-link to="edit/password" >Change password</router-link>
          <q-input
            v-model="formData.fields.email.value"
            :rules="formData.fields.email.rules"
            :error-message="formData.fields.email.errors"
            :error="formData.fields.email.errors !== ''"
            label="E-mail"
          ></q-input>
          <q-input
            v-model="formData.fields.phone.value"
            :rules="formData.fields.phone.rules"
            :error-message="formData.fields.phone.errors"
            :error="formData.fields.phone.errors !== ''"
            mask="+# (###) ### - ## - ##"
            fill-mask
            unmasked-value
            label="Phone"
          ></q-input>
        </q-form>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const form = ref(null)
const route = useRoute()
const router = useRouter()
const { user, checkUsername, checkEmail, saveItem } = useUserStore()

const formData = reactive({
  step: route.params.step,
  passwordIsPin: true,
  valid: true,
  fields: {
    username: {
      value: user.active.data.username,
      rules: [
        v => !!v || 'Username is required',
        v => v.length > 3 || 'Username must be at least 3 characters long'
      ],
      errors: '',
      suggestions: []
    },
    email: {
      value: user.active.data.email,
      rules: [
        v => v === null || (v !== null && ((/.+@.+\..+/.test(v)))) || 'E-mail must be valid'
      ],
      errors: ''
    },
    phone: {
      value: user.active.data.phone,
      rules: [
        v => v === null || (v !== null && (/\(?([0-9]{4})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(v))) || 'Phone must be valid'
      ],
      errors: '',
      suggestions: []
    }
  }
})

const saveChanges = async function () {
  formData.valid = await form.value.validate()
  if (formData.valid) {
    const data = {
      user_id: user.active.data.id,
      username: formData.fields.username.value,
      email: formData.fields.email.value,
      phone: formData.fields.phone.value
    }
    const saved = await saveItem(data)
    if (!saved.error) {
      return router.go(-1)
    } else {
      formData.fields[saved.data].errors = saved.message
    }
  }
}

watch(() => formData.fields.username.value, async (currentValue, oldValue) => {
  formData.fields.username.errors = ''
  const result = await checkUsername({ username: currentValue })
  if (result) {
    formData.fields.username.suggestions = result
    formData.fields.username.errors = 'Username is in use'
  }
})
watch(() => formData.fields.email.value, async (currentValue, oldValue) => {
  formData.fields.email.errors = ''
  if (!currentValue || /.+@.+\..+/.test(currentValue) === false) return
  const result = await checkEmail({ email: currentValue })
  console.log(result.messages)
  if (result.error) {
    formData.fields.email.errors = result.messages.error
    formData.valid = false
  }
})
</script>
