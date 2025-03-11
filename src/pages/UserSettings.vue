<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md " reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title><b>Настройки</b></q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
      <q-card flat>
        <q-card-section>
            <q-item class="q-pa-none">
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="user.active.data?.character?.image"/>
                  </q-avatar>
                </q-item-section>
                <q-item-section class="text-left">
                    <div class="text-h5"><b>{{user.active.data.username}}</b></div>
                </q-item-section>
                <q-item-section side>
                    <q-btn flat to="/user/edit" icon="edit"/>
                </q-item-section>
            </q-item>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1"><b>Режим письменности</b></div>
          <q-form
            ref="form"
            v-model="formData.valid"
            @submit.prevent="validate()"
            autocomplete="off"
            class="full-width q-py-sm"
          >
          <q-list>
            <q-item tag="label" v-ripple class="q-px-none">
              <q-item-section avatar>
                <q-radio v-model="formData.fields.writingMode.value" val="lat" @update:model-value="saveSetting('writingMode', formData.fields.writingMode.value)"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Латиница</q-item-label>
                <q-item-label caption>Весь крымскотатарский текст будет написан на латинской графике</q-item-label>
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple dense class="q-px-none">
              <q-item-section avatar>
                <q-radio v-model="formData.fields.writingMode.value" val="cyr" @update:model-value="saveSetting('writingMode', formData.fields.writingMode.value)"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Кириллица</q-item-label>
                <q-item-label caption>Весь крымскотатарский текст будет написан на кириллической графике</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          </q-form>
        </q-card-section>
        <q-card-actions>
            <q-btn
                class="full-width"
                @click="exitUser();"
                icon="logout"
                label="Выйти"
                push color="dark"
            />
        </q-card-actions>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'

const { user, signOut, saveItemSetting } = useUserStore()
const router = useRouter()
const form = ref(null)

const formData = reactive({
  valid: true,
  fields: {
    writingMode: {
      value: user.active.data.settings.writingMode.value,
      rules: [
        v => !!v || 'Нужно ввести имя',
        v => v.length > 3 || 'Имя должно быть минимум 3 символа',
        v => !(/[^A-Za-zА-Яа-я0-9\_ ]/.test(v)) || 'Только буквы и цифры'
      ],
      errors: '',
      isError: false,
      required: true
    },
  }
})
const saveSetting = async function (code, value) {
  formData.valid = await form.value.validate()
  if (formData.valid) {
    const saved = await saveItemSetting({code, value})
    if (saved.error) {
      formData.fields[code].errors = saved.message
    }
  }
}
const exitUser = async function () {
  await signOut()
  return router.push('/authorization')
}
</script>
