import { signInAnonymously } from 'firebase/auth'

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const login = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await signInAnonymously($auth)
      user.value = result.user
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    login
  }
} 