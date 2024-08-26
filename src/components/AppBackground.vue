<template>
    <div class="app-background">
        <div class="app-background-color"></div>
        <div class="app-background-image-far"></div>
        <div class="app-background-image"></div>
    </div>
</template>

<script setup ></script>

<style>
.app-background{
  position: fixed;
}
.app-background.app-background-visible{
    display: block !important;

}
.app-background .app-background-color{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right top, #290f53, #3f2899, #1356b0, #2295d9);
    background-size: 200%;
    background-position-x: 0%;
    background-position-y: 0%;
    background-repeat: no-repeat;
    -webkit-animation: 8s linear 0s infinite  backgroundGradientMovement;
    animation: 8s linear 0s infinite  backgroundGradientMovement;
}
/*
.app-background .app-background-image{
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background-image: url(/src/assets/images/rocket_pattern.png);
    transform: rotate(27deg);
    background-size: 90px;
    background-repeat: repeat;
    opacity: 0.1;
    background-position-y: 0;
    -webkit-animation: 8s linear 0s infinite  backgroundPatternMovement;
    animation: 8s linear 0s infinite  backgroundPatternMovement;
}*/
.app-background .app-background-image{
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background-image: url(/src/assets/images/star_pattern.png);
    transform: rotate(28deg);
    background-size: 180px;
    background-repeat: repeat;
    opacity: 0.8;
    background-position-y: 0;
    -webkit-animation: 12s linear 0s infinite  backgroundPatternMovement;
    animation: 12s linear 0s infinite  backgroundPatternMovement;
}

.app-background .app-background-image-far{
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background-image: url(/src/assets/images/star_pattern.png);
    transform: rotate(26deg);
    background-size: 100px;
    background-repeat: repeat;
    opacity: 0.4;
    background-position-y: 0;
    -webkit-animation: 15s linear 0s infinite  backgroundPatternMovementFar;
    animation: 15s linear 0s infinite  backgroundPatternMovementFar;
}

@keyframes backgroundGradientMovement {
    0% { background-position-x: 0%; background-position-y: 0%; }
    50% { background-position-x: 100%; background-position-y: 100%; }
    100% { background-position-x: 0%; background-position-y: 0%; }
}
@keyframes backgroundPatternMovement {
    from { background-position-y: 0; }
      to { background-position-y: -180px; }
}
@keyframes backgroundPatternMovementFar {
    from { background-position-y: 0; }
      to { background-position-y: -100px; }
}

</style>
