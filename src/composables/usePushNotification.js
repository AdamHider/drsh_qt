import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { api } from '../services/index'

// Константы выносим за пределы функции, чтобы они были общими
const PUBLIC_VAPID_KEY = 'BKYqHtv23UyCmW-jvApFWK2zszHfm8Rh6O3gEUHdolaV1FewkewDWJRgBxsA8r73KxoueOoiiy4uYI5Z69JfWrI';

// Глобальное состояние (чтобы статус обновлялся во всех компонентах одновременно)
const isSubscribed = ref(false);
const permissionState = ref(Notification.permission);
const isLoading = ref(true);

export function usePushNotification() {
  const $q = useQuasar();
  const isSubmitting = ref(false);

  // Вспомогательная функция конвертации
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Проверка текущего статуса
  async function checkSubscriptionStatus() {
    isLoading.value = true;
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
      permissionState.value = 'unsupported';
      isLoading.value = false;
      return;
    }

    permissionState.value = Notification.permission;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      isSubscribed.value = !!subscription;
    } catch (error) {
      console.error('Ошибка проверки подписки:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function subscribeUser() {
    isSubmitting.value = true;
    try {
      const registration = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      permissionState.value = permission;

      if (permission !== 'granted') {
        throw new Error('Permission not granted');
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      });

      const response = await api.push.subscribe(subscription.toJSON())
      console.log(response)
      if (response.status !== 'success') throw new Error('Server error');

      isSubscribed.value = true;
      $q.notify({ type: 'positive', message: 'Вы успешно подписаны!' });
      return true;
    } catch (error) {
      console.error('Push error:', error);
      $q.notify({ type: 'negative', message: 'Ошибка при оформлении подписки.' });
      return false;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    isSubscribed,
    permissionState,
    isLoading,
    isSubmitting,
    checkSubscriptionStatus,
    subscribeUser
  };
}
