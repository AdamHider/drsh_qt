<template  withBackground="true">
    <q-chip class="transparent no-shadow"
        clickable 
        icon-right="autorenew"
        text-color="white"
        @click="dialog = true"
    >
        <q-avatar>
          <q-img :src="`${CONFIG.API_HOST}${classroom.active?.introimage}`"/>
        </q-avatar>
        <div class="ellipsis">
            <b>{{classroom.active?.title}}</b>
            <q-tooltip>{{classroom.active?.title}}</q-tooltip>
        </div>
    </q-chip>
    <q-dialog v-model="dialog" position="top">
      <q-card style="width: 350px">
        <q-linear-progress :value="0.6" color="pink" />

        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">The Walker</div>
            <div class="text-grey">Fitz & The Tantrums</div>
          </div>

          <q-space />

          <q-btn flat round icon="fast_rewind" />
          <q-btn flat round icon="pause" />
          <q-btn flat round icon="fast_forward" />
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { useClassroom } from '../composables/useClassroom'
import ClassroomSlider from '../components/ClassroomSlider.vue'
import { CONFIG } from '../config.js'

const { user, signOut } = useUserStore();
const { classroom } = useClassroom();

const dialog = ref(false);

</script>