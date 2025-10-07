<template>
  <div >
    <q-scroll-area
      style="width: 100dvw; height: 100dvh;"
      :thumb-style="{opacity: 0}">
      <q-page-container>
        <slot />
      </q-page-container>
    </q-scroll-area>
  </div>
</template>
