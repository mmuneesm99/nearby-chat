<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Profile</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Display Name</label>
          <input
            v-model="name"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <input
            v-model="status"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="What's on your mind?"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
const { updateProfile: updateUserProfile, loading } = useProfile()

const name = ref('')
const status = ref('')

const updateProfile = async () => {
  if (!user.value) return
  
  await updateUserProfile(user.value.uid, {
    name: name.value,
    status: status.value
  })
}
</script> 