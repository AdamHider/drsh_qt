<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md " reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"  @click.stop="playAudio('click')"/>
        <q-toolbar-title><b>Уведомления</b></q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
      <q-card flat>
        <q-card-section class="q-pt-sm text-center">
          <div class="text-subtitle1"><b>Статус уведомлений</b></div>
          <div class="text-caption">Уведомления позволяют сохранять темп изучения и быть в курсе последних обновлений</div>
          <div class="q-mt-sm">
            <q-btn v-if="subscribeBtn" @click="handleSubscribe(); playAudio('click')" push color="primary">Включить уведомления</q-btn>
            <q-btn v-else-if="isSubscribed" @click="playAudio('click')" push color="primary" disable>Уведомления включены</q-btn>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pt-none">
          <q-form
            ref="form"
            v-model="formData.valid"
            @submit.prevent="validate()"
            autocomplete="off"
            class="full-width q-py-sm"
          >
            <q-list>
              <q-item tag="label" v-ripple class="q-pl-none" @click.stop="playAudio('click')" :disable="!isSubscribed">
                <q-item-section>
                  <q-item-label><b>Энергия восстановлена</b></q-item-label>
                  <q-item-label caption>Оповещать, когда энергия полностью восстановится</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-toggle :false-value="0" :true-value="1" @click.stop="playAudio('click')"
                    v-model="formData.fields.energy.value" @update:model-value="saveSetting('energy', formData.fields.energy.value)"/>
                </q-item-section>
              </q-item>
              <q-item tag="label" v-ripple class="q-pl-none" @click.stop="playAudio('click')" :disable="!isSubscribed">
                <q-item-section>
                  <q-item-label><b>Периодическое напоминание</b></q-item-label>
                  <q-item-label caption>Напоминать, если я уже давно не захожу</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-toggle :false-value="0" :true-value="1" @click.stop="playAudio('click')"
                    v-model="formData.fields.sign_in.value" @update:model-value="saveSetting('sign_in', formData.fields.sign_in.value)"/>
                </q-item-section>
              </q-item>
              <q-item tag="label" v-ripple class="q-pl-none" @click.stop="playAudio('click')" :disable="!isSubscribed">
                <q-item-section>
                  <q-item-label><b>Доступные технологии</b></q-item-label>
                  <q-item-label caption>Оповещать, когда появляются доступные технологии</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-toggle :false-value="0" :true-value="1" @click.stop="playAudio('click')"
                    v-model="formData.fields.skills.value" @update:model-value="saveSetting('skills', formData.fields.skills.value)"/>
                </q-item-section>
              </q-item>
              <q-item tag="label" v-ripple class="q-pl-none" @click.stop="playAudio('click')" :disable="!isSubscribed">
                <q-item-section>
                  <q-item-label><b>Ежедневные планеты</b></q-item-label>
                  <q-item-label caption>Оповещать, когда есть неисследованные ежедневные планеты</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-toggle :false-value="0" :true-value="1" @click.stop="playAudio('click')"
                    v-model="formData.fields.daily_lessons.value" @update:model-value="saveSetting('daily_lessons', formData.fields.daily_lessons.value)"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { ref, reactive, onMounted } from 'vue'
import { playAudio } from 'src/services/audioService';
import { usePushNotification } from '../composables/usePushNotification';


const { isSubscribed, permissionState, saveItemConfig, checkSubscriptionStatus, subscribeUser } = usePushNotification();

const { user } = useUserStore()
const router = useRouter()
const form = ref(null)
const subscribeBtn = ref(false)

const formData = ref({
  valid: true,
  fields: {
    energy: {
      value: user.active.data.notifications?.config?.energy,
      errors: '',
      isError: false,
      required: true
    },
    sign_in: {
      value: user.active.data.notifications?.config?.sign_in,
      errors: '',
      isError: false,
      required: true
    },
    skills: {
      value: user.active.data.notifications?.config?.skills,
      errors: '',
      isError: false,
      required: true
    },
    daily_lessons: {
      value: user.active.data.notifications?.config?.daily_lessons,
      errors: '',
      isError: false,
      required: true
    },
  }
})
const saveSetting = async function (code, value) {
  formData.valid = await form.value.validate()
  if (formData.valid) {
    const saved = await saveItemConfig({code, value})
    if (saved.error) {
      formData.fields[code].errors = saved.message
    }
  }
}
async function handleSubscribe() {
  const success = await subscribeUser();
  if (success) subscribeBtn.value = false;
}
onMounted(async () => {
  await checkSubscriptionStatus();
  if (!isSubscribed.value && permissionState.value === 'default') {
    subscribeBtn.value = true
  }
});
</script>
