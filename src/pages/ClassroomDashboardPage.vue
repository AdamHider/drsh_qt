<template>
    <q-page-wrapper>
        <q-app-header class="transparent text-white rounded-b-md" reveal>
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat round dense class="q-mr-sm" icon="share"/>
        </q-app-header>
        <q-page class="text-center flex column full-width" style="padding-top: 50px">
          <q-card class="transparent no-shadow full-width" style="position: relative; z-index: 1;">

            <q-card-section class="q-pa-lg q-pb-xl text-white">
                <div class="text-h6"><b>Classrooms</b></div>
                <div class="text-caption">See your rating among others</div>
              </q-card-section>
          </q-card>
            <q-card flat class="relative text-left col q-pt-md q-pb-md rounded-borders rounded-b-0 full-width" >
                <q-card-section class="q-py-none flex justify-between items-center">
                  <div class="text-h6">Latest news</div>
                </q-card-section>
                <q-card-section class="q-px-none q-pt-none">
                    <ClassroomFeedSlider
                      :slidesPerView=1.2
                      :centerAligned="true"
                      slideHeight="140"
                      :navigation="true"
                      captionMode="full"
                    />
                </q-card-section>
                <q-card-section class="q-pb-none flex justify-between items-center">
                    <div class="text-h6">Your classrooms</div>
                </q-card-section>
                <q-card-section class="q-pa-none">
                  <ClassroomList/>
                </q-card-section>
            </q-card>
        </q-page>
        <template v-slot:bottom-bar>
          <q-footer  bordered class="bg-white text-primary">
            <q-bottom-bar/>
          </q-footer>
        </template>
    </q-page-wrapper>
</template>

<script setup >
import { ref } from 'vue'
import UserToggle from '../components/UserToggle.vue'
import ClassroomList from '../components/ClassroomList.vue'
import ClassroomSlider from '../components/ClassroomSlider.vue'
import ClassroomFeedSlider from '../components/ClassroomFeedSlider.vue'

</script>
