import {ref} from 'vue'
import {defineStore} from 'pinia'
import axios, {isAxiosError} from "axios";
import {useAuthenticationStore} from "@/stores/authentication";
import router from "@/router";
import type {PrivateChat} from "@/data/private-chat";
import type {Message} from "@/data/message";

export const usePrivateChatStore = defineStore('privateChat', () => {
    const authStore = useAuthenticationStore();
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
                authStore.logout()
                await router.push({name: 'login'})
            }
            console.log(e)
        }
    }

    const getPrivateChatMessages = async (chatId: string) => {
        if (!authStore.isAuthenticated || !authStore.loggedUser) return
        if (fetchedPrivateChats.value.get(chatId)) return
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/private/${chatId}`, {withCredentials: true})
            fetchedPrivateChats.value.set(chatId, response.data.privateChat.messages)
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 401) {
                authStore.logout()
                await router.push({name: 'login'})
            }
            console.log(e)
        }
    }

    const sendMessage = async (chatId: string, message: string) => {
        if (!authStore.isAuthenticated || !authStore.loggedUser) return
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/private/${chatId}/messages`,
                {text: message, user: authStore.loggedUser._id},
                {withCredentials: true})
            fetchedPrivateChats.value.set(chatId, [...fetchedPrivateChats.value.get(chatId) || [], response.data.message])
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 401) {
                authStore.logout()
                await router.push({name: 'login'})
            }
            console.log(e)
        }
    }

    const create = async (usersToAdd: string[]) => {
        if (!authStore.isAuthenticated || !authStore.loggedUser) return
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/private/`,
                {users: usersToAdd},
                {withCredentials: true})
            privateChats.value.push(response.data.privateChat)
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 401) {
                authStore.logout()
                await router.push({name: 'login'})
            }
            console.log(e)
        }
    }

    return {privateChats, fetchedPrivateChats, getPrivateChats, getPrivateChatMessages, sendMessage, create}
})
