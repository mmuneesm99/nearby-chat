<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center">Nearby Chat</h1>
      
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <button
        @click="handleLogin"
        :disabled="loading"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ loading ? 'Logging in...' : 'Start Chatting Anonymously' }}
      </button>
    </div>
  </div>
</template>

<script setup>
const { user, loading, error, login } = useAuth()
const router = useRouter()

const handleLogin = async () => {
  await login()
  if (user.value) {
    router.push('/nearby')
  }
}
</script> 