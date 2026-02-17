<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md " reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"  @click.stop="playAudio('click')"/>
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
                    <div class="text-h5"><b>{{user.active.data.name}}</b></div>
                    <div class="text-caption">{{user.active.data.username}}</div>
                </q-item-section>
                <q-item-section side>
                    <q-btn flat to="/user/edit" icon="edit" @click.stop="playAudio('click')"/>
                </q-item-section>
            </q-item>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form
            ref="form"
            v-model="formData.valid"
            @submit.prevent="validate()"
            autocomplete="off"
            class="full-width q-py-sm"
          >
          <q-list>
            <div class="text-subtitle1"><b>Режим письменности</b></div>
            <div v-if="formData.fields.writingMode.value == 'lat'" class="q-py-sm text-caption text-orange">
              <q-icon name="report_problem" color="orange" size="20px"></q-icon>
              Внимание! Выбрана латиница, но следует иметь в виду, что могут возникать ошибки и неточности. Рекомендуем выбрать кириллицу.
            </div>
            <div v-if="formData.fields.writingMode.value == 'cyr'" class="q-py-sm text-caption text-positive">
              Кириллица - не лучший выбор, но пока это лучшее, из того, что есть.
            </div>
            <q-item tag="label" v-ripple dense class="q-px-none"  @click.stop="playAudio('click')">
              <q-item-section avatar>
                <q-radio v-model="formData.fields.writingMode.value" val="cyr" @update:model-value="saveSetting('writingMode', formData.fields.writingMode.value)" @click.stop="playAudio('click')"/>
              </q-item-section>
              <q-item-section>
                <q-item-label><b>Кириллица (рекомендовано)</b></q-item-label>
                <q-item-label caption>Весь крымскотатарский текст будет написан на кириллической графике</q-item-label>
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple class="q-px-none"  @click.stop="playAudio('click')">
              <q-item-section avatar>
                <q-radio v-model="formData.fields.writingMode.value" val="lat" @update:model-value="saveSetting('writingMode', formData.fields.writingMode.value)" @click.stop="playAudio('click')"/>
              </q-item-section>
              <q-item-section>
                <q-item-label><b>Латиница</b></q-item-label>
                <q-item-label caption>Весь крымскотатарский текст будет написан на латинской графике</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator spaced/>
          <q-list>
            <div class="text-subtitle1"><b>Аудио</b></div>
            <q-item tag="label" v-ripple class="q-pl-none" @click.stop="playAudio('click')">
              <q-item-section>
                <q-item-label><b>Звуковые эффекты</b></q-item-label>
                <q-item-label caption>Звуки нажатий, переходов и многое другое</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-toggle
                  false-value="0"
                  true-value="1"
                  @click.stop="playAudio('click')"
                  v-model="formData.fields.soundFX.value" @update:model-value="saveSetting('soundFX', formData.fields.soundFX.value)"/>
              </q-item-section>
            </q-item>
            <q-item tag="label" class="q-pl-none" @click.stop="playAudio('click')" disable>
              <q-item-section>
                <q-item-label><b>Музыка (В разработке)</b></q-item-label>
                <q-item-label caption>Фоновая музыка, окружение</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-toggle disable
                  false-value="0"
                  true-value="1"
                  v-model="formData.fields.musicFX.value" @update:model-value="saveSetting('musicFX', formData.fields.musicFX.value)"/>
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator spaced/>
          <q-list>
            <div class="text-subtitle1"><b>Уведомления</b></div>
            <q-item tag="label" v-ripple class="q-pl-none" @click.stop="playAudio('click')">
              <q-item-section>
                <q-item-label><b>Push-уведомления</b></q-item-label>
                <q-item-label caption>Напоминания и новости</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  push
                  dense
                  class="q-px-sm"
                  icon="build"
                  color="primary"
                  :disable="permissionState === 'denied'"
                  to="/user/settings/push_notifications"
                />
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
                push color="dark" @click.stop="playAudio('click')"
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
import { playAudio } from 'src/services/audioService';
import { usePushNotification } from '../composables/usePushNotification';


const { isSubscribed, permissionState, subscribeUser } = usePushNotification();

const { user, signOut, saveItemSetting } = useUserStore()
const router = useRouter()
const form = ref(null)

const formData = reactive({
  valid: true,
  fields: {
    writingMode: {
      value: user.active.data.settings.writingMode.value,
      errors: '',
      isError: false,
      required: true
    },
    soundFX: {
      value: user.active.data.settings.soundFX?.value ?? '1',
      errors: '',
      isError: false,
      required: true
    },
    musicFX: {
      value: user.active.data.settings.musicFX?.value ?? '1',
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
