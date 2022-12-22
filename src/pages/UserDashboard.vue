<template>
    <q-app-header>
        <UserToggle/>
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat round dense icon="settings" class="q-mr-sm"  to="/user/settings"/>
    </q-app-header>
    <q-page-container>
      <q-page>
    <div class="flex justify-center content-end  text-center full-width" style="min-height: inherit;">
        <q-card class="transparent no-shadow full-width" style="margin-bottom: -60px; position: relative; z-index: 1;">
            <q-card-section>
                <q-img
                    :src="`${CONFIG.API_HOST}/images/dershane/hero_${user.active.data.profile?.hero}_hello.png`"
                    style="max-width: 250px; width: 170px;"
                    no-spinner
                />
            </q-card-section>
        </q-card>
        <q-card class="relative text-left q-pt-md q-pb-md rounded-borders rounded-b-0 full-width" style="padding-top: 30px;">
            <q-card-section class="q-pb-none" style="width: 80%; margin: 0 auto">
            <q-linear-progress
                color="positive"
                :model-value="(user.active.data.profile?.level.percentage / 100)"
                size="12px"
                stripe rounded
            ></q-linear-progress>
            <div class="row q-ma-sm ">
                <div class="col text-left">
                    <b>Level {{user.active.data.profile?.level.id}}</b>
                </div>
                <div class="col text-right">
                    <b>{{user.active.data.profile?.total_points}}/{{user.active.data.profile?.level.points_to}}</b>
                </div>
            </div>
            </q-card-section>
            <q-card-section>
                <q-item class="q-pa-none">
                    <q-item-section class="text-left">
                        <div class="text-h5"><b>{{user.active.data.name}}</b></div>
                        <div class="text-grey">Active student</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-btn
                            flat
                            to="/user/edit"
                            color="grey"
                            icon="edit"
                        >
                        </q-btn>
                    </q-item-section>
                </q-item>
            </q-card-section>
            <q-card-section class="q-pa-none">
                <div class="q-mb-md q-mx-sm row text-center">
                    <div class="col">
                        <div class="text-h5"><b>{{user.active.data.profile?.total_exercises}}</b></div>
                        <div class="text-caption text-grey">Exercises</div>
                        <q-tooltip activator="parent" location="top">
                            Total exercises that you have done
                        </q-tooltip>
                    </div>
                    <q-separator vertical/>
                    <div class="col">
                        <div class="text-h5"><b>{{user.active.data.profile?.total_points}}</b></div>
                        <div class="text-caption text-grey">Points</div>
                        <q-tooltip activator="parent" location="top">
                            Total points that you have scored
                        </q-tooltip>
                    </div>
                    <q-separator vertical/>
                    <div class="col">
                        <div class="text-h5"><b>{{user.active.data.profile?.total_classrooms}}</b></div>
                        <div class="text-caption text-grey">Classrooms</div>
                        <q-tooltip activator="parent" location="top">
                            Total classrooms that you are member of
                        </q-tooltip>
                    </div>
                </div>
            </q-card-section>
            <q-card-section class="q-py-none flex justify-between items-center">
                <div class="text-h6">Achievements</div>
                <router-link to="user/achievements">Show all</router-link>
            </q-card-section>
                <UserAchievementsSlider
                    :slidesPerView=2.4
                    :centerAligned="false"
                    :withButton="false"
                    slideHeight="100"
                    :navigation="false"
                    captionMode="full"
                />
            <q-card-section>
                <q-btn
                    class="full-width"
                    color="primary"
                    @click="exitUser(); "
                    append-icon="mdi-logout-variant"
                    label="Sign out"
                />
            </q-card-section>
        </q-card>
    </div>
      </q-page>
    </q-page-container>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useClassroom } from '../composables/useClassroom'
import UserToggle from '../components/UserToggle.vue'
import UserAchievementsSlider from '../components/UserAchievementsSlider.vue'
import { useRouter } from 'vue-router'
import { CONFIG } from '../config.js'

const { user, signOut } = useUserStore()
const router = useRouter()

const exitUser = async function () {
  await signOut()
  return router.push('/authorization')
}

</script>
