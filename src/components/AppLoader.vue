<template>
    <q-dialog
      v-model="dialog"
      persistent
      maximized
      transition-show="fade"
      transition-hide="fade"
    >
      <q-card class="bg-transparent text-white text-center  column  justify-end" style="z-index: 1;">
        <q-card-section>
          <div class="text-subtitle1"><b>Летим...</b></div>
        </q-card-section>
      </q-card>
      <div>
      <div class="loading-background"></div>
        <div class="loading-stars loading-stars-near"></div>
        <div class="loading-ship">
          <div class="loading-ship1"></div>
          <div class="loading-ship2"></div>
        </div>
      </div>

    </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useLoader } from '../composables/useLoader'

const { loader } = useLoader()

const dialog = ref(false)

watch(() => loader.status, () => {
  dialog.value = loader.status
})
</script>
<style scoped lang="scss">
.loading-background{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-image: url('/images/loading_screen/background.jpg');
  z-index: 0;
  filter: blur(4px);
}
.loading-ship{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-animation: shakeShip 2s linear infinite alternate;
  animation: shakeShip 2s linear infinite alternate;
  .loading-ship1{
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('/images/loading_screen/spaceship1.png');
  }
  .loading-ship2{
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('/images/loading_screen/spaceship2.png');
    animation: blinkShip 0.3s linear infinite alternate;
  }
}
.loading-stars{
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    rotate: 27deg;
    background-image: url(/images/star_motion_pattern.png);
    background-repeat: repeat;
    background-position-y: 0;
    &.loading-stars-near{
      opacity: 0.5;
      background-size: 280px;
      -webkit-animation: 1s linear 0s infinite  loadingStarsMovement;
      animation: 1s linear 0s infinite  loadingStarsMovement;
    }
    &.loading-stars-far{
      opacity: 0.1;
      background-size: 100px;
      -webkit-animation: 1s linear 0s infinite  loadingStarsMovementFar;
      animation: 1s linear 0s infinite  loadingStarsMovementFar;
    }

}

@keyframes shakeShip {
  0%{ transform: translate(0px, 0px); }
  100%{ transform: translate(0px, -5px); }
}
@keyframes blinkShip {
  0%{ opacity: 0; }
  100%{ opacity: translateY(10px); }
}
@keyframes loadingStarsMovement {
    from { background-position: 0 0; }
      to { background-position: -280px 280px; }
}
@keyframes loadingStarsMovementFar {
    from { background-position: 0 0; }
      to { background-position: -100px 100px; }
}

</style>
