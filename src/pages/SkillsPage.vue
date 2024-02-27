<template>
  <q-page-container>
     <q-page style="padding-top: 50px; padding-bottom: 48px;" class="flex column justify-center content-end  text-center full-width">
       <q-card class="text-center transparent no-shadow full-width" style="position: relative; z-index: 1;">
            <q-card-section class="q-pa-lg q-pb-xl text-white">
              <div class="text-h6"><b>Research</b></div>
              <div class="text-caption">Explore new technologies</div>
            </q-card-section>
        </q-card>
        <q-card flat class="relative text-left  q-pb-md rounded-borders rounded-b-0 col full-width">
            <q-card-section class="q-pa-none">
              <q-tabs v-model="tab" inline-label active-color="primary" indicator-color="primary">
                <q-tab :name="categorIndex" v-for="(category, categorIndex) in skills" :key="categorIndex">
                  <b>{{ category.title }}</b>
                </q-tab>
              </q-tabs>
              <q-tab-panels v-model="tab">
                <q-tab-panel :name="categorIndex" v-for="(category, categorIndex) in skills" :key="categorIndex">
                  <SkillList :list="category.list"/>
                  </q-tab-panel>
                </q-tab-panels>
            </q-card-section>
        </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup >
import SkillList from '../components/SkillList.vue'
import { ref, onActivated } from 'vue'
import { api } from '../services/index'

const tab = ref(0)
const skills = ref([])

const load = async function (filter) {
  const skillListResponse = await api.skill.getList({ mode: 'by_user' })
  if (skillListResponse.error) {
    error.value = skillListResponse
    skills.value = []
    return []
  }
  skills.value = skillListResponse
}
onActivated(() => {
  load()
})

</script>
