<template>
  <div
    :class="[
      'max-w-[70%] rounded-lg p-3 mb-2',
      isOwnMessage
        ? 'bg-blue-500 text-white ml-auto'
        : 'bg-gray-200 text-gray-800'
    ]"
  >
    <div class="flex flex-col">
      <p class="text-sm">{{ message.text }}</p>
      <span class="text-xs opacity-70 mt-1">
        {{ formatTime(message.createdAt) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: {
    text: string
    senderId: string
    createdAt: Date
  }
  currentUserId: string
}>()

const isOwnMessage = computed(() => props.message.senderId === props.currentUserId)

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
}
</script> 