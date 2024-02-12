<template>
  <div >
    <q-scroll-area
      style="width: 100vw; height: 100vh;"
      :thumb-style="{opacity: 0}">
      <q-page-container>
        <slot />
      </q-page-container>
    </q-scroll-area>
  </div>
</template>
