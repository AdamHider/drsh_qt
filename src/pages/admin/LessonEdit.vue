<template>
  <q-page-container>
    <q-app-header>
        <q-btn flat round dense icon="arrow_back" v-on:click="$router.go(-1);" v:slot="back-button"></q-btn>
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat icon="check" @click="saveChanges()"/>
    </q-app-header>
    <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
      <q-form ref="form" v-model="formData.valid" @submit.prevent="validate()" class="full-width">
            <q-select
              v-model="formData.fields.course_id.value"
              :error-message="formData.fields.course_id.errors"
              :error="formData.fields.course_id.errors !== ''"
              clearable use-input
              emit-value map-options
              option-value="id" option-label="title"
              label="Select course"
              class="q-pt-sm q-pb-md"
              :options="formData.fields.course_id.options"
              @filter="courseAutocomplete"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-img :src="scope.opt.image" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.title }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select v-if="formData.fields.course_id.value"
              v-model="formData.fields.course_section_id.value"
              :error-message="formData.fields.course_section_id.errors"
              :error="formData.fields.course_section_id.errors !== ''"
              clearable use-input
              emit-value map-options
              option-value="id" option-label="title"
              label="Select course"
              class="q-pt-sm q-pb-md"
              :options="formData.fields.course_section_id.options"
              @filter="courseSectionAutocomplete"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-img :src="scope.opt.image" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.title }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input
              v-model="formData.fields.title.value"
              :rules="formData.fields.title.rules"
              :error-messages="formData.fields.title.errors"
              :error="formData.fields.title.isError"
              label="Title"
              required/>
            <q-input
              v-model="formData.fields.description.value"
              :rules="formData.fields.description.rules"
              :error-messages="formData.fields.description.errors"
              :error="formData.fields.title.isError"
              label="Description"
              required/>
      </q-form>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { useUserStore } from '../../stores/user'
import { reactive, ref, watch, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../services/index'

const form = ref(null)
const buttonLoading = ref(false)
const route = useRoute()
const router = useRouter()
const lesson = {}

const steps = [
  '', 'username', 'password'
]
const formData = reactive({
  step: route.params.step * 1,
  valid: true,
  fields: {
    course_id: {
      value: 0,
      options: [],
      errors: ''
    },
    course_section_id: {
      value: 0,
      options: [],
      errors: ''
    },
    title: {
      value: '',
      rules: [
        v => !!v || '* Title required',
        v => v.length > 3 || 'Please use minimum 3 character',
      ],
      errors: '',
      isError: false,
      required: true
    },
    description: {
      value: '',
      rules: [
        v => !!v || '* Title required',
        v => v.length > 3 || 'Please use minimum 3 character',
      ],
      errors: '',
      isError: false,
      required: true
    },
  }
})

const load = async function (filter) {
  const lessonItemResponse = await api.admin.lesson.getItem({ lesson_id: route.params.lesson_id })
  if (lessonItemResponse.error) {
    error.value = lessonItemResponse
    lesson.value = {}
    return {}
  }
  lesson.value = lessonItemResponse
  fillForm()
  loadCourseList()
  loadCourseSectionList()
}
const fillForm = async function () {
  formData.fields.title.value = lesson.value.title
  formData.fields.description.value = lesson.value.description
  formData.fields.course_id.value = lesson.value.course_id
  formData.fields.course_section_id.value = lesson.value.course_section_id
}
const saveChanges = async function () {
  formData.valid = await form.value.validate()
  if (formData.valid) {
    const data = {
      lesson_id: lesson.value.id,
      course_id: formData.fields.course_id.value,
      course_section_id: formData.fields.course_id.value,
      title: formData.fields.title.value,
      description: formData.fields.description.value
    }
    const saved = await api.admin.lesson.saveItem(data)
    if (!saved.error) {
      //return router.go(-1)
    } else {
      formData.fields[saved.data].errors = saved.message
    }
  }
}
const courseAutocomplete = async (val, update, abort) => {
  if(formData.fields.course_id.value && val == ""){
    val = formData.fields.course_id.options.find(e => e.id === formData.fields.course_id.value).title
  }
  loadCourseList(val)
  update()
}
const loadCourseList = async (title) => {
  const courseListResponse = await api.admin.course.getList({ title })
  if (courseListResponse.error) {
    // return router.go(-1)
  }
  formData.fields.course_id.options = courseListResponse
}
const courseSectionAutocomplete = async (val, update, abort) => {
  loadCourseSectionList(val)
  update()
}
const loadCourseSectionList = async (title) => {
  const courseSectionListResponse = await api.admin.course_section.getList({ title, course_id: formData.fields.course_id.value })
  if (courseSectionListResponse.error) {
    // return router.go(-1)
  }
  formData.fields.course_section_id.options = courseSectionListResponse
}
onActivated(() => {
  load()
})
watch(formData.fields, async (currentValue, oldValue) => {
  formData.valid = await form.value.validate()
})
watch(() => formData.fields.title.value, async (currentValue, oldValue) => {
  if (currentValue.length > 0) setTimeout(() => { formData.fields.title.isError = false }, 100)
})
watch(() => formData.fields.course_id.value, async (currentValue, oldValue) => {
  loadCourseSectionList()
})
</script>
