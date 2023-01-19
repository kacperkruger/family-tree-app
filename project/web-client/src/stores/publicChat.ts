import {ref} from 'vue'
import {defineStore} from 'pinia'
import type {Message} from "@/data/message";
import axios, {isAxiosError} from "axios";
import {useAuthenticationStore} from "@/stores/authentication";
import router from "@/router";

export const usePublicChatStore = defineStore('publicChat', () => {
    const messages = ref<Message[]>([])
    const authStore = useAuthenticationStore();

    const sendMessage = async (message: string): Promise<void> => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/public/messages`,
                {text: message},
                { withCredentials: true })
            messages.value.push(response.data.message)
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 401) {
                authStore.isAuthenticated = false
                authStore.loggedUser = undefined
                await router.push({name: 'login'})
            }
            console.log(e)
        }
    }

    const getMessages = async () => {
        if (messages.value.length) return
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/public`, { withCredentials: true })
            messages.value = response.data.publicChat
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 401) {
                authStore.isAuthenticated = false
                authStore.loggedUser = undefined
                await router.push({name: 'login'})
            }
            console.log(e)
        }
    }

    return { messages, sendMessage, getMessages }
})
