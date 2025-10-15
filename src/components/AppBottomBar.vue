<template>
  <transition
    appear
    enter-active-class="animated slideInUp"
    leave-active-class="animated slideOutDown">
    <q-page-sticky
      position="bottom"
      v-if="bottomBarEnabled"
      class="q-bottom-bar bg-white rounded-t-md text-primary"
      style="z-index: 10; box-shadow: 0px 0px 0px 1px lightgray"
    >
      <q-tabs content-class="allow-overflow">
        <div class="relative-position">
          <q-tutorial-item title="Космическая карта" description="Здесь тебе и необходимо исследовать новые миры, солнечные системы и целые галактики." :index="9" :positionFixed="{bottom: 50, left: 0}"/>
          <q-route-tab  :to="`${routes.course.link}`" exact replace @click.stop="playAudio('click')">
            <q-img :src="`/icons/rocket${(routes.course.is_active) ? '_active' : ''}.svg`" width="32px" no-spinner></q-img>
            <q-badge v-show="routes.course.is_updated" color="red" rounded floating />
            <q-avatar v-if="routes.course.is_quest" size="18px" font-size="12px" color="secondary" text-color="white" icon="priority_high" class="absolute-top" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;"/>
          </q-route-tab>
        </div>
        <div class="relative-position">
          <q-tutorial-item title="Технологии" description="На этой странице отображаются технологии, помогающие в освоении космоса." :index="8" :positionFixed="{bottom: 50, left: 0}"/>
          <q-route-tab :to="routes.skills.link" exact replace  @click.stop="playAudio('click')">
            <q-img :src="`/icons/microscope${(routes.skills.is_active) ? '_active' : ''}.svg`" width="32px" no-spinner></q-img>
            <q-badge v-show="routes.skills.is_updated" color="red" rounded floating />
            <q-avatar v-if="routes.skills.is_quest" size="18px" font-size="12px" color="secondary" text-color="white" icon="priority_high" class="absolute-top" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;"/>
          </q-route-tab>
        </div>
        <div class="relative-position">
          <q-tutorial-item title="Рейтинг" description="На этой странице можно увидеть свой рейтинг среди других исследователей." :index="7" :positionFixed="{bottom: 50, left: 0}"/>
          <q-route-tab  :to="routes.leaderboard.link" exact replace @click.stop="playAudio('click')">
            <q-img :src="`/icons/leaderboard${(routes.leaderboard.is_active) ? '_active' : ''}.svg`" width="32px" no-spinner></q-img>
          </q-route-tab>
        </div>
        <div class="relative-position">
          <q-tutorial-item title="Уведомления" description="На этой странице виден список уведомлений." :index="6" :positionFixed="{bottom: 50, left: 0}"/>
          <q-route-tab :to="routes.notifications.link" exact replace style="opacity: 1;"  @click.stop="playAudio('click')">
            <q-img :src="`/icons/notifications${(routes.notifications.is_active) ? '_active' : ''}.svg`" width="32px" no-spinner></q-img>
            <q-badge v-show="routes.notifications.is_updated" color="red" rounded floating />
          </q-route-tab>
        </div>
        <q-route-tab :to="routes.user.link" exact replace @click.stop="playAudio('click')">
          <q-img :src="`/icons/account${(routes.user.is_active) ? '_active' : ''}.svg`" width="32px" no-spinner></q-img>
          <q-badge v-show="routes.user.is_updated" color="red" rounded floating />
        </q-route-tab>
      </q-tabs>
    </q-page-sticky>
  </transition>
</template>

<script setup>
import { useNavigationHistory } from '../composables/useNavigationHistory'
import { useRoute } from 'vue-router'
import { watch, ref, onMounted } from 'vue'
import { useNotification } from '../composables/useNotification'
import { playAudio } from 'src/services/audioService';
import { useQuest } from '../composables/useQuest'

const { notifications } = useNotification()

const { routes } = useNavigationHistory();
const { getList, quest } = useQuest()

const route = useRoute();
const isRootPage = ref(false);
const bottomBarEnabled = ref(false);

onMounted(() => {
  checkActive()
  getList(1)
})

watch(route, (currentValue, oldValue) => {
  setTimeout(() => {
    checkActive()
  }, 0)
});
const checkActive = () => {
  isRootPage.value = route.fullPath.split('/').length === 2
  bottomBarEnabled.value = route.meta.bottomBarEnabled === true
  const routeLinks = Object.keys(routes)
  for(var i in routeLinks){
    routes[routeLinks[i]].is_active = false
    if(routes[routeLinks[i]].link == route.fullPath){
      routes[routeLinks[i]].is_updated = false
      routes[routeLinks[i]].is_active = true
    }
  }
}
watch(() => quest.activeList, () => {
  setTimeout(() => {
    routes.skills.is_quest = quest.activeList?.find((item) => item.code == 'skill')
    routes.course.is_quest = quest.activeList?.find((item) => item.code == 'lesson')
  }, 0)
})
watch(() => notifications.value.level, () => {
  setTimeout(() => {
    routes.user.is_updated = true
  }, 0)
})
watch(() => notifications.value.notifications, () => {
  setTimeout(() => {
    routes.notifications.is_updated = true
  }, 0)
})
watch(() => notifications.value.skills, () => {
  setTimeout(() => {
    routes.skills.is_updated = true
  }, 0)
})
watch(() => notifications.value.quests, () => {
  setTimeout(() => {
    routes.course.is_updated = true
  }, 0)
})
</script>
<style scoped>
.q-tab{
  padding: 0 12px;
}
</style>
