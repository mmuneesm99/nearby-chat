<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center">Nearby Chat</h1>
      
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <div v-if="locationError" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        {{ locationError }}
      </div>

      <button
        @click="handleLogin"
        :disabled="loading"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
      >
        <LoadingSpinner v-if="loading" class="h-5 w-5 mr-2" />
        {{ loading ? 'Logging in...' : 'Start Chatting Anonymously' }}
      </button>

      <p class="text-sm text-gray-500 mt-4 text-center">
        You'll need to allow location access to find nearby users
      </p>
    </div>
  </div>
</template>

<script setup>
const { user, loading, error, login } = useAuth()
const { location, error: locationError, getLocation } = useLocation()
const router = useRouter()

const handleLogin = async () => {
  try {
    await login()
    if (user.value) {
      await getLocation()
      if (location.value) {
        router.push('/nearby')
      }
    }
  } catch (e) {
    console.error('Login error:', e)
  }
}
</script> 