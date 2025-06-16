<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-2xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Nearby Users</h1>
        <div class="flex items-center space-x-2">
          <label for="distance" class="text-sm text-gray-600">Max Distance:</label>
          <select
            id="distance"
            v-model="selectedDistance"
            class="border rounded px-2 py-1"
            @change="handleDistanceChange"
            :disabled="usersLoading"
          >
            <option value="1">1 km</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="20">20 km</option>
          </select>
        </div>
      </div>

      <!-- Incoming Requests -->
      <div v-if="incomingRequests.length > 0" class="mb-6">
        <h2 class="text-lg font-semibold mb-3">Incoming Requests</h2>
        <div class="space-y-3">
          <div
            v-for="request in incomingRequests"
            :key="request.id"
            class="bg-white p-4 rounded-lg shadow"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Chat request from Anonymous User</span>
              <div class="space-x-2">
                <button
                  @click="handleAcceptRequest(request.id)"
                  class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center"
                  :disabled="loading"
                >
                  <LoadingSpinner v-if="loading" class="h-4 w-4" />
                  <span v-else>Accept</span>
                </button>
                <button
                  @click="handleRejectRequest(request.id)"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center"
                  :disabled="loading"
                >
                  <LoadingSpinner v-if="loading" class="h-4 w-4" />
                  <span v-else>Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Outgoing Requests -->
      <div v-if="outgoingRequests.length > 0" class="mb-6">
        <h2 class="text-lg font-semibold mb-3">Outgoing Requests</h2>
        <div class="space-y-3">
          <div
            v-for="request in outgoingRequests"
            :key="request.id"
            class="bg-white p-4 rounded-lg shadow"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Request sent to Anonymous User</span>
              <span class="text-sm text-gray-500">Pending...</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="locationError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ locationError }}
      </div>

      <div v-if="usersLoading" class="py-8">
        <LoadingSpinner text="Finding nearby users..." />
      </div>

      <div v-else-if="users.length === 0" class="text-center py-8 text-gray-500">
        <p>No users found nearby</p>
        <p class="text-sm mt-2">Try increasing the distance or check back later</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="user in users"
          :key="user.id"
          class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <span class="font-medium">Anonymous User</span>
              <span class="text-sm text-gray-500 ml-2">Last seen: {{ formatLastSeen(user.lastSeen) }}</span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">
                {{ formatDistance(user.distance) }} away
              </span>
              <button
                v-if="!hasOutgoingRequest(user.id)"
                @click="handleSendRequest(user.id)"
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
                :disabled="loading"
              >
                <LoadingSpinner v-if="loading" class="h-4 w-4" />
                <span v-else>Chat</span>
              </button>
              <span v-else class="text-sm text-gray-500">Request sent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { location, error: locationError, getLocation } = useLocation()
const { users, loading: usersLoading, error: usersError, getNearbyUsers, updateUserLocation, setMaxDistance } = useUsers()
const { user } = useAuth()
const { requests: incomingRequests, watchRequests, acceptRequest, rejectRequest } = useRequests()
const { requests: outgoingRequests, watchOutgoingRequests, sendRequest } = useRequests()
const selectedDistance = ref(5)
const loading = ref(false)

let unsubscribeUsers = null
let unsubscribeIncomingRequests = null
let unsubscribeOutgoingRequests = null

onMounted(async () => {
  await getLocation()
  if (location.value && user.value) {
    await updateUserLocation(user.value.uid, location.value)
    unsubscribeUsers = await getNearbyUsers(location.value)
    unsubscribeIncomingRequests = watchRequests(user.value.uid)
    unsubscribeOutgoingRequests = watchOutgoingRequests(user.value.uid)
  }
})

onUnmounted(() => {
  if (unsubscribeUsers) unsubscribeUsers()
  if (unsubscribeIncomingRequests) unsubscribeIncomingRequests()
  if (unsubscribeOutgoingRequests) unsubscribeOutgoingRequests()
})

const handleDistanceChange = () => {
  setMaxDistance(Number(selectedDistance.value))
}

const handleSendRequest = async (toUid) => {
  if (user.value) {
    loading.value = true
    try {
      await sendRequest(user.value.uid, toUid)
    } finally {
      loading.value = false
    }
  }
}

const handleAcceptRequest = async (requestId) => {
  loading.value = true
  try {
    await acceptRequest(requestId)
  } finally {
    loading.value = false
  }
}

const handleRejectRequest = async (requestId) => {
  loading.value = true
  try {
    await rejectRequest(requestId)
  } finally {
    loading.value = false
  }
}

const hasOutgoingRequest = (userId) => {
  return outgoingRequests.value.some(request => request.toUid === userId)
}

const formatLastSeen = (timestamp) => {
  if (!timestamp) return 'Unknown'
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  }
  return `${distance.toFixed(1)}km`
}
</script> 