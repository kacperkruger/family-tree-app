import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import type { Person, PersonRequest, PersonResponse } from "@/data/person";
import axios, { isAxiosError } from "axios";
import { useAuthenticationStore } from "@/stores/authentication";
import { useRouter } from "vue-router";
import { useLoadingStore } from "@/stores/loading";

export const useFamilyTreeStore = defineStore("familyTree", () => {
  const authStore = useAuthenticationStore();
  const router = useRouter();
  const familyTree = ref<Person[]>([]);

  const loadingStore = useLoadingStore();
  const { isLoading } = storeToRefs(loadingStore);

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
      parents: personResponse.parents,
    };
  };

  const getFamilyTree = async () => {
    if (familyTree.value.length !== 0) return;
    isLoading.value = true;
    try {
      const response = await axios.get<{ familyTree: PersonResponse[] }>(
        `${import.meta.env.VITE_API_HOST_URL}/api/v1/family-trees/`,
        { withCredentials: true }
      );
      isLoading.value = false;
      familyTree.value = response.data.familyTree.map((personResponse) =>
        parsePersonResponse(personResponse)
      );
    } catch (e) {
      isLoading.value = false;
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const getUsersFamilyTree = async (userId: string): Promise<Person[]> => {
    isLoading.value = true;
    try {
      const response = await axios.get<{ familyTree: PersonResponse[] }>(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/family-trees/users/${userId}`,
        { withCredentials: true }
      );
      isLoading.value = false;
      return response.data.familyTree.map((personResponse) =>
        parsePersonResponse(personResponse)
      );
    } catch (e) {
      isLoading.value = false;
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
        return [];
      } else throw e;
    }
  };

  const addPerson = async (person: PersonRequest) => {
    isLoading.value = true;
    try {
      const response = await axios.post<{ person: PersonResponse }>(
        `${import.meta.env.VITE_API_HOST_URL}/api/v1/family-trees/persons/`,
        person,
        { withCredentials: true }
      );
      isLoading.value = false;
      familyTree.value = [
        ...familyTree.value,
        parsePersonResponse(response.data.person),
      ];
    } catch (e) {
      isLoading.value = false;
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const deletePerson = async (id: string | number | undefined) => {
    isLoading.value = true;
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/family-trees/persons/${id}`,
        { withCredentials: true }
      );
      isLoading.value = false;
      familyTree.value = familyTree.value
        .filter((person) => person.id !== id)
        .map((person) => ({
          ...person,
          fid: person.fid === id ? undefined : person.fid,
          mid: person.mid === id ? undefined : person.mid,
          pids: person.pids.filter((pid) => pid !== id),
        }));
    } catch (e) {
      isLoading.value = false;
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
    isLoading.value = true;
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/family-trees/persons/${id}`,
        personRequest,
        { withCredentials: true }
      );
      isLoading.value = false;
      familyTree.value = familyTree.value.map((person) =>
        person.id === id ? parsePersonResponse(response.data.person) : person
      );
    } catch (e) {
      isLoading.value = false;
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
    isLoading.value = true;
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/family-trees/persons/${id}?n=${nGenerations}`,
        {},
        { withCredentials: true }
      );
      isLoading.value = false;
      familyTree.value = [
        ...familyTree.value,
        ...response.data.persons.map((person: PersonResponse) =>
          parsePersonResponse(person)
        ),
      ];
    } catch (e) {
      isLoading.value = false;
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const addParentRelationship = async (parentId: string, childId: string) => {
    isLoading.value = true;
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/family-trees/relationships/parents/${parentId}/children/${childId}`,
        {},
        { withCredentials: true }
      );
      isLoading.value = false;
      familyTree.value = familyTree.value.map((person) =>
        person.id === childId
          ? parsePersonResponse(response.data.person)
          : person
      );
    } catch (e) {
      isLoading.value = false;
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const deleteParentRelationship = async (
    parentId: string,
    childId: string
  ) => {
    try {
      isLoading.value = true;
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/family-trees/relationships/parents/${parentId}/children/${childId}`,
        { withCredentials: true }
      );
      isLoading.value = false;
      familyTree.value = familyTree.value.map((person) =>
        person.id === childId
          ? parsePersonResponse(response.data.person)
          : person
      );
    } catch (e) {
      isLoading.value = false;
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const addPartnerRelationship = async (
    partner1Id: string,
    partner2Id: string
  ) => {
    isLoading.value = true;
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/family-trees/relationships/partners/${partner1Id}/partners/${partner2Id}`,
        {},
        { withCredentials: true }
      );
      isLoading.value = false;
      familyTree.value = [
        ...familyTree.value.filter(
          (person) => person.id !== partner1Id && person.id !== partner2Id
        ),
        ...response.data.persons.map((person: PersonResponse) =>
          parsePersonResponse(person)
        ),
      ];
    } catch (e) {
      isLoading.value = false;
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const deletePartnerRelationship = async (
    partner1Id: string,
    partner2Id: string
  ) => {
    isLoading.value = true;
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/family-trees/relationships/partners/${partner1Id}/partners/${partner2Id}`,
        { withCredentials: true }
      );
      isLoading.value = false;
      familyTree.value = [
        ...familyTree.value.filter(
          (person) => person.id !== partner1Id && person.id !== partner2Id
        ),
        ...response.data.persons.map((person: PersonResponse) =>
          parsePersonResponse(person)
        ),
      ];
    } catch (e) {
      isLoading.value = false;
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
    addParentRelationship,
    deleteParentRelationship,
    addPartnerRelationship,
    deletePartnerRelationship,
  };
});
