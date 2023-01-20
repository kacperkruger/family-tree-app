import {defineStore} from "pinia";
import {ref} from "vue";
import type {Person, PersonRequest} from "@/data/person";
import axios, {isAxiosError} from "axios";
import {useAuthenticationStore} from "@/stores/authentication";
import {useRouter} from "vue-router";

export const useFamilyTreeStore = defineStore('familyTree', () => {
    const authStore = useAuthenticationStore()
    const router = useRouter();
    const familyTree = ref<Person[]>([])

    const getFamilyTree = async () => {
        try {
            const response = await axios.get<{familyTree: PersonRequest[] }>(`${import.meta.env.VITE_API_HOST_URL}/api/v1/family-trees/`, { withCredentials: true })
            familyTree.value = response.data.familyTree.map(person => ({
                id: person.id,
                name: person.name,
                surname: person.surname,
                dateOfBirth: person.dateOfBirth,
                gender: person.gender.toLowerCase(),
                pids: person.partners,
                fid: person.parents[0],
                mid: person.parents[1]
            }))
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 401) {
                authStore.isAuthenticated = false
                authStore.loggedUser = undefined
                await router.push({name: 'login'})
            }
            console.log(e)
        }
    }

    return { familyTree, getFamilyTree }
})