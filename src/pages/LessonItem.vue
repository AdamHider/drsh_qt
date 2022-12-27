<template>
    <q-app-header class="transparent rounded-b-md" reveal>
        <q-btn flat icon="close"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-linear-progress 
            rounded size="20px" 
            :value="(lesson.active.page?.exercise.data.current_page / lesson.active.page?.exercise.data.total_pages )" 
            color="warning"  />
    </q-app-header>
    <q-page class="bg-white full-width" style="padding-top: 50px">
        <q-card flat class="relative text-left full-width" style="z-index: 1;">
            <q-card-section>
                <div class="text-h6"><b>{{lesson.active.page?.header.title}}</b></div>
                <div class="text-subtitle1">{{lesson.active.page?.header.subtitle}}</div>
            </q-card-section>
            <q-card-section>
                <component :is="PageTemplate" :pageData="lesson.active.page" @update-answer="pageAnswers = $event"/>
            </q-card-section>
        </q-card>
    </q-page>
    <q-footer expand position="bottom">
        <q-toolbar class="bg-white ">
            <div class="row">
                <q-btn flat class="col" text-color="dark" label="Back"></q-btn>
                <q-btn flat class="col" text-color="dark" label="Next"></q-btn>
                <q-btn flat class="col" text-color="dark" label="Confirm" @click="confirm"></q-btn>
                <q-btn flat class="col" text-color="dark" label="Skip"></q-btn>
            </div>
        </q-toolbar>
        </q-footer>
</template>

<script setup>
import { useLesson } from '../composables/useLesson'
import { useRoute } from 'vue-router'
import { ref, computed, defineAsyncComponent } from 'vue'

const route = useRoute()
const { lesson, getItem, getPage, saveAnswer } = useLesson()
const pageTemplateTitle = ref(false)
const pageAnswers = ref([])
const PageTemplate = computed (() => pageTemplateTitle.value ? defineAsyncComponent(() => import(`../components/Lesson/Templates/${pageTemplateTitle.value}.vue`)) : null)

const load = async () => {
    await getItem(route.params.lesson_id)
    await getPage()
    pageTemplateTitle.value = lesson.active.page?.header.page_template.charAt(0).toUpperCase() + lesson.active.page?.header.page_template.slice(1)
}
load()

const confirm = async () => {
    await saveAnswer(pageAnswers.value)
}

</script>
