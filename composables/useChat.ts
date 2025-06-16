import { collection, doc, setDoc, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'

export const useChat = () => {
  const { $firestore } = useNuxtApp()
  const messages = ref([])
  const loading = ref(false)
  const error = ref(null)

  const createChat = async (participants: string[]) => {
    try {
      const chatRef = doc(collection($firestore, 'chats'))
      await setDoc(chatRef, {
        participants,
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString()
      })
      return chatRef.id
    } catch (e) {
      error.value = e.message
      return null
    }
  }

  const sendMessage = async (chatId: string, senderId: string, text: string) => {
    try {
      const messagesRef = collection($firestore, 'chats', chatId, 'messages')
      await addDoc(messagesRef, {
        senderId,
        text,
        createdAt: serverTimestamp()
      })

      // Update lastMessageAt in chat document
      const chatRef = doc($firestore, 'chats', chatId)
      await setDoc(chatRef, {
        lastMessageAt: new Date().toISOString()
      }, { merge: true })
    } catch (e) {
      error.value = e.message
    }
  }

  const watchMessages = (chatId: string) => {
    loading.value = true
    error.value = null

    const messagesRef = collection($firestore, 'chats', chatId, 'messages')
    const q = query(messagesRef, orderBy('createdAt', 'asc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      messages.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }))
      loading.value = false
    }, (err) => {
      error.value = err.message
      loading.value = false
    })

    return unsubscribe
  }

  return {
    messages,
    loading,
    error,
    createChat,
    sendMessage,
    watchMessages
  }
} 