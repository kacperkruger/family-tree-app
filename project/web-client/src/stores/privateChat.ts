import {ref} from 'vue'
import {defineStore} from 'pinia'
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
  const privateChats = ref<PrivateChat[]>([]);
  const fetchedPrivateChats = ref<Map<string, Message[]>>(new Map());

  const getAllPrivateChats = async () => {
    if (!authStore.isAuthenticated || !authStore.loggedUser) return
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/private?userId=${authStore.loggedUser._id}`, {withCredentials: true})
      console.log(response)
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

  return { privateChats, fetchedPrivateChats, getAllPrivateChats, getPrivateChatMessages }
})
