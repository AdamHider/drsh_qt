<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md" reveal>
        <q-btn flat icon="close"  @click="closeDialog=true" v:slot="back-button"/>
        <q-linear-progress
            rounded size="20px"
            :value="(lesson.active.page?.exercise?.current_page / lesson.active.page?.exercise?.total_pages )"
            color="warning"  />
        <q-chip dense  color="transparent" text-color="orange" icon-right="star">
            <b>{{ lesson.active.page?.exercise?.totals.total }}</b>
        </q-chip>
    </q-app-header>
    <q-page class="bg-white flex  full-width full-height lesson-page" style="padding-top: 50px;">
        <q-card flat class="lesson-header relative text-left full-width absolute" style="top: 50px">
            <q-card-section class="q-py-none">
                <div class="text-subtitle1"><b>{{lesson.active.page?.header?.title}}</b></div>
                <div class="text-caption">{{lesson.active.page?.header?.subtitle}}</div>
            </q-card-section>
        </q-card>
        <component :is="PageTemplate" @onRendered="rendered = true"/>
        <component :is="FormTemplate" v-if="rendered" @update-answer="pageAnswers = $event" @onAnswerSaved="onAnswerSaved"  @onPageChanged="onPageChanged"/>
    </q-page>
    <q-footer expand position="bottom" class="bg-white lesson-bottombar ">
        <LessonActions @onPageChanged="onPageChanged" @onAnswerSaved="onAnswerSaved" :pageAnswers="pageAnswers"/>
    </q-footer>
    <q-dialog v-model="closeDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Close lesson</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Are you sure? You can back to it whenever you want though
        </q-card-section>
        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Continue" @click="closeLesson" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page-container>
</template>

<script setup>
import LessonActions from '../components/Lesson/LessonActions.vue'
import { useLesson } from '../composables/useLesson'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'

const route = useRoute()
const router = useRouter()
const { lesson, getItem, getPage, saveAnswer } = useLesson()

const pageAnswers = ref({})
const rendered = ref(false)

const pageTemplateTitle = ref(false)
const formTemplateTitle = ref(false)
const closeDialog = ref(false)
const closeConfirmed = ref(false)

const PageTemplate = computed(() => pageTemplateTitle.value ? defineAsyncComponent(() => import(`../components/Lesson/PageTemplates/${pageTemplateTitle.value}Page.vue`)) : null)
const FormTemplate = computed(() => formTemplateTitle.value ? defineAsyncComponent(() => import(`../components/Lesson/FormTemplates/${formTemplateTitle.value}Form.vue`)) : null)

const load = async () => {
  await getItem(route.params.lesson_id)
  onPageChanged()
}
onMounted(() => {
  closeConfirmed.value = false
  load()
})

const onPageChanged = async (action) => {
  rendered.value = false
  pageTemplateTitle.value = false
  formTemplateTitle.value = false
  const pageResponse = await getPage(action)
  if (pageResponse.error) {
    closeConfirmed.value = true
    router.go(-1)
    return
  }
  pageTemplateTitle.value = lesson.active.page?.header.page_template.charAt(0).toUpperCase() + lesson.active.page?.header.page_template.slice(1)
  if (lesson.active.page?.header.form_template && pageTemplateTitle.value) {
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

const closeLesson = () => {
  closeConfirmed.value = true
  router.go(-1)
}
onBeforeRouteLeave((to, from) => {
  if (!closeConfirmed.value) {
    closeDialog.value = true
    return false
  }
  closeDialog.value = false
  return true
})
</script>
<style lang="scss">

.q-select.q-select-inline .q-field__control,
.q-select.q-select-inline .q-field__native {
  min-height: 18px;
  padding: 0;
}

.green-word{
  color: $positive
}
.orange-word{
  color: $accent
}

.q-select.correct-answer.q-field--standard .q-field__control::before{
    border-color: $positive;
}
.q-select.wrong-answer.q-field--standard .q-field__control::before{
    border-color: $negative;
}

.lesson-bottombar{
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.12);
}

</style>
