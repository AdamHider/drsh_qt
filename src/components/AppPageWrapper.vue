<template>
    <slot name=""></slot>
    
</template>

<script setup>

import { useNavigationHistory } from '../composables/useNavigationHistory'

const { routes } = useNavigationHistory()
</script>
