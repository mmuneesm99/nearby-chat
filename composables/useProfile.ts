import { doc, setDoc, getDoc } from 'firebase/firestore'

export const useProfile = () => {
  const { $firestore } = useNuxtApp()
  const loading = ref(false)
  const error = ref(null)

  const updateProfile = async (userId: string, data: { name?: string; status?: string }) => {
    loading.value = true
    error.value = null
    try {
      const userRef = doc($firestore, 'users', userId)
      await setDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true })
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const getProfile = async (userId: string) => {
    loading.value = true
    error.value = null
    try {
      const userRef = doc($firestore, 'users', userId)
      const userDoc = await getDoc(userRef)
      return userDoc.data()
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    updateProfile,
    getProfile
  }
} 