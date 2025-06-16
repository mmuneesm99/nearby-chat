<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-2xl mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold">Nearby Chat</h1>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/requests" class="text-blue-500 hover:text-blue-600">
              Requests
            </NuxtLink>
            <NuxtLink to="/profile" class="text-blue-500 hover:text-blue-600">
              Profile
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-2xl mx-auto p-4">
      <!-- Distance Filter -->
      <DistanceFilter
        v-model:distance="selectedDistance"
        @update:distance="handleDistanceChange"
      />

      <!-- Incoming Requests -->
      <div v-if="incomingRequests.length > 0" class="mb-6">
        <h2 class="text-lg font-semibold mb-3">Incoming Requests</h2>
        <RequestCard
          v-for="request in incomingRequests"
          :key="request.id"
          :request="request"
          :loading="loading"
          @accept="handleAcceptRequest(request.id)"
          @reject="handleRejectRequest(request.id)"
        />
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

      <!-- Error Messages -->
      <div v-if="locationError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ locationError }}
      </div>
      <div v-if="usersError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ usersError }}
      </div>

      <!-- Loading State -->
      <div v-if="usersLoading" class="py-8">
        <LoadingSpinner text="Finding nearby users..." />
      </div>

      <!-- No Users Found -->
      <div v-else-if="users.length === 0" class="text-center py-8 text-gray-500">
        <p>No users found nearby</p>
        <p class="text-sm mt-2">Try increasing the distance or check back later</p>
      </div>

      <!-- Users List -->
      <div v-else class="space-y-4">
        <UserCard
          v-for="user in users"
          :key="user.id"
          :user="user"
          :loading="loading"
          @send-request="handleSendRequest(user.id)"
        />
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
</script> 