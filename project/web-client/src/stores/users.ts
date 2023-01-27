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
        if (users.value.length !== 0) return
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/users`, {withCredentials: true})
            console.log(response.data)
            users.value = response.data.users;
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 401) {
                authStore.logout()
                await router.push({name: 'login'})
            }
            console.log(e)
        }
    }

    return { users, getAllUsers }
})