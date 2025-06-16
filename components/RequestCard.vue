<template>
  <div class="bg-white rounded-lg shadow p-4 mb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold">{{ request.fromName || 'Anonymous User' }}</h3>
        <p class="text-gray-600">wants to chat with you</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="$emit('accept')"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          :disabled="loading"
        >
          Accept
        </button>
        <button
          @click="$emit('reject')"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          :disabled="loading"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  request: {
    id: string
    fromName?: string
    fromUid: string
    createdAt: string
  }
  loading?: boolean
}>()

defineEmits<{
  (e: 'accept'): void
  (e: 'reject'): void
}>()
</script> 