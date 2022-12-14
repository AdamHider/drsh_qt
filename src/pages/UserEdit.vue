<template>
  <q-page class="bg-white q-pa-sm">
      <q-form
        ref="form"
        v-model="formData.valid"
        @submit.prevent="validate()"
        autocomplete="off"
        class="full-width"
      >
        <q-input
          v-model="formData.fields.name.value"
          :rules="formData.fields.name.rules"
          :error-message="formData.fields.name.errors"
          label="Name"
          required
        >
          <template v-if="formData.valid" v-slot:append-inner>
              <v-icon color="success" icon="mdi-check"></v-icon>
          </template>
        </q-input>
        <q-input
          v-model="formData.fields.username.value"
          :rules="formData.fields.username.rules"
          :error-message="formData.fields.username.errors"
          label="Name"
          required
        >
          <template v-if="formData.valid" v-slot:append-inner>
              <v-icon color="success" icon="mdi-check"></v-icon>
          </template>
          <template  v-slot:append-outer>
              <v-icon color="success" icon="mdi-change"></v-icon>
          </template>
        </q-input>
        <q-card  
          v-if="(formData.fields.username.suggestions.length > 0)"
          class="mx-auto pa-2"
        >
          <q-list>
            <q-list-item
              v-for="(item, index) in formData.fields.username.suggestions"
              :key="index"
              :value="item"
              @click="(formData.fields.username.value = item); formData.fields.username.suggestions = []"
            >
              <q-list-item-title class="text-left">{{ item }}</q-list-item-title>
              <template v-slot:append>        
                <v-icon color="success" icon="mdi-check"></v-icon>
              </template>
            </q-list-item>
          </q-list>
        </q-card>
        <q-btn
          class="mt-2 mb-2"
            block
            rounded="lg"
            to="user-password-edit"
            append-icon="mdi-pencil"
            label="Change password"
        />
        <q-input
          v-model="formData.fields.email.value"
          :rules="formData.fields.email.rules"
          :error-messages="formData.fields.email.errors"
          label="E-mail"
          required
        ></q-input>
      </q-form>
  </q-page>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from "vue-router";

const form = ref(null);
const route = useRoute();
const router = useRouter();
const { user, checkUsername, checkEmail, save } = useUserStore()


const formData = reactive({
  step: route.params.step,
  passwordIsPin: true,
  valid: true,
  fields: {
    name: {
      value: user.active.data.name,
      rules: [
        v => !!v || 'Name is required',
      ],
      suggestions: []
    }, 
    username: {
      value: user.active.data.username,
      rules: [
        v => !!v || 'Username is required',
      ],
      suggestions: []
    }, 
    email: {
      value: user.active.data.email,
      rules: [
        v => v === '' || ((/.+@.+\..+/.test(v)) || 'E-mail must be valid'),
      ],
      errors: '',
      required: false
    },
    terms: {
      value: false
    }
  }
})

const steps = [
  '', 'password', 'password', 'terms'
];



const saveChanges = async function () {
    const data = {
      name: formData.fields.name.value,
      username: formData.fields.username.value,
      email: formData.fields.email.value
    }
    const saved = await save(data);
    if(saved.success) return router.push('/user-dashboard');
    return;
}

watch(() => formData.fields.username.value, async (currentValue, oldValue) => {
    formData.fields.username.errors = '';
    const result = await checkUsername({username: currentValue});
    if(!result.success){
      formData.fields.username.errors = result.message;
    }
    formData.fields.username.suggestions = result.data;
});
watch(() => formData.fields.email.value, async (currentValue, oldValue) => {
  formData.fields.email.errors = '';
  if (!currentValue) return;
  const result = await checkEmail({email: currentValue});
  if(!result.success){
    formData.fields.email.errors = result.message;
    formData.valid = false;
  }
});
defineExpose({
  saveChanges
})
</script>