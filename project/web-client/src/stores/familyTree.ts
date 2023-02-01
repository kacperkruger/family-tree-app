import { defineStore } from "pinia";
import { ref } from "vue";
import type { Person, PersonRequest, PersonResponse } from "@/data/person";
import axios, { isAxiosError } from "axios";
import { useAuthenticationStore } from "@/stores/authentication";
import { useRouter } from "vue-router";

export const useFamilyTreeStore = defineStore("familyTree", () => {
  const authStore = useAuthenticationStore();
  const router = useRouter();
  const familyTree = ref<Person[]>([]);

  const parsePersonResponse = (personResponse: PersonResponse): Person => {
    return {
      id: personResponse.id,
      name: personResponse.name,
      surname: personResponse.surname,
      dateOfBirth: personResponse.dateOfBirth,
      gender: personResponse.gender.toLowerCase(),
      pids: personResponse.partners,
      fid: personResponse.parents[0],
      mid: personResponse.parents[1],
    };
  };

  const getFamilyTree = async () => {
    if (familyTree.value.length !== 0) return;
    try {
      const response = await axios.get<{ familyTree: PersonResponse[] }>(
        `${import.meta.env.VITE_API_HOST_URL}/api/v1/family-trees/`,
        { withCredentials: true }
      );
      familyTree.value = response.data.familyTree.map((personResponse) =>
        parsePersonResponse(personResponse)
      );
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const getUsersFamilyTree = async (userId: string): Promise<Person[]> => {
    try {
      const response = await axios.get<{ familyTree: PersonResponse[] }>(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/family-trees/users/${userId}`,
        { withCredentials: true }
      );
      return response.data.familyTree.map((personResponse) =>
        parsePersonResponse(personResponse)
      );
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
        return [];
      } else throw e;
    }
  };

  const addPerson = async (person: PersonRequest) => {
    try {
      const response = await axios.post<{ person: PersonResponse }>(
        `${import.meta.env.VITE_API_HOST_URL}/api/v1/family-trees/persons/`,
        person,
        { withCredentials: true }
      );
      familyTree.value = [
        ...familyTree.value,
        parsePersonResponse(response.data.person),
      ];
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const deletePerson = async (id: string | number | undefined) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/family-trees/persons/${id}`,
        { withCredentials: true }
      );
      familyTree.value = familyTree.value
        .filter((person) => person.id !== id)
        .map((person) => ({
          ...person,
          fid: person.fid === id ? undefined : person.fid,
          mid: person.mid === id ? undefined : person.mid,
          pids: person.pids.filter((pid) => pid !== id),
        }));
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const editPerson = async (
    id: string | number | undefined,
    personRequest: PersonRequest
  ) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/family-trees/persons/${id}`,
        personRequest,
        { withCredentials: true }
      );
      familyTree.value = familyTree.value.map((person) =>
        person.id === id ? parsePersonResponse(response.data.person) : person
      );
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const copyPerson = async (
    id: string | number | undefined,
    nGenerations: number
  ) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/family-trees/persons/${id}?n=${nGenerations}`,
        {},
        { withCredentials: true }
      );
      familyTree.value = [
        ...familyTree.value,
        ...response.data.persons.map((person: PersonResponse) =>
          parsePersonResponse(person)
        ),
      ];
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  return {
    familyTree,
    getFamilyTree,
    addPerson,
    deletePerson,
    editPerson,
    getUsersFamilyTree,
    copyPerson,
  };
});
