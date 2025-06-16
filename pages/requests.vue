<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Chat Requests</h1>

    <div v-if="loading" class="flex justify-center">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>

    <div v-else>
      <h2 class="text-xl font-semibold mb-4">Incoming Requests</h2>
      <div v-if="incomingRequests.length === 0" class="text-gray-500 text-center py-4">
        No incoming requests
      </div>
      <RequestCard
        v-for="request in incomingRequests"
        :key="request.id"
        :request="request"
        :loading="loading"
        @accept="acceptRequest(request.id)"
        @reject="rejectRequest(request.id)"
      />

      <h2 class="text-xl font-semibold mb-4 mt-8">Outgoing Requests</h2>
      <div v-if="outgoingRequests.length === 0" class="text-gray-500 text-center py-4">
        No outgoing requests
      </div>
      <div
        v-for="request in outgoingRequests"
        :key="request.id"
        class="bg-white rounded-lg shadow p-4 mb-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold">{{ request.toName || 'Anonymous User' }}</h3>
            <p class="text-gray-600">Request sent {{ formatTime(request.createdAt) }}</p>
          </div>
          <span class="text-yellow-500">Pending</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
const { requests, loading, error, acceptRequest, rejectRequest, watchRequests, watchOutgoingRequests } = useRequests()

const incomingRequests = ref([])
const outgoingRequests = ref([])

onMounted(() => {
  if (!user.value) return

  const unsubscribeIncoming = watchRequests(user.value.uid)
  const unsubscribeOutgoing = watchOutgoingRequests(user.value.uid)

  onUnmounted(() => {
    unsubscribeIncoming()
    unsubscribeOutgoing()
  })
})

const formatTime = (date: string) => {
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    -Math.round((Date.now() - new Date(date).getTime()) / (1000 * 60)),
    'minute'
  )
}
</script> 