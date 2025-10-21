<template>
      <q-card v-if="userInvitation" class="relative-position allow-overflow rounded-b-0">
          <div class="absolute full-width text-center" style="bottom: 100%;">
            <q-img  width="200px" src="/images/market/character.png" style="max-width: 100%;"/>
          </div>
        <q-card-section>
          <div class="items-center text-center">
            <div class="text-subtitle1"><b>Пригласи друзей с выгодой!</b></div>
            <div class="text-caption">Друзья, которые присоединятся к приключениям по этой ссылке принесут драгоценный <b class="text-green">изонит</b>!</div>
            <div class="text-caption">Для этого приглашённым друзьям нужно только выполнить задание <b class="text-primary">"Час расплаты"</b>!</div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none q-px-sm text-center">
          <div class="text-caption text-grey">
            По приглашению присоединились: {{ userInvitation.count }}
          </div>
          <div class="text-caption text-grey">
            Использовано наград: {{ userInvitation.claimed_count }}
          </div>
          <q-btn v-if="userInvitation.available > 0" class="q-blinking full-width q-mt-sm" push @click="claimInvitation()" color="positive">Получить награду ({{ userInvitation.available }})</q-btn>
        </q-card-section>
        <q-card-actions>
          <q-btn class="full-width q-my-sm" v-if="isShareSupported" push color="primary" icon="person_add" @click.stop="playAudio('click')" label="Пригласить" @click="shareContent()"></q-btn>
          <q-btn v-if="!userInvitationCopied" class="full-width" push color="secondary" icon="content_copy" label="Скопировать ссылку"
            @click="copyInvitationLink()" @click.stop="playAudio('click')"/>
          <q-btn v-else class="full-width" push color="primary" label="Скопировано" icon="check" disabled/>
          <q-btn v-close-popup class="full-width q-my-sm" flat color="primary"  @click.stop="playAudio('click')"><b>Закрыть</b></q-btn>
        </q-card-actions>
      </q-card>
    <q-dialog v-model="claimDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-center" style="width: 300px">
        <q-card-section class="q-pb-none">
          <div v-if="!claimError" class="text-h6"><b>Задание выполнено!</b></div>
          <div v-else class="text-h6"><b>Упс...</b></div>
        </q-card-section>
        <q-card-section>
          <div class="full-width q-pb-sm rounded-sm bg-grey-2">
            <div class="text-center text-subtitle2 q-pa-xs"><b>Награда: </b></div>
            <div class="row q-gutter-sm items-center justify-center">
              <div v-for="(resource, resourceIndex) in reward" :key="`resource-${resourceIndex}`" >
                  <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center" class="bg-white q-px-md q-pb-md text-teal">
          <q-btn class="full-width" push label="Отлично" color="positive" v-close-popup @click.stop="playAudio('click')"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { copyToClipboard } from 'quasar'
import { playAudio } from 'src/services/audioService';
import UserResourceBar from './UserResourceBar.vue'

const route = useRoute()

const { getItemInvitation, claimItemInvitation } = useUserStore()
const userInvitation = ref({})
const userInvitationCopied = ref(false)
const claimDialog = ref(false)
const reward = ref({})
const claimError = ref(false)
const isShareSupported = ref(false);

const copyInvitationLink = () => {
  const link = `https://app.mektepium.com/user-invitation-${userInvitation.value.hash}`
  copyToClipboard(link)
  userInvitationCopied.value = true
}
const claimInvitation = async () => {
  const claimResponse = await claimItemInvitation()
  if(!claimResponse.error){
    claimError.value = false
    reward.value = claimResponse
    claimDialog.value = true
    load()
  } else {
    claimError.value = true
  }
}
const load = async () => {
  const userInvitationResponse = await getItemInvitation()
  if(!userInvitationResponse.error){
    userInvitation.value = userInvitationResponse
    userInvitation.value.available = userInvitationResponse.count - userInvitationResponse.claimed_count
  }
}
const shareContent = async () => {
  const link = `https://app.mektepium.com/user-invitation-${userInvitation.value.hash}`
  if (isShareSupported.value) {
    try {
      await navigator.share({
        title: 'Мектепиум – Вселенная знаний!',
        text: 'Зацени игру Mektepium! Тут можно учиться играя и играть учась.',
        url: link, // Ссылка на ваш корневой домен или на конкретную страницу
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Ошибка при использовании Web Share API:', err);
      }
      // Если пользователь отменил, ничего не делаем
    }
  } else {

  }
};
onMounted(() => {
  isShareSupported.value = 'share' in navigator;
  userInvitationCopied.value = false
  load()
})
</script>
