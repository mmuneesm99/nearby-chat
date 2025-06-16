<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <NuxtLink to="/nearby" class="text-gray-600 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <h1 class="text-lg font-semibold">Chat with Anonymous User</h1>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-4" ref="messagesContainer">
      <div class="max-w-2xl mx-auto space-y-4">
        <div v-if="loading" class="py-4">
          <LoadingSpinner text="Loading messages..." />
        </div>

        <div v-else-if="messages.length === 0" class="text-center py-4 text-gray-500">
          No messages yet. Start the conversation!
        </div>

        <template v-else>
          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              'flex',
              message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              :class="[
                'max-w-[70%] rounded-lg px-4 py-2',
                message.senderId === currentUser?.uid
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900'
              ]"
            >
              <p class="text-sm">{{ message.text }}</p>
              <p class="text-xs mt-1 opacity-75">
                {{ formatTime(message.createdAt) }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Message Input -->
    <div class="bg-white border-t">
      <div class="max-w-2xl mx-auto px-4 py-3">
        <form @submit.prevent="handleSendMessage" class="flex space-x-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type a message..."
            class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="loading"
          />
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
            :disabled="!newMessage.trim() || loading"
          >
            <LoadingSpinner v-if="loading" class="h-4 w-4" />
            <span v-else>Send</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { user: currentUser } = useAuth()
const { messages, loading, error, sendMessage, watchMessages } = useChat()
const newMessage = ref('')
const messagesContainer = ref(null)
let unsubscribe = null

onMounted(() => {
  if (currentUser.value) {
    unsubscribe = watchMessages(route.params.chatId)
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

// Auto-scroll to bottom when new messages arrive
watch(messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { deep: true })

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || !currentUser.value) return

  await sendMessage(route.params.chatId, currentUser.value.uid, newMessage.value.trim())
  newMessage.value = ''
}

const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script> 