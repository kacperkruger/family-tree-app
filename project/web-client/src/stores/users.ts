import {defineStore} from "pinia";
import type {User} from "@/data/user";
import {ref} from "vue";
import axios from "axios";
import {isAxiosError} from "axios";
import router from "@/router";
import {useAuthenticationStore} from "@/stores/authentication";

export const useUsersStore = defineStore('users', () => {
    const users = ref<User[]>([])
    const authStore = useAuthenticationStore();

    const getAllUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/users`, {withCredentials: true})
            users.value = response.data.users;
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 401) {
                authStore.logout()
                await router.push({name: 'login'})
            }
            console.log(e)
        }
    }

    const getUser = async (userId: string) => {
        if (users.value.find(user => user?._id === userId)) return
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/users/${userId}`, {withCredentials: true})
            users.value.push(response.data.user)
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 401) {
                authStore.logout()
                await router.push({name: 'login'})
            }
            console.log(e)
        }
    }

    const getUserByUsername = async (username: string) => {
        if (users.value.find(user => user?.username === username)) return
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/users/usernames/${username}`, {withCredentials: true})
            users.value.push(response.data.user)
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 401) {
                authStore.logout()
                await router.push({name: 'login'})
            }
            console.log(e)
        }
    }

    return { users, getAllUsers, getUser, getUserByUsername }
})