import {ref} from 'vue'
import {defineStore, storeToRefs} from 'pinia'
import type {User} from "@/data/user";
import axios, {isAxiosError} from "axios";
import {useRouter} from "vue-router";
import {usePublicChatStore} from "@/stores/publicChat";
import {useFamilyTreeStore} from "@/stores/familyTree";
import {usePrivateChatStore} from "@/stores/privateChat";
import {useUsersStore} from "@/stores/users";

export const useAuthenticationStore = defineStore('authentication', () => {
    const isAuthenticated = ref(false)
    const loggedUser = ref<User | undefined>(undefined)
    const errorMessage = ref('');

    const router = useRouter()

    const publicChatStore = usePublicChatStore()
    const {messages} = storeToRefs(publicChatStore)

    const treeStore = useFamilyTreeStore();
    const {familyTree} = storeToRefs(treeStore)

    const privateChatStore = usePrivateChatStore()
    const {fetchedPrivateChats, privateChats} = storeToRefs(privateChatStore)

    const usersStore = useUsersStore()
    const {users} = storeToRefs(usersStore)

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
            if (isAxiosError((e))) errorMessage.value = e.response?.data.error || "Invalid username or password"
            else errorMessage.value = "Invalid username or password"
        }
    }

    const logout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication/logout`, {}, {withCredentials: true})
            isAuthenticated.value = false
            loggedUser.value = undefined

            messages.value = []
            familyTree.value = []
            privateChats.value = []
            fetchedPrivateChats.value = new Map()
            users.value = []
        } catch (e) {
            alert('Internal error')
        }
    }

    const getLoggedUser = async (successCb: Function, errorCb: Function) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication/me`, {withCredentials: true})
            loggedUser.value = response.data.user;
            isAuthenticated.value = true
            successCb()
        } catch (_e) {
            isAuthenticated.value = false
            loggedUser.value = undefined
            errorCb()
        }
    }

    return {isAuthenticated, loggedUser, login, getLoggedUser, logout, errorMessage}
})
