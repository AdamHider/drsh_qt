<template>
  <q-page-wrapper>
    <q-app-header class="transparent  rounded-b-md" reveal>
        <q-toolbar-title><b>Открытия</b></q-toolbar-title>
        <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.energy" dense no-caption size="24px" push
          @click="() => {if(user.active?.data.resources.energy.quantity == 0) router.push('/market')}"/>
    </q-app-header>
    <q-page class="bg-white"  style="padding-top: 50px; padding-bottom: 48px;">
      <q-card flat class="q-main-card relative text-left  q-pb-lg rounded-borders rounded-b-0 full-width" style="flex: 1; min-height: 50vh;">
        <div class="q-mb-sm">
          <ExploreLessonFilter @onChange="filter = $event"/>
        </div>
        <ExploreLessonList :filter="filter"/>
      </q-card>
      <q-page-sticky position="bottom-left" style="z-index: 100" :offset="[10, 60]">
        <q-btn class="bg-gradient-primary" round push size="20px" to="/training" @click.stop="playAudio('click')">
          <q-avatar size="60px"><q-img src="images/icons/training.png"/></q-avatar>
        </q-btn>
      </q-page-sticky>
      <q-page-sticky position="bottom-right" style="z-index: 100" :offset="[10, 65]">
        <transition
          appear
          enter-active-class="animated fadeInRight"
          leave-active-class="animated fadeOutRight">
          <q-btn v-if="isNeedScrollTop" class="bg-gradient-primary" round push size="18px" @click="scrollToTop()" @click.stop="playAudio('click')">
            <q-avatar size="40px"><q-img src="images/icons/arrow_up.png"/></q-avatar>
          </q-btn>
        </transition>
      </q-page-sticky>
      <q-scroll-observer @scroll="onScroll" />
    </q-page>
  </q-page-wrapper>
</template>

<script setup >
import { ref, computed, onActivated } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import ExploreLessonList from '../components/ExploreLessonList.vue'
import ExploreLessonFilter from '../components/ExploreLessonFilter.vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import { playAudio } from 'src/services/audioService';


const { user } = useUserStore()

const notifications = ref([])
const error = ref({})
const notLoaded = ref(true)
const tab = ref('galaxies')
const filter = ref({})

const isNeedScrollTop = ref(false)

const onScroll = (event) => {
  if (event.position.top > 500) {
    isNeedScrollTop.value = true
  } else {
    isNeedScrollTop.value = false
  }
}

const scrollToTop = () => {
  document.querySelector('.q-page-container').scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
}

</script>
