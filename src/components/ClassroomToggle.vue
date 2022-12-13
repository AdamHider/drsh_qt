<template  withBackground="true">
    <q-chip class="transparent no-shadow"
        clickable 
        icon-right="autorenew"
        text-color="white"
        @click="dialog = true"
    >
        <q-avatar size="30px">
          <img :src="`${CONFIG.API_HOST}${classroom.active?.introimage}`"/>
        </q-avatar>
        <div class="ellipsis">
            <b>{{classroom.active?.title}}</b>
            <q-tooltip>{{classroom.active?.title}}</q-tooltip>
        </div>
    </q-chip>
    <q-dialog v-model="dialog" position="top">
      <q-card style="width: 350px">
        <q-card-section class="q-pb-none">
          <div class="text-h6">Choose your classroom</div>
        </q-card-section>
        <q-card-section class="q-pt-none q-px-none">
          <ClassroomSlider
                  :slidesPerView=1.5
                  :centerAligned="false"
                  :withButton="false"
                  slideHeight="100"
                  :navigation="false"
          />
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