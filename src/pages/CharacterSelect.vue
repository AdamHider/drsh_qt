<template>
    <q-page-container>
        <q-page class="flex justify-center items-end full-height full-width text-center">
          <swiper
            v-if="characters.length > 0"
            class="characterslider"
            :slides-per-view="props.slidesPerView"
            :centeredSlides="props.centerAligned"
            :navigation="props.navigation"
          >
            <swiper-slide v-for="(characterItem, index) in characters" :key="index">
              <q-img
                  :src="characterItem.planet_image"
                  class="absolute-bottom "
                  style="max-width: 350px; width: 370px; margin: 0px auto -40px;"
                  no-spinner
              />
              <q-card class="transparent no-shadow full-width" style="position: relative; z-index: 1; height: 50vh;" >
                  <q-card-section class="text-left text-white">
                    <div class="text-h6"><b>{{ characterItem.title }}</b></div>
                    <div class="text-caption">{{ characterItem.description }}</div>
                  </q-card-section>
                  <q-img
                      :src="characterItem.character_image"
                      class="absolute-bottom "
                      style="max-width: 250px; width: 170px; margin: 0px auto -40px;"
                      no-spinner
                  />
              </q-card>
            </swiper-slide>
          </swiper>
        </q-page>
    </q-page-container>
</template>

<script setup>
import { api } from '../services/index'
import { onMounted, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRouter } from 'vue-router'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const props = defineProps({
  slidesPerView: Number,
  centerAligned: Boolean,
  withButton: Boolean,
  slideHeight: String,
  navigation: Boolean,
  captionMode: String
})

const router = useRouter()
const characters = ref([])

const load = async function () {
  const characterListResponse = await api.character.getList({})
  if (characterListResponse.error) {
    characters.value = []
    return
  }
  characters.value = characterListResponse
}
onMounted(async () => {
  load()
})
</script>
