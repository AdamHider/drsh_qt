<style>
</style>
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
      @submit.prevent="validate()"
      class="full-width">
      <q-card v-if="formData.step == 1" class="rounded-b-0">
        <q-card-section>
            <q-field v-if="formData.passwordIsPin"
              v-model="formData.fields.password.value"
              :rules="formData.fields.password.rules"
              label="Password"
              borderless
            >
              <OTPInput 
                :fieldConfig="formData.fields.password"
                @update:otp="formData.valid = $event.valid; formData.fields.password.value = $event.value;"
                :digit-count="4"
                type="password"
              >
              </OTPInput>
            </q-field>
            <q-input v-else
              v-model="formData.fields.password.value"
              :rules="formData.fields.password.rules"
              :error-messages="formData.fields.password.errors"
              :type="formData.fields.password.reveal ? 'text' : 'password'"
              counter
              label="Password"
              autocomplete="off"
            >
              <template v-slot:append>
                <q-icon
                  :name="formData.fields.password.reveal ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="formData.fields.password.reveal = !formData.fields.password.reveal"
                />
              </template>
            </q-input>
            <q-chip
              class="ma-4"
              clickable 
              :ripple="false" 
              @click="formData.passwordIsPin = !formData.passwordIsPin"
            >
              <template v-if="formData.passwordIsPin">Use password</template>
              <template v-else>Use pin</template>
            </q-chip>
        </q-card-section>
        <q-separator />
        <q-card-actions vertical>
          <q-btn
              @click="validate()"
              v-on:keyup.enter="validate()" 
              color="primary" 
              label="Continue" />
        </q-card-actions>
      </q-card>
      <q-card v-if="formData.step == 2" class="rounded-b-0">
        <q-card-section>
          <q-field v-if="formData.passwordIsPin"
            v-model="formData.fields.passwordConfirm.value"
            :rules="formData.fields.passwordConfirm.rules"
              label="Confirm password"
              borderless
          >
            <OTPInput 
              :fieldConfig="formData.fields.passwordConfirm"
              @update:otp="formData.valid = $event.valid; formData.fields.passwordConfirm.value = $event.value;"
              :digit-count="4"
                type="password"
            >
            </OTPInput>
          </q-field>
          <q-input  v-else
            v-model="formData.fields.passwordConfirm.value"
            :append-icon="formData.fields.passwordConfirm.reveal ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="formData.fields.passwordConfirm.rules"
            :type="formData.fields.passwordConfirm.reveal ? 'text' : 'password'"
            counter
            label="Confirm password"
            autocomplete="off"
            @click:append="formData.fields.passwordConfirm.reveal = !formData.fields.passwordConfirm.reveal"
          ></q-input>
          <q-chip
            class="ma-4"
            clickable
            :ripple="false" 
            @click="formData.passwordIsPin = !formData.passwordIsPin"
          >
            <template v-if="formData.passwordIsPin">Use password</template>
            <template v-else>Use pin</template>
          </q-chip>
        </q-card-section>
        <q-separator />
        <q-card-actions vertical>
          <q-btn
              @click="validate()"
              v-on:keyup.enter="validate()" 
              color="primary" 
              label="Continue" />
        </q-card-actions>
      </q-card>
      <q-card v-if="formData.step == 3" class="rounded-b-0">
        <q-card-section>
          <v-checkbox
            v-model="formData.fields.terms.value"
            :rules="[v => !!v || 'You must agree to continue!']"
            label="Do you agree?"
            required
          ></v-checkbox>
        </q-card-section>
        <q-separator />
        <q-card-actions vertical>
          <q-btn
              @click="validate()"
              v-on:keyup.enter="validate()" 
              color="primary" 
              label="Sign Up" />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup >
import  OTPInput from '../components/OTPInput'
import { useUserStore } from '../stores/user'
import { reactive, ref, watch, watchEffect } from 'vue'
import { useRouter, useRoute } from "vue-router";

const { signUp, signIn } = useUserStore()
const route = useRoute();
const router = useRouter();

const form = ref(null);
const formData = reactive({
  step: route.params.step*1,
  passwordIsPin: true,
  valid: true,
  fields: {
    password: {
      value: '',
      rules: [
        v => !!v || 'Required.',
        v => (/^[0-9a-zA-Z]{4,}$/.test(v)) || 'Password must contain at least one digit, be of latin and min 8 characters',
      ],
      errors: '',
      reveal: false,
      required: true
    },
    passwordConfirm: {
      value: '',
      rules: [
        v => !!v || 'Required.',
        v => (v === formData.fields.password.value) || 'Your passwords are different',
      ],
      errors: '',
      reveal: false,
      required: true
    },
    terms: {
      value: false
    }
  }
})

const steps = [
  '', 'password', 'password', 'terms'
];

const validate = async function () {
  formData.valid = await form.value.validate();
  if (formData.step == 3){
    const user_auth = {
      password: formData.fields.password.value
    };
    const authResponse = await signUp(user_auth);
    console.log(authResponse);
    if (authResponse.success) {
      const logged = await signIn(authResponse.data);
      if(logged.success) return router.push('/user-dashboard');
    } else {
      formData.fields[steps[formData.step]].errors = result.message;
    }
    return;
  }
  if (formData.valid) formData.step++
  return router.push('/user-sign-up/step'+formData.step);
}

watch(() => route.params.step, (currentValue, oldValue) => {
  if(!formData.valid && route.params.step > formData.step){
    router.go(-1);
    return false;
  }
  formData.step = route.params.step*1;
});

</script>