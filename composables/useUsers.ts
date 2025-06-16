import { collection, doc, setDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore'

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export const useUsers = () => {
  const { $firestore } = useNuxtApp()
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)
  const maxDistance = ref(5) // Default 5km radius

  const updateUserLocation = async (userId: string, location: { latitude: number; longitude: number }) => {
    try {
      const userRef = doc($firestore, 'users', userId)
      await setDoc(userRef, {
        location,
        lastSeen: new Date().toISOString()
      }, { merge: true })
    } catch (e) {
      error.value = e.message
    }
  }

  const getNearbyUsers = async (userLocation: { latitude: number; longitude: number }) => {
    loading.value = true
    error.value = null
    try {
      const usersRef = collection($firestore, 'users')
      const q = query(
        usersRef,
        orderBy('lastSeen', 'desc')
      )

      // Set up real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        users.value = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(user => {
            if (!user.location) return false
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              user.location.latitude,
              user.location.longitude
            )
            return distance <= maxDistance.value
          })
          .map(user => ({
            ...user,
            distance: calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              user.location.latitude,
              user.location.longitude
            )
          }))
      })

      // Return cleanup function
      return unsubscribe
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const setMaxDistance = (distance: number) => {
    maxDistance.value = distance
  }

  return {
    users,
    loading,
    error,
    maxDistance,
    updateUserLocation,
    getNearbyUsers,
    setMaxDistance
  }
} 