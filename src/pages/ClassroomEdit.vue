<template>
  <q-page-wrapper>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title>Classroom Edit</q-toolbar-title>
        <q-btn flat icon="check" @click="saveChanges()"/>
    </q-app-header>
    <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
        <q-form
          ref="form"
          v-model="formData.valid"
          @submit.prevent="validate()"
          autocomplete="off"
          class="full-width"
        >
            <div class="text-bold q-my-md">Description</div>
            <q-input
              outlined
              v-model="formData.fields.title.value"
              :rules="formData.fields.title.rules"
              :error-message="formData.fields.title.errors"
              :error="formData.fields.title.errors !== ''"
              label="Name"
              required
            >
            </q-input>
            <q-input
              outlined
              v-model="formData.fields.description.value"
              type="textarea"
              counter
              :rules="formData.fields.description.rules"
              :error-message="formData.fields.description.errors"
              :error="formData.fields.description.errors !== ''"
              label="Description"
            ></q-input>
            <div class="q-gutter-md row">
              <ImageUploader
                class="col"
                :image="classroom.image"
                @update="classroom.image = $event"
                label="Image"
              />
              <ImageUploader
                class="col"
                :image="classroom.background_image"
                @update="classroom.background_image = $event"
                label="Background image"
              />
            </div>
            <div class="text-bold q-my-md">Privacy</div>
            <q-toggle
              name="is_private"
              v-model="formData.fields.is_private.value"
              label="Is private classroom"
            />
        </q-form>
    </q-page>
  </q-page-wrapper>
</template>

<script setup >
import { api } from '../services/index'
import ImageUploader from '../components/ImageUploader.vue'
import { useUserStore } from '../stores/user'
import { reactive, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const form = ref(null)

const route = useRoute()
const router = useRouter()
const { user } = useUserStore()
const classroom = ref({})

const formData = reactive({
  valid: true,
  fields: {
    title: {
      value: classroom.value.title,
      rules: [
        v => !!v || 'Title is required',
        v => v.length > 3 || 'title must be at least 3 characters long'
      ],
      errors: ''
    },
    description: {
      value: classroom.value.description,
      rules: [
        v => !v || v === '' || (v !== '' && v.length >= 10) || 'Description must be minimum 10 characters long',
        v => !v || v === '' || (v !== '' && v.length <= 300) || 'Description must be maximum 300 characters long'
      ],
      errors: ''
    },
    image: {
      value: classroom.value.image
    },
    background_image: {
      value: classroom.value.background_image
    },
    is_private: {
      value: classroom.value.is_private,
      errors: ''
    }
  }
})

const saveChanges = async function () {
  formData.valid = await form.value.validate()
  if (formData.valid) {
    const data = {
      id: classroom.value.id,
      title: formData.fields.title.value,
      description: formData.fields.description.value,
      image: formData.fields.image.value.split(/[/]+/).pop(),
      background_image: formData.fields.background_image.value.split(/[/]+/).pop(),
      is_private: formData.fields.is_private.value
    }
    const saved = await api.classroom.saveItem(data)
    if (!saved.error) {
      return router.go(-1)
    } else {
      formData.fields[saved.data].errors = saved.message
    }
  }
}
const loadData = async () => {
  const classroomResponse = await api.classroom.getItem({ classroom_id: route.params.classroom_id })
  if (classroomResponse.error) {
    classroom.value = {}
    return
  }
  classroom.value = classroomResponse
  if (classroom.value.owner_id !== user.active.data.id) {
    return router.go(-1)
  }
  for (const k in formData.fields) {
    formData.fields[k].value = classroom.value[k]
  }
}
onMounted(() => {
  loadData()
})

watch(() => classroom.value.image, async (currentValue, oldValue) => {
  formData.fields.image.value = classroom.value.image
})
watch(() => classroom.value.background_image, async (currentValue, oldValue) => {
  formData.fields.background_image.value = classroom.value.background_image
})
watch(() => route.params.classroom_id, (newData, oldData) => {
  loadData()
})
</script>
