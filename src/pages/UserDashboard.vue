<template>
    <q-header class="transparent text-white">
      <q-toolbar >
        <ClassroomToggle/>
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat round dense icon="emoji_events" class="q-mr-sm" to="/user-achievements"/>
        <q-btn flat round dense icon="settings" class="q-mr-sm"  to="/settings"/>
      </q-toolbar>
    </q-header>
    <q-page class="flex justify-center content-end  text-center full-width">
        <q-card class="transparent no-shadow full-width" style="margin-bottom: -60px; position: relative; z-index: 1;">
            <q-card-section>
                <q-linear-progress
                    color="white"
                    :model-value="user.active.data.profile?.level.percentage" 
                    size="20px"
                    dark stripe rounded 
                ></q-linear-progress>
                <div class="row q-ma-sm text-white">
                    <div class="col text-left">
                        <b>Level {{user.active.data.profile?.level.id}}</b>
                    </div>
                    <div class="col  text-right">
                        <b>{{user.active.data.profile?.total_points}}/{{user.active.data.profile?.level.points_to}}</b>
                    </div>
                </div>
            </q-card-section>
            <q-card-section>
                <q-img
                    :src="`${CONFIG.API_HOST}/images/dershane/hero_${user.active.data.profile?.hero}_hello.png`"
                    style="max-width: 250px; width: 170px;"
                />
            </q-card-section>
        </q-card>
        <q-card color="white" class="relative text-center q-pl-sm q-pr-sm q-pt-md q-pb-md rounded-borders rounded-b-0" style="padding-top: 30px;">
            <q-card-section>
                <div class="text-h5"><b>{{user.active.data.name}}</b></div>
            </q-card-section>
            
            <q-card-section class="q-px-none">
                <q-card >
                    <q-card-section >
                        <q-item :active="active" class="q-pa-none">
                            <q-item-section avatar>
                                <q-avatar>
                                    <img :src="`${CONFIG.API_HOST}${classroom.active?.introimage}`" />
                                </q-avatar>
                            </q-item-section>
                            <q-item-section class="text-left">
                                <div class="text-h6">{{classroom.active?.title}}</div>
                                <div class="text-grey">Current classroom</div>
                            </q-item-section>
                            <q-item-section side>
                                <q-btn
                                flat 
                                to="/user-startup"
                                icon="autorenew" />
                            </q-item-section>
                        </q-item>
                    </q-card-section>
                </q-card>
            </q-card-section>
            <q-btn
                block
                to="user-edit"
                class="full-width"
                append-icon="mdi-account-edit"
            >
                <label>Edit profile</label>
            </q-btn>
            <div class="q-mt-md q-mb-md row q-col-gutter-sm">
                <div class="col-6">
                    <q-card class="text-left" rounded="lg">
                        <q-card-section>
                            <div class="text-h5">{{user.active.data.profile?.total_exercises}}</div>
                            <div class="text-caption text-grey">Exercises</div>
                            <q-tooltip activator="parent" location="top">
                                Total exercises that you have done
                            </q-tooltip>
                        </q-card-section>
                    </q-card>
                </div>
                <div class="col-6">
                    <q-card class="text-left" rounded="lg">
                        <q-card-section>
                            <div class="text-h5">{{user.active.data.profile?.total_points}}</div>
                            <div class="text-caption text-grey">Points</div>
                            <q-tooltip activator="parent" location="top">
                                Total points that you have scored
                            </q-tooltip>
                        </q-card-section>
                    </q-card>
                </div>
                <div class="col-6">
                    <q-card class="text-left" rounded="lg">
                        <q-card-section>
                            <div class="text-h5">{{user.active.data.profile?.total_classrooms}}</div>
                            <div class="text-caption text-grey">Classrooms</div>
                            <q-tooltip activator="parent" location="top">
                                Total classrooms that you are member of
                            </q-tooltip>
                        </q-card-section>
                    </q-card>
                </div>
                <div class="col-6">
                    <q-card class="text-left" rounded="lg">
                        <q-card-section>
                            <div class="text-h5">{{user.active.data.profile?.total_achievements}}</div>
                            <div class="text-caption text-grey">Achievements</div>
                            <q-tooltip activator="parent" location="top">
                                Total achievements that you have gained
                            </q-tooltip>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
            <q-btn
                block
                class="full-width"
                color="primary"
                @click="exitUser(); "
                append-icon="mdi-logout-variant"
            >
                <label>Sign out</label>
            </q-btn>
        </q-card>
    </q-page>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useClassroom } from '../composables/useClassroom'
import { useRouter } from 'vue-router'
import ClassroomToggle from '../components/ClassroomToggle.vue'
import { CONFIG } from '../config.js'
import { ref } from 'vue'

const { user, signOut } = useUserStore()
const { classroom } = useClassroom()
const router = useRouter()


const sheet = ref(false);


const exitUser = async function () {
    await signOut();
    return router.push('/user-startup');
}


</script>