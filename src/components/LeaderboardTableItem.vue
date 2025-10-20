<template>
    <q-item  :active="item.is_active == 1" :class="` text-left ${(item.place <= 3) ? 'q-push q-my-xs place-'+item.place : ''} rounded-sm ${(item.is_active == 1) ? ' place-user q-push' : 'bg-white text-dark place-common'}`">
        <q-item-section side class="text-center ">
          <q-avatar v-if="item.place == 1" floating rounded color="gradient-gold" class="text-white q-push" size="32px" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;">
            <b style="margin-bottom:2px">{{ item.place }}</b>
          </q-avatar>
          <q-avatar v-else-if="item.place == 2" floating rounded color="gradient-silver" size="32px" class="text-white q-push" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;">
            <b style="margin-bottom:2px">{{ item.place }}</b>
          </q-avatar>
          <q-avatar v-else-if="item.place == 3" floating rounded color="gradient-bronze" size="32px" class="text-white q-push" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;">
            <b style="margin-bottom:2px">{{ item.place }}</b>
          </q-avatar>
          <q-avatar v-else size="28px" >
            <b>{{ item.place }}</b>
          </q-avatar>
        </q-item-section>

        <q-item-section avatar>
          <div class="q-gutter-sm">
            <q-avatar size="36px" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px;">
                <img :src="item.image" >
            </q-avatar>
          </div>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <span class="q-pa-none ">
              <b>{{ item.name }}</b>
              <span class="q-ml-xs" v-if="item.achievements?.length > 0">
                <q-avatar size="22px" v-for="(achievementItem, achievementIndex) in item.achievements" :key="`achievementIndex${achievementIndex}`">
                  <q-img :src="achievementItem.image" no-transition/>
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
          <q-item-label caption>
            Уровень {{ item.level.level }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-avatar v-if="item.is_growing" class="q-push rounded-xs"  color="green-5" size="22px">
            <q-icon size="14px" color="white" class="q-mb-xs" name="keyboard_double_arrow_up"/>
          </q-avatar>
          <q-avatar v-else class="q-push rounded-xs"  color="red-5" size="22px">
            <q-icon size="14px" color="white" class="q-mb-xs" name="keyboard_double_arrow_down"/>
          </q-avatar>
        </q-item-section>
        <q-item-section side style="padding-left: 4px">
          <div class="stars flex items-center text-dark bg-dark-transparent rounded-sm q-px-sm q-py-xs">
            <b style="font-size: 0.75rem;">{{ item.resource.quantity.toLocaleString() }}</b>
            <q-img :src="item.resource.image" width="18px" height="18px" class=" star-image q-ml-xs" no-transition
              style="flex: 1; margin-top: -2px; filter: drop-shadow(0px 1px 2px #00000075);"/>
          </div>
        </q-item-section>
    </q-item>

</template>

<script setup>
const props = defineProps({
  item: Object
})

</script>
<style scoped lang="scss">
.star-image{

}
.place-1{
  background: $gradient-gold !important;
  color: white !important;
  text-shadow: 1px 1px 3px #0000008f;
  .stars, .text-caption, .q-avatar{
    color: white !important;
  }
}
.place-2{
  background: $gradient-silver !important;
  color: white !important;
  text-shadow: 1px 1px 3px #0000008f;
  .stars, .text-caption, .q-avatar{
    color: white !important;
  }
}
.place-3{
  background: $gradient-bronze !important;
  color: white !important;
  text-shadow: 1px 1px 3px #0000008f;
  .stars, .text-caption, .q-avatar{
    color: white !important;
  }
}



.place-user{
  background: $gradient-primary !important;
  color: white !important;
  text-shadow: 1px 1px 3px #0000008f;
  .stars, .text-caption, .q-avatar{
    color: white !important;
  }
}
.place-common:not(.place-1,.place-2,.place-3){
  border-bottom: 4px solid transparent;
  .stars{
    background: $grey-3 !important;
  }
  .q-avatar{
    color: $dark;
  }
}

</style>
