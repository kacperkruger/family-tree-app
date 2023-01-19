import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthenticationStore = defineStore('authentication', () => {
  const isAuthenticated = ref(false)
  const reverseState = () => {
    isAuthenticated.value = !isAuthenticated.value
  }

  return { isAuthenticated, reverseState }
})
