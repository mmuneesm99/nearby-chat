<template>
  <div class="bg-white rounded-lg shadow p-4 mb-4">
    <h3 class="text-lg font-semibold mb-2">Search Radius</h3>
    <div class="flex items-center gap-4">
      <input
        type="range"
        :min="1"
        :max="20"
        :value="distance"
        @input="$emit('update:distance', $event.target.value)"
        class="flex-1"
      />
      <span class="text-gray-600">{{ distance }}km</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  distance: number
}>()

defineEmits<{
  (e: 'update:distance', value: number): void
}>()
</script> 