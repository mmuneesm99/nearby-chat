<template>
  <div class="bg-white rounded-lg shadow p-4 mb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold">{{ user.name || 'Anonymous User' }}</h3>
        <p class="text-gray-600">{{ formatDistance(user.distance) }} away</p>
      </div>
      <button
        @click="$emit('send-request')"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        :disabled="loading"
      >
        {{ loading ? 'Sending...' : 'Chat' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  user: {
    id: string
    name?: string
    distance: number
  }
  loading?: boolean
}>()

defineEmits<{
  (e: 'send-request'): void
}>()

const formatDistance = (distance: number) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  }
  return `${distance.toFixed(1)}km`
}
</script> 