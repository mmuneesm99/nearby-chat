export const useLocation = () => {
  const location = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const getLocation = () => {
    loading.value = true
    error.value = null

    if (!navigator.geolocation) {
      error.value = 'Geolocation is not supported by your browser'
      loading.value = false
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        location.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        loading.value = false
      },
      (err) => {
        error.value = err.message
        loading.value = false
      }
    )
  }

  return {
    location,
    error,
    loading,
    getLocation
  }
} 