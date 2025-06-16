<template>
  <div class="flex items-center justify-center">
    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
    <span v-if="text" class="ml-2 text-gray-600">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script> 