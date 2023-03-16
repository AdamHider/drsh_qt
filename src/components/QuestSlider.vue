<template>
    <swiper
      v-if="quests.length > 0"
      class="questSlider"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :navigation="props.navigation"
    >
      <swiper-slide v-for="(questItem, index) in quests" :key="index">
        <q-card
          :class="`q-ma-sm cursor-pointer ${(questItem.is_active) ? 'active' : ''}`"
          @click="router.push(`quest-${questItem.id}`)"
        >
          <q-card-section >
            <q-item class="q-pa-none">
                <q-item-section class="text-left"   @click="router.push(`/quest-${questItem.id}`)">
                    <q-item-section class="text-left">
                        <q-item-label><b>{{ questItem.goal.title }}</b></q-item-label>
                        <q-item-label caption lines="2" style="min-height: 29px">{{ questItem.title }}</q-item-label>
                        <div class="row q-my-sm justify-between" >
                            <div class="coltext-left">
                              <q-chip
                                    v-if="questItem.time_left_humanized"
                                    dense
                                    class="q-px-sm q-ma-none"
                                    style="font-size: 13px"
                                    :color="((questItem.time_left <= 3) ? 'red' : 'orange')"
                                    icon="sports_score"
                                    text-color="white">
                                    <b>{{ questItem.time_left_humanized }}</b>
                                </q-chip>
                            </div>
                            <div class="col text-right" v-if="!questItem.date_end || questItem.time_left > 0">
                                <b>{{questItem.progress.percentage_text}}</b>
                            </div>
                        </div>
                        <q-linear-progress
                            v-if="!questItem.date_end || questItem.time_left > 0"
                            :color="(questItem.progress.percentage/100) >= 1 ? 'positive' : 'primary'"
                            :value="(questItem.progress.percentage/100)"
                            size="12px"
                            rounded
                        ></q-linear-progress>
                    </q-item-section>
                </q-item-section>
                <q-item-section side v-if="questItem.reward && !questItem.is_rewarded && !questItem.is_outdated">
                  <q-item-label caption lines="2" class="text-center">
                    Reward
                    <div>
                      <q-chip  v-if="questItem.reward.gems"  color="transparent" class="q-mt-none" text-color="purple" icon="diamond"><b>{{ questItem.reward.gems }}</b></q-chip>
                      <q-chip  v-if="questItem.reward.credits" color="transparent" text-color="positive" icon="payment"><b>{{ questItem.reward.credits }}</b></q-chip>
                      <q-chip  v-if="questItem.reward.experience" color="transparent" text-color="blue" icon="expand_less"><b>{{ questItem.reward.experience }}</b></q-chip>
                    </div>
                  </q-item-label>
                </q-item-section>
            </q-item>
          </q-card-section >
        </q-card>
      </swiper-slide>
    </swiper>
    <BannerNotFound v-else
      title="Ooops..."
      description="There are no homeworks yet"
      default-image
    />
</template>
<script setup>
import { api } from '../services/index'
import { onMounted, ref, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRouter } from 'vue-router'
import BannerNotFound from '../components/BannerNotFound.vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const props = defineProps({
  classroomId: String,
  slidesPerView: Number,
  centerAligned: Boolean,
  withButton: Boolean,
  slideHeight: String,
  navigation: Boolean,
  captionMode: String
})

const router = useRouter()
const quests = ref([])

const load = async function () {
  const questListResponse = await api.quest.getList({ limit: 3, classroom_id: props.classroomId })
  if (questListResponse.error) {
    quests.value = []
    return
  }
  quests.value = questListResponse
}
onMounted(async () => {
  load()
})
watch(() => props.classroomId, (newData, oldData) => {
  load()
})
</script>
