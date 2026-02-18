<template>
  <q-dialog v-model="isModalOpen" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-subtitle1"><b>Подписка на уведомления</b></div>

        <div v-if="isLoading" class="text-center q-pa-md">
          <q-spinner color="primary" size="3em" />
        </div>

        <div v-else class="q-py-md">
          <template v-if="isSubscribed">
            Вы успешно подписаны!
          </template>
          <template v-else-if="permissionState === 'default'">
            Получайте важные новости и уведомления даже при закрытом приложении.
          </template>
          <template v-else-if="permissionState === 'denied'">
            Вы заблокировали уведомления. Измените настройки браузера вручную.
          </template>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat @click="isModalOpen = false"><b>Отмена</b></q-btn>
        <q-btn
          v-if="!isSubscribed && permissionState === 'default'"
          push
          label="Подписаться"
          color="primary"
          :loading="isSubmitting"
          @click="handleSubscribe"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePushNotification } from '../composables/usePushNotification';
import { useUserStore } from '../stores/user';

const isModalOpen = ref(false);
const { user } = useUserStore();
const {
  isSubscribed,
  permissionState,
  isLoading,
  isSubmitting,
  checkSubscriptionStatus,
  subscribeUser
} = usePushNotification();

async function handleSubscribe() {
  const success = await subscribeUser();
  if (success) isModalOpen.value = false;
}

onMounted(async () => {
  await checkSubscriptionStatus();
  if (user.active.data.level.level >= '2' && !isSubscribed.value && permissionState.value === 'default') {
    setTimeout(() => { isModalOpen.value = true; }, 2000);
  }
});
</script>
