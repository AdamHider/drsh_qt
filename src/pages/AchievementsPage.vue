<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title><b>Достижения</b></q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white "  style="padding-top: 50px; padding-bottom: 48px;">
        <div v-for="(achievementGroup, achievementGroupIndex) in achievements" :key="`achievementGroup-${achievementGroupIndex}`">
          <div class="q-ma-md">
            <div class="text-subtitle1"><b>{{achievementGroup.title}}</b></div>
            <div class="text-grey text-caption">{{achievementGroup.description}}</div>
          </div>
          <div>
            <q-list>
                <q-item v-for="(achievementItem, achievementIndex) in achievementGroup.list" :key="achievementIndex">
                  <q-item-section>
                    <q-card class="q-push">
                      <q-card-section class="q-py-sm">
                        <div :class="`flex justify-between q-pb-sm ${(achievementItem.progress.current >= achievementItem.progress.target) ? 'items-center' : 'items-end'}`">
                          <div>
                            <div class="text-bold">{{achievementItem.title}}</div>
                            <div class="text-grey text-caption">{{achievementItem.description}}</div>
                          </div>
                          <b v-if="achievementItem.progress.current >= achievementItem.progress.target"><q-icon size="25px" color="positive" name="done"></q-icon></b>
                          <b v-else>{{achievementItem.progress.current}}/{{achievementItem.progress.target}}</b>
                        </div>
                        <q-progress-bar :value="achievementItem.progress.percentage" size="25px" color="positive"/>
                      </q-card-section>
                    </q-card>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
        </div>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { ref, onMounted } from 'vue'
import { api } from '../services/index'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const achievements = ref([])
const error = ref({})

const load = async function () {
  const achievementListResponse = await api.achievement.getList({})
  if (achievementListResponse.error) {
    error.value = achievementListResponse
    return []
  }
  achievements.value = composeList(achievementListResponse)
}
const composeList = function (achievementList) {
  return achievementList.reduce((result, obj) => {
    result[obj.group_id] = result[obj.group_id] || {
        title: obj.group.title,
        description: obj.group.description,
        list: []
      };
      result[obj.group_id].list.push(obj);
      return result;
  }, {})
}


onMounted(() => {
  load()
})

</script>
