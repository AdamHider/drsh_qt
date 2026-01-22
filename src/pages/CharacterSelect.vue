<template>
    <q-page-container>
      <q-app-header class="transparent text-white rounded-b-md " >
          <q-toolbar-title>Выбери расу</q-toolbar-title>
      </q-app-header>
        <q-page class=" column justify-end  items-end full-height full-width text-center overflow-hidden">
          <transition v-for="(characterItem, index) in characters" :key="index"  :duration="550" enter-active-class="animated fadeIn"  leave-active-class="animated fadeOut">
            <div class="background" v-if="characterItem.id == activeCharacter.id" :style="`background-image: url(${characterItem.background_image})`"></div>
          </transition>
          <transition
            :duration="550"
            enter-active-class="animated fadeInUp"
            leave-active-class="animated fadeOutDown">
            <q-card v-if="activeCharacter.id" class="transparent no-shadow full-width q-py-md">
                <q-card-section class="text-center text-white">
                  <div class="text-h5"><b>{{ activeCharacter.title }}</b></div>
                  <p >{{ activeCharacter.description }}</p>
                </q-card-section>
            </q-card>
          </transition>
          <transition
            :duration="550"
            enter-active-class="animated zoomIn"
            leave-active-class="animated zoomOut">
            <q-img v-if="activeCharacter.id"
              :src="activeCharacter.planet_image"
              width="500px"
              style="left: calc(-250px + 50%); bottom: -100px; overflow: hidden"
              class="absolute-bottom"
              no-spinner/>
          </transition>
          <swiper
            class="characterslider"
            slides-per-view="1.4"
            centeredSlides
            :navigation="true"
            :modules="[Navigation]"
            @slideChange="onChange"
            style="margin-bottom: -30px;"
          >
            <swiper-slide v-for="(characterItem, index) in characters" :key="index" >
                <q-card class="transparent no-shadow full-width">
                    <div>
                      <q-img
                        :src="characterItem.character_image"
                        style="max-width: 250px; width: 170px; z-index: 10;"
                        no-spinner
                    />
                    </div>
                    <div>
                    <q-img
                        src="http://mektepium-app.local/image/character_podium.png"
                        class="text-center"
                        style="max-width: 250px; width: 170px; margin-top: -20px;"
                        no-spinner
                    />
                    </div>
                </q-card>
            </swiper-slide>
          </swiper>
          <q-card class="full-width rounded-b-0 q-pt-lg q-pb-md">
              <q-card-section class="text-left text-white">
                <q-btn color="positive" class="full-width" label="Confirm" @click="select()"/>
              </q-card-section>
          </q-card>
        </q-page>
    </q-page-container>
</template>

<script setup>
import { api } from '../services/index'
import { onMounted, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'


import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

// install Swiper modules

const props = defineProps({
  navigation: Boolean,
  captionMode: String
})

const router = useRouter()
const characters = ref([])
const { getItem } = useUserStore()

const buttonLoading = ref(false)
const activeCharacter = ref({})

const load = async function () {
  const characterListResponse = await api.character.getList({})
  if (characterListResponse.error) {
    characters.value = []
    return
  }
  characters.value = characterListResponse
  activeCharacter.value = characters.value[0]
}

const select = async function () {
  buttonLoading.value = true
  const linkItemResponse = await api.character.linkItem({ id: activeCharacter.value.id })
  if (!linkItemResponse.error) {
    await getItem()
    buttonLoading.value = false
    return router.push('/user')
  }
}
const onChange = function (event) {
  activeCharacter.value = {}
  setTimeout(() => {activeCharacter.value = characters.value[event.activeIndex]}, 10)
}
onMounted(async () => {
  load()
})
</script>
<style lang="scss" >
.swiper-button-next, .swiper-button-prev{
  width: unset;
  height: unset;
  --swiper-navigation-size: 18px;
  background: white;
  border-radius: 10px;
  padding: 12px 16px;
  font-weight: bold;
  color:  $primary;
}

.background{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
}
</style>
