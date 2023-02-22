<template>
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
            v-model="formData.fields.username.value"
            :rules="formData.fields.username.rules"
            :error-message="formData.fields.username.errors"
            :error="formData.fields.username.errors !== ''"
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
          <ImageUploader :image="formData.fields.image.value" @update="formData.fields.image.value = $event"/>
          <div class="text-bold q-my-md">Privacy</div>
          <q-toggle
            name="is_private"
            v-model="formData.fields.is_private"
            label="Is private classroom"
          />
      </q-form>
  </q-page>
</template>

<script setup >
import ImageUploader from '../components/ImageUploader.vue'
import { useUserStore } from '../stores/user'
import { useClassroom } from '../composables/useClassroom'
import { reactive, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const form = ref(null)
const classroomBackgroundImage = ref([])

const route = useRoute()
const router = useRouter()
const { user, checkUsername, checkdescription, saveItem } = useUserStore()
const { classroom, getItem } = useClassroom()

const formData = reactive({
  step: route.params.step,
  passwordIsPin: true,
  valid: true,
  fields: {
    username: {
      value: classroom.active.title,
      rules: [
        v => !!v || 'Username is required',
        v => v.length > 3 || 'Username must be at least 3 characters long'
      ],
      errors: ''
    },
    description: {
      value: classroom.active.description,
      rules: [
        v => v.length <= 300 || 'Description must be maximum 300 characters long'
      ],
      errors: ''
    },
    image: {
      value: classroom.active.image,
      rules: [
        v => !!v || 'Image is required'
      ],
      errors: ''
    },
    is_private: {
      value: user.active.is_private,
      errors: ''
    }
  }
})

const saveChanges = async function () {
  formData.valid = await form.value.validate()
  if (formData.valid) {
    const data = {
      user_id: user.active.data.id,
      username: formData.fields.username.value,
      description: formData.fields.description.value,
      phone: formData.fields.phone.value
    }
    const saved = await saveItem(data)
    if (!saved.error) {
      return router.go(-1)
    } else {
      formData.fields[saved.data].errors = saved.message
    }
  }
}

watch(() => formData.fields.username.value, async (currentValue, oldValue) => {
  formData.fields.username.errors = ''
  const result = await checkUsername({ username: currentValue })
  if (result) {
    formData.fields.username.suggestions = result
    formData.fields.username.errors = 'Username is in use'
  }
})
watch(() => formData.fields.description.value, async (currentValue, oldValue) => {
  formData.fields.description.errors = ''
  if (!currentValue || /.+@.+\..+/.test(currentValue) === false) return
  const result = await checkdescription({ description: currentValue })
  console.log(result.messages)
  if (result.error) {
    formData.fields.description.errors = result.messages.error
    formData.valid = false
  }
})
onMounted(() => {
  getItem(route.params.classroom_id)
})
watch(() => route.params.classroom_id, (newData, oldData) => {
  getItem(route.params.classroom_id)
})
</script>
