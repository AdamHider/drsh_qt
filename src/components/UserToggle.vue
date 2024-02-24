<template  withBackground="true">
    <q-chip class="transparent no-shadow" style="color: inherit"
        clickable dense
        @click="dialog = true"
    >
        <q-avatar size="22">
          <img :src="user.active.data?.character?.avatar">
        </q-avatar>
        <div class="ellipsis">
            <b>{{user.active.data?.username}}</b>
            <q-tooltip>{{user.active.data?.name}}</q-tooltip>
            <q-icon name="expand_more" size="sm"></q-icon>
        </div>
    </q-chip>
    <q-dialog v-model="dialog">
      <q-card style="min-width: 300px">
        <q-card-section>
            <div class="text-h6">Choose user</div>
        </q-card-section>
            <q-list lines="two">
                <q-item clickable v-ripple v-for="(userItem, index) in user.list" :key="index">
                    <q-item-section>
                        <q-item-label lines="1"><b>{{userItem.data?.username}}</b></q-item-label>
                        <q-item-label caption><b>Level: {{userItem.data?.level.level}}</b></q-item-label>
                    </q-item-section>

                    <q-item-section side >
                        <q-btn v-if="userItem.data?.id != user.active.data.id"
                            flat
                            :loading="btnLoading[index]"
                            @click="switchUser(userItem, index)"
                            label="Sign In"/>
                        <q-btn v-else
                            flat
                            label="Active"
                            color="positive"/>
                    </q-item-section>
                </q-item>
            </q-list>
        <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="CLOSE" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const { user, signIn } = useUserStore()
const dialog = ref(false)
const btnLoading = ref([])

const switchUser = async (userItem, key) => {
  btnLoading.value[key] = true
  await signIn(userItem.authorization, userItem.activeClassroom)
  btnLoading.value[key] = false
  dialog.value = false
}

</script>
