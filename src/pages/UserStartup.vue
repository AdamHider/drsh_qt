<template>
    <q-page class="flex justify-center content-center full-height full-width text-center">
      <PageHeader v-if="user.active?.data.id" title="User Dashboard" subtitle="Choose your classroom" text-color="white"/>
      <Suspense v-if="user.active?.data.id">
        <ClassroomSlider 
            :slidesPerView="1.3"
            :centerAligned="true"
            :withButton="true"
            slideHeight="300"/>
      </Suspense>
      <q-card class="transparent no-shadow full-width">
        <q-card-section v-if="user.active?.data.id" class="d-flex flex-no-wrap justify-space-between align-center">
            <h4 class="text-white">{{user.active?.data.name}}</h4>
            <q-btn flat  @click="signOut()" color="white">Sign out</q-btn>
        </q-card-section>
        <q-card-section v-else>
            <h4 class="text-h4 text-white" >
                You are not logged in. You may just: 
            </h4>
            <div class="d-flex justify-center align-baseline">
                <q-btn flat  color="white" to="/user-sign-in">sign in</q-btn> 
                <b class="text-white">or</b> 
                <q-btn flat  color="white" to="/user-sign-up">sign up</q-btn> 
            </div>
        </q-card-section>
        <v-divider v-if="(Object.keys(user.list).length > 0)" color="white" class="mt-2 mb-2"></v-divider>
        <q-btn v-if="(Object.keys(user.list).length > 0)" flat  color="white" rounded="lg" @click="dialog=true">Choose existing accounts</q-btn>
    </q-card>

        <q-dialog v-model="dialog">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Choose user</div>
                </q-card-section>
                <q-card-section>
                    <q-list lines="two">
                        <q-item clickable v-ripple 
                            v-for="(userItem, index) in user.list" :key="index">

                            <q-item-section>
                                <q-item-label lines="1">{{userItem.data?.name}}</q-item-label>
                                <q-item-label caption>Description</q-item-label>
                            </q-item-section>

                            <q-item-section side>
                                <q-btn
                                    :disabled="(userItem.data?.id == user.active.data.id)"
                                    flat
                                    :loading="btnLoading[index]"
                                    @click="switchUser(userItem, index)"
                                >Sign In</q-btn>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                    <q-btn flat label="CLOSE" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import ClassroomSlider from '../components/ClassroomSlider.vue'
import PageHeader from '../components/PageHeader.vue'
import { useRouter } from "vue-router";

const router = useRouter();

const dialog = ref(false);
const btnLoading = ref([]);

const switchUser = async (userItem, key) => {
    btnLoading.value[key] = true;
    await signIn(userItem.authorization, userItem.activeClassroom); 
    btnLoading.value[key] = false;
    dialog.value = false;
    return router.push('/user-dashboard');
}

const { signOut, signIn, user } = useUserStore()


</script>