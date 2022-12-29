<template>
    <q-app-header class="bg-white rounded-b-md" reveal>
        <q-btn flat icon="close"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-linear-progress
            rounded size="20px"
            :value="(lesson.active.page?.exercise?.data.current_page / lesson.active.page?.exercise?.data.total_pages )"
            color="warning"  />
    </q-app-header>
    <q-page class="bg-white flex  full-width full-height" style="padding-top: 50px">
        <q-card flat class="relative text-left full-width" style="z-index: 1;">
            <q-card-section>
                <div class="text-h6"><b>{{lesson.active.page?.header?.title}}</b></div>
                <div class="text-subtitle1">{{lesson.active.page?.header?.subtitle}}</div>
            </q-card-section>
        </q-card>
        <component :is="PageTemplate" @onRendered="rendered = true"/>
        <component :is="FormTemplate" v-if="rendered" @update-answer="pageAnswers = $event" @onAnswerSaved="onAnswerSaved"/>
    </q-page>
    <q-footer expand position="bottom">
        <LessonActions @onPageChanged="onPageChanged" @onAnswerSaved="onAnswerSaved"/>
    </q-footer>
</template>

<script setup>
import LessonActions from '../components/Lesson/LessonActions.vue'
import { useLesson } from '../composables/useLesson'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, defineAsyncComponent, onActivated } from 'vue'

const route = useRoute()
const router = useRouter()
const { lesson, getItem, getPage, saveAnswer } = useLesson()

const pageAnswers = ref({})
const rendered = ref(false)

const pageTemplateTitle = ref(false)
const formTemplateTitle = ref(false)

const PageTemplate = computed(() => pageTemplateTitle.value ? defineAsyncComponent(() => import(`../components/Lesson/PageTemplates/${pageTemplateTitle.value}Page.vue`)) : null)
const FormTemplate = computed(() => formTemplateTitle.value ? defineAsyncComponent(() => import(`../components/Lesson/FormTemplates/${formTemplateTitle.value}Form.vue`)) : null)

const load = async () => {
  await getItem(route.params.lesson_id)
  onPageChanged()
}
load()

const onPageChanged = async (action) => {
  pageTemplateTitle.value = false
  formTemplateTitle.value = false
  const pageResponse = await getPage(action)
  if (!pageResponse) {
    // return router.push(`/lesson-startup-${route.params.lesson_id}`)
  }
  pageTemplateTitle.value = lesson.active.page?.header.page_template.charAt(0).toUpperCase() + lesson.active.page?.header.page_template.slice(1)
  if (lesson.active.page?.header.form_template) {
    formTemplateTitle.value = lesson.active.page?.header.form_template.charAt(0).toUpperCase() + lesson.active.page?.header.form_template.slice(1)
  }
}
const onAnswerSaved = async () => {
  const answers = {}
  for (const i in pageAnswers.value) {
    answers[i] = pageAnswers.value[i].value
  }
  await saveAnswer(answers)
}

</script>
