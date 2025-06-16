import { collection, doc, setDoc, onSnapshot, query, where, orderBy, deleteDoc } from 'firebase/firestore'

export const useRequests = () => {
  const { $firestore } = useNuxtApp()
  const requests = ref([])
  const loading = ref(false)
  const error = ref(null)
  const router = useRouter()
  const { createChat } = useChat()

  const sendRequest = async (fromUid: string, toUid: string) => {
    try {
      const requestRef = doc(collection($firestore, 'requests'))
      await setDoc(requestRef, {
        fromUid,
        toUid,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
    } catch (e) {
      error.value = e.message
    }
  }

  const acceptRequest = async (requestId: string) => {
    try {
      const requestRef = doc($firestore, 'requests', requestId)
      const requestDoc = await requestRef.get()
      const requestData = requestDoc.data()

      if (requestData) {
        // Create a new chat
        const chatId = await createChat([requestData.fromUid, requestData.toUid])
        
        if (chatId) {
          // Update request status
          await setDoc(requestRef, {
            status: 'accepted',
            acceptedAt: new Date().toISOString(),
            chatId
          }, { merge: true })

          // Navigate to the chat
          router.push(`/chat/${chatId}`)
        }
      }
    } catch (e) {
      error.value = e.message
    }
  }

  const rejectRequest = async (requestId: string) => {
    try {
      const requestRef = doc($firestore, 'requests', requestId)
      await setDoc(requestRef, {
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      }, { merge: true })
    } catch (e) {
      error.value = e.message
    }
  }

  const watchRequests = (userId: string) => {
    loading.value = true
    error.value = null

    const requestsRef = collection($firestore, 'requests')
    const q = query(
      requestsRef,
      where('toUid', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      requests.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    }, (err) => {
      error.value = err.message
      loading.value = false
    })

    return unsubscribe
  }

  const watchOutgoingRequests = (userId: string) => {
    const requestsRef = collection($firestore, 'requests')
    const q = query(
      requestsRef,
      where('fromUid', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      requests.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    })

    return unsubscribe
  }

  return {
    requests,
    loading,
    error,
    sendRequest,
    acceptRequest,
    rejectRequest,
    watchRequests,
    watchOutgoingRequests
  }
} 