import {defineStore} from "pinia";
import {ref} from "vue";
import type {Person, PersonRequest, PersonResponse} from "@/data/person";
import axios, {isAxiosError} from "axios";
import {useAuthenticationStore} from "@/stores/authentication";
import {useRouter} from "vue-router";

export const useFamilyTreeStore = defineStore('familyTree', () => {
    const authStore = useAuthenticationStore()
    const router = useRouter();
    const familyTree = ref<Person[]>([])

    const parsePersonResponse = (personResponse: PersonResponse): Person => {
        return {
            id: personResponse.id,
            name: personResponse.name,
            surname: personResponse.surname,
            dateOfBirth: personResponse.dateOfBirth,
            gender: personResponse.gender.toLowerCase(),
            pids: personResponse.partners,
            fid: personResponse.parents[0],
            mid: personResponse.parents[1]
        }
    }

    const getFamilyTree = async () => {
        if (familyTree.value.length !== 0) return
        try {
            const response = await axios.get<{familyTree: PersonResponse[] }>(`${import.meta.env.VITE_API_HOST_URL}/api/v1/family-trees/`, { withCredentials: true })
            familyTree.value = response.data.familyTree.map(personResponse => parsePersonResponse(personResponse))
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 401) {
                authStore.isAuthenticated = false
                authStore.loggedUser = undefined
                await router.push({name: 'login'})
            }
            console.log(e)
        }
    }

    const addPerson = async (person: PersonRequest) => {
        try {
            const response = await axios.post<{person: PersonResponse}>(`${import.meta.env.VITE_API_HOST_URL}/api/v1/family-trees/persons/`, person, { withCredentials: true })
            familyTree.value = [...familyTree.value, parsePersonResponse(response.data.person)]
        } catch (e) {
            console.log(e)
        }
    }

    return { familyTree, getFamilyTree, addPerson }
})