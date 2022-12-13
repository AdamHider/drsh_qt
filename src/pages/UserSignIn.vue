<template>
  <q-header class="transparent text-white">
    <q-toolbar >
      <q-btn flat round dense icon="arrow_back" v-on:click="$router.go(-1);"></q-btn>
      <q-toolbar-title></q-toolbar-title>
    </q-toolbar>
  </q-header>
  <q-page class="flex justify-center items-end full-height full-width text-center">
    <q-form 
      ref="form"
      v-model="formData.valid" 
      @submit.prevent="validate()">
      <q-stepper
        class="full-width"
        v-model="formData.step"
        ref="stepper"
        color="primary"
        animated
      >
        <q-step
          :name="1"
          title="Select campaign settings"
          icon="settings"
          :done="done1"
        >
        <q-input
          v-model="formData.fields.username.value"
          :rules="formData.fields.username.rules"
          :error-messages="formData.fields.username.errors"
          label="Username or e-mail"
          required
        ></q-input>
        <q-stepper-navigation>
          <q-btn
              @click="validate()"
              v-on:keyup.enter="validate()" 
              color="primary" 
              label="Continue" />
        </q-stepper-navigation>
      </q-step>
      <q-step
          :name="2"
          title="Select campaign settings"
          icon="settings"
          :done="done2"
        >
          <q-field v-if="formData.passwordIsPin"
            v-model="formData.fields.password.value"
            :rules="formData.fields.password.rules"
          >
            <OTPInput 
              :fieldConfig="formData.fields.password"
              :default="formData.fields.password.value"
              @update:otp="formData.valid = $event.valid; formData.fields.password.value = $event.value;"
              :digit-count="4"
              label="Password"
            >
            </OTPInput>
          </q-field>
          <q-input v-else
            v-model="formData.fields.password.value"
            :append-icon="formData.fields.password.reveal ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="formData.fields.password.rules"
            :error-messages="formData.fields.password.errors"
            :type="formData.fields.password.reveal ? 'text' : 'password'"
            counter
            label="Password"
            @click:append="formData.fields.password.reveal = !formData.fields.password.reveal"
          ></q-input>
          <v-chip
            variant="text"
            class="ma-4"
            :ripple="false" 
            @click="formData.passwordIsPin = !formData.passwordIsPin; formData.fields.password.value = '';"
          >
            <template v-if="formData.passwordIsPin">Use password</template>
            <template v-else>Use pin</template>
          </v-chip>
          <q-stepper-navigation>
            <q-btn
                @click="validate()"
                v-on:keyup.enter="validate()" 
                color="primary" 
                label="Sign In" />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-form>
  </q-page>
</template>

<script setup >
import  OTPInput from '../components/OTPInput'
import { useUserStore } from '../stores/user'
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from "vue-router";

const form = ref(null);
const route = useRoute();
const router = useRouter();

const formData = reactive({
  step: route.params.step*1,
  passwordIsPin: true,
  valid: true,
  fields: {
    username: {
      value: '',
      rules: [
        v => !!v || 'Username or e-mail is required',
      ],
    }, 
    password: {
      value: '',
      rules: [
        v => !!v || 'Required.',
        v => (/^[0-9a-zA-Z]{4,}$/.test(v)) || 'Password must contain at least one digit, be of latin and min 8 characters',
      ],
      errors: '',
      reveal: false,
    }
  }
})

const { signIn } = useUserStore()

const steps = [
  '', 'password', 'password', 'terms'
];

const validate = async function () {
  formData.valid = await form.value.validate();
  if (formData.step == 2){
    const user_auth = {
      username: formData.fields.username.value,
      password: formData.fields.password.value
    };
    const logged = await signIn(user_auth);
    if(logged.success) return router.push('/user-dashboard');
    return;
  }
  if (formData.valid) formData.step++
  return router.push('/user-sign-in/step'+formData.step);
}

watch(() => route.params.step, (currentValue, oldValue) => {
  if(!formData.valid && route.params.step > formData.step){
    router.go(-1);
    return false;
  }
  formData.step = route.params.step*1;
});
</script>