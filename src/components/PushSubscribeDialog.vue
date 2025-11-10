<template>
  <q-dialog v-model="isModalOpen" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Подписка на уведомления</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-if="isLoading" class="text-center">
          <q-spinner color="primary" size="3em" />
          <p class="q-mt-sm">Проверка статуса подписки...</p>
        </div>

        <div v-else-if="isSubscribed">
          <q-icon name="check_circle" color="green" size="md" />
          Вы успешно подписаны! Теперь вы будете получать важные обновления.
        </div>

        <div v-else-if="permissionState === 'default'">
          Получайте важные новости и уведомления, даже когда приложение закрыто.
        </div>

        <div v-else-if="permissionState === 'denied'">
          <q-icon name="warning" color="red" size="md" />
          Вы заблокировали уведомления для этого сайта. Чтобы подписаться,
          измените настройки браузера вручную.
        </div>

        <div v-else>
          <q-icon name="error" color="red" size="md" />
          Ваш браузер не поддерживает Web Push Notifications.
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Закрыть" @click="closeModal" />

        <q-btn
          v-if="!isSubscribed && permissionState === 'default'"
          :loading="isSubmitting"
          label="Подписаться"
          color="primary"
          @click="subscribeUser"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from '../stores/user'

const $q = useQuasar();

const PUBLIC_VAPID_KEY = 'BKYqHtv23UyCmW-jvApFWK2zszHfm8Rh6O3gEUHdolaV1FewkewDWJRgBxsA8r73KxoueOoiiy4uYI5Z69JfWrI';

const isModalOpen = ref(false);
const isSubscribed = ref(false);
const isLoading = ref(true);
const isSubmitting = ref(false);
const permissionState = ref('default');

// --- HELPER FUNCTION (остается прежней) ---
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
async function subscribeUser() {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
        $q.notify({ type: 'negative', message: 'Push-уведомления не поддерживаются вашим браузером.' });
        permissionState.value = 'unsupported';
        return;
    }

    isSubmitting.value = true;

    try {
        const registration = await navigator.serviceWorker.ready;
        console.log(registration)
        // Нативный запрос разрешения
        const permission = await Notification.requestPermission();
        permissionState.value = permission;
        if (permission !== 'granted') {
             $q.notify({ type: 'warning', message: 'Разрешение на уведомления не получено.' });
             isSubmitting.value = false;
             return;
        }

        const convertedVapidKey = urlBase64ToUint8Array(PUBLIC_VAPID_KEY);
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
        });

        // Отправка подписки на CodeIgniter-бэкенд
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription),
        });

        if (response.ok) {
            isSubscribed.value = true;
            $q.notify({ type: 'positive', message: 'Вы успешно подписаны на уведомления!' });
        } else {
            subscription.unsubscribe();
            throw new Error('Ошибка сохранения подписки на сервере.');
        }

    } catch (error) {
        console.error('Ошибка подписки:', error);
        $q.notify({ type: 'negative', message: 'Произошла ошибка при попытке подписки.' });
    } finally {
        isSubmitting.value = false;
    }
}

async function checkSubscriptionStatus() {
    isLoading.value = true;

    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
        permissionState.value = 'unsupported';
        isLoading.value = false;
        return;
    }

    permissionState.value = Notification.permission;

    if (permissionState.value === 'granted') {
        const registration = await navigator.serviceWorker.ready;

        if (registration) {
             const subscription = await registration.pushManager.getSubscription();
             isSubscribed.value = !!subscription;
        }
    }

    isLoading.value = false;
}

const { user } = useUserStore()

function autoShowModalIfRequired() {
    setTimeout(() => {
        if(user.id != 167) return false
        if (!isSubscribed.value && permissionState.value === 'default') {
            openModal();
        }
    }, 2000);
}

function openModal() {
    if (isLoading.value) {
        checkSubscriptionStatus();
    }
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}

onMounted(async () => {
    await checkSubscriptionStatus();

    autoShowModalIfRequired();
});

</script>
