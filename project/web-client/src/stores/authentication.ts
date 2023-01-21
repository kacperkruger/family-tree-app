import {ref} from 'vue'
import {defineStore} from 'pinia'
import type {User} from "@/data/user";
import axios from "axios";
import {useRouter} from "vue-router";
import {usePublicChatStore} from "@/stores/publicChat";
import {useFamilyTreeStore} from "@/stores/familyTree";

export const useAuthenticationStore = defineStore('authentication', () => {
  const isAuthenticated = ref(false)
  const loggedUser = ref<User | undefined>(undefined)
  const errorMessage = ref('');

  const router = useRouter()
  const publicChatStore = usePublicChatStore()
  const treeStore = useFamilyTreeStore();

  const login = async (username: string, password: string) => {
    if (loggedUser.value !== undefined) return
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication/login`, {
        username: username,
        password: password
      }, {withCredentials: true})

      loggedUser.value = response.data.user;
      isAuthenticated.value = true
      errorMessage.value = ''

      await router.push({name: 'home'})
    } catch (e) {
      console.log(e)
      errorMessage.value = "Invalid username or password"
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication/logout`, {}, {withCredentials: true})
      isAuthenticated.value = false
      loggedUser.value = undefined

      publicChatStore.messages = []
      treeStore.familyTree = []

      await router.push({name: 'home'})
    } catch (e) {
      alert('Internal error')
    }
  }

  const getLoggedUser = async (errorCb: Function) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication/me`, { withCredentials: true })
      loggedUser.value = response.data.user;
      isAuthenticated.value = true
    } catch (_e) {
      isAuthenticated.value = false
      loggedUser.value = undefined
      errorCb()
    }
  }

  return { isAuthenticated, loggedUser, login, getLoggedUser, logout, errorMessage }
})
