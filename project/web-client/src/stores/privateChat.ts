import {ref} from 'vue'
import {defineStore, storeToRefs} from 'pinia'
import type {User} from "@/data/user";
import axios, {isAxiosError} from "axios";
import {useRouter} from "vue-router";
import {usePublicChatStore} from "@/stores/publicChat";
import {useFamilyTreeStore} from "@/stores/familyTree";
import {useAuthenticationStore} from "@/stores/authentication";
import router from "@/router";
import type {PrivateChat} from "@/data/private-chat";
import type {Message} from "@/data/message";

export const usePrivateChatStore = defineStore('privateChat', () => {
  const authStore = useAuthenticationStore();
  const {loggedUser} = storeToRefs(authStore)
  const privateChats = ref<PrivateChat[]>([]);
  const fetchedPrivateChats = ref<Map<string, Message[]>>(new Map());

  const getPrivateChats = async (username?: string) => {
    if (!authStore.isAuthenticated || !authStore.loggedUser) return
    try {
      const response =
          await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/private?userId=${authStore.loggedUser._id}${username ? '&username=' + username : ''}`, {withCredentials: true})
      privateChats.value = response.data.privateChats
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.isAuthenticated = false
        authStore.loggedUser = undefined
        await router.push({name: 'login'})
      }
      console.log(e)
    }
  }

  const getPrivateChatMessages = async (chatId: string) => {
    if (fetchedPrivateChats.value.get(chatId)) return
    if (!authStore.isAuthenticated || !authStore.loggedUser) return
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/private/${chatId}`, {withCredentials: true})
      fetchedPrivateChats.value.set(chatId, response.data.privateChat.messages)
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.isAuthenticated = false
        authStore.loggedUser = undefined
        await router.push({name: 'login'})
      }
      console.log(e)
    }
  }

  const sendMessage = async (chatId: string, message: string) => {
    if (!loggedUser.value) return
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/private/${chatId}/messages`,
          {text: message, user: loggedUser.value._id},
          { withCredentials: true })
      fetchedPrivateChats.value.set(chatId, [...fetchedPrivateChats.value.get(chatId) || [], response.data.message])
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.isAuthenticated = false
        authStore.loggedUser = undefined
        await router.push({name: 'login'})
      }
      console.log(e)
    }
  }

  return { privateChats, fetchedPrivateChats, getPrivateChats, getPrivateChatMessages, sendMessage }
})
