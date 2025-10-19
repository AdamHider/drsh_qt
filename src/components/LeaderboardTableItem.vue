<template>
    <q-item :key="`leaderboardKey${index}`" :active="item.is_active == 1" :class="` text-left rounded-sm ${(item.is_active == 1) ? ' bg-gradient-primary text-white' : 'text-dark'}`">
        <q-item-section avatar class="text-center">
          <q-avatar v-if="item.place == 1" floating rounded color="gradient-gold" class="text-white q-push" size="40px" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;">
            <b style="margin-bottom:2px">{{ item.place }}</b>
          </q-avatar>
          <q-avatar v-else-if="item.place == 2" floating rounded color="gradient-silver" size="40px" class="text-white q-push" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;">
            <b style="margin-bottom:2px">{{ item.place }}</b>
          </q-avatar>
          <q-avatar v-else-if="item.place == 3" floating rounded color="gradient-bronze" size="40px" class="text-white q-push" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;">
            <b style="margin-bottom:2px">{{ item.place }}</b>
          </q-avatar>
          <q-avatar v-else size="36px" >
            <b>{{ item.place }}</b>
          </q-avatar>
        </q-item-section>

        <q-item-section avatar>
          <div class="q-gutter-sm">
            <q-avatar size="36px" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px;">
                <img :src="item.image">
            </q-avatar>
          </div>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <span class="q-pa-none ">
              <b>{{ item.name }}</b>
              <span v-if="item.is_active" id="useritem"></span>
              <span class="q-ml-xs" v-if="item.achievements.length > 0">
                <q-avatar size="22px" v-for="(achievementItem, achievementIndex) in item.achievements" :key="`achievementIndex${achievementIndex}`">
                  <q-img :src="achievementItem.image"/>
                  <q-menu self="top middle">
                    <q-item class="q-pl-sm">
                      <q-item-section avatar>
                        <q-img :src="achievementItem.image"/>
                      </q-item-section>
                      <q-item-section>
                        <b>{{ achievementItem.title }}</b>
                      </q-item-section>
                    </q-item>
                  </q-menu>
                </q-avatar>
              </span>
            </span>
          </q-item-label>
          <q-item-label caption :class="` ${(item.is_active == 1) ? ' text-white' : 'text-grey-8'}`">
            Уровень {{ item.level.level }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div :class="`text-subtitle ${(item.is_active == 1) ? ' text-white' : 'text-grey-8'}`"><b>{{ item.points }}</b></div>
        </q-item-section>
    </q-item>

</template>

<script setup>
const props = defineProps({
  index: Number,
  item: Object
})

</script>
