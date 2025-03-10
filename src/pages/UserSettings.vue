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
          <q-form
            ref="form"
            v-model="formData.valid"
            @submit.prevent="validate()"
            autocomplete="off"
            class="full-width q-py-sm"
          >
            <q-select
              filled
              v-model="formData.fields.writingMode.value"
              emit-value
              :options="[
                {
                  label: 'Латиница',
                  value: 'lat'
                },
                {
                  label: 'Кириллица',
                  value: 'cyr'
                }
              ]"
              map-options
              label="Режим письма"
            />
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
import { reactive } from 'vue'

const { user, signOut } = useUserStore()
const router = useRouter()

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
const saveChanges = async function () {
  formData.valid = await form.value.validate()
  if (formData.valid) {
    const data = {
      name: formData.fields.phone.value
    }
    const saved = await saveItem(data)
    if (!saved.error) {
      return router.go(-1)
    } else {
      formData.fields[saved.data].errors = saved.message
    }
  }
}
const exitUser = async function () {
  await signOut()
  return router.push('/authorization')
}
</script>
