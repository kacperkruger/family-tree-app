import { defineStore } from "pinia";
import { type Ref, ref, toRaw } from "vue";
import type {
  Person,
  PersonEditRequest,
  PersonRequest,
  PersonResponse,
} from "@/data/person";
import axios from "axios";
import parsePersonResponse from "@/utils/parsePersonResponse";
import handleRequestError from "@/utils/handleRequestError";
import parseErrorMessage from "@/utils/parseErrorMessage";

export const useFamilyTreeStore = defineStore("familyTree", () => {
  const familyTree = ref([]) as Ref<Person[]>;
  const isLoading = ref(false);
  const addErrorMessage = ref("");
  const editErrorMessage = ref("");
  const detailsErrorMessage = ref("");
  const url = `${import.meta.env.API_HOST_URL}/api/v1/family-trees`;

  const getFamilyTree = async () => {
    if (familyTree.value.length !== 0) return;
    isLoading.value = true;
    try {
      const response = await axios.get(url, { withCredentials: true });
      isLoading.value = false;
      familyTree.value = response.data.familyTree.map(
        (personResponse: PersonResponse) => parsePersonResponse(personResponse)
      );
    } catch (e) {
      isLoading.value = false;
      await handleRequestError(e);
    }
  };

  const getUsersFamilyTree = async (userId: string): Promise<Person[]> => {
    isLoading.value = true;
    try {
      const response = await axios.get(`${url}/users/${userId}`, {
        withCredentials: true,
      });
      isLoading.value = false;
      return response.data.familyTree.map((personResponse: PersonResponse) =>
        parsePersonResponse(personResponse)
      );
    } catch (e) {
      isLoading.value = false;
      await handleRequestError(e);
      return [];
    }
  };

  const addPerson = async (person: PersonRequest) => {
    isLoading.value = true;
    try {
      const response = await axios.post(`${url}/persons`, person, {
        withCredentials: true,
      });
      isLoading.value = false;
      pushPerson(response.data.person);
      detailsErrorMessage.value = "";
    } catch (e) {
      isLoading.value = false;
      await handleRequestError(e);
      addErrorMessage.value = parseErrorMessage(e);
    }
  };

  const deletePerson = async (id: string | number | undefined) => {
    isLoading.value = true;
    try {
      await axios.delete(`${url}/persons/${id}`, { withCredentials: true });
      isLoading.value = false;
      removePerson(id);
      detailsErrorMessage.value = "";
    } catch (e) {
      isLoading.value = false;
      await handleRequestError(e);
      detailsErrorMessage.value = parseErrorMessage(e);
    }
  };

  const editPerson = async (
    id: string | number | undefined,
    personEditRequest: PersonEditRequest
  ) => {
    isLoading.value = true;
    try {
      const response = await axios.put(
        `${url}/persons/${id}`,
        personEditRequest,
        {
          withCredentials: true,
        }
      );
      response.data.persons.forEach((person: PersonResponse) => {
        replacePerson(person);
      });
      isLoading.value = false;
      editErrorMessage.value = "";
    } catch (e) {
      isLoading.value = false;
      await handleRequestError(e);
      editErrorMessage.value = parseErrorMessage(e);
    }
  };

  const copyPerson = async (
    id: string | number | undefined,
    nGenerations: number
  ) => {
    isLoading.value = true;
    try {
      const response = await axios.post(
        `${url}/persons/${id}?n=${nGenerations}`,
        {},
        { withCredentials: true }
      );
      response.data.persons.forEach((person: PersonResponse) =>
        pushPerson(person)
      );
      isLoading.value = false;
      detailsErrorMessage.value = "";
    } catch (e) {
      isLoading.value = false;
      await handleRequestError(e);
      detailsErrorMessage.value = parseErrorMessage(e);
    }
  };

  const clear = () => {
    familyTree.value = [];
    isLoading.value = false;
  };

  const pushPerson = (person: PersonResponse) => {
    familyTree.value.push(parsePersonResponse(person));
  };

  const removePerson = (personId: string | number | undefined) => {
    familyTree.value = familyTree.value
      .filter((person) => person.id !== personId)
      .map((person) => ({
        ...person,
        fid: person.fid === personId ? undefined : person.fid,
        mid: person.mid === personId ? undefined : person.mid,
        pids: person.pids.filter((pid) => pid !== personId),
        parents: person.parents.filter((pid) => pid !== personId),
        optionalParents: person.optionalParents.filter(
          (pid) => pid !== personId
        ),
      }));
  };

  const replacePerson = (personResponse: PersonResponse) => {
    familyTree.value = toRaw(familyTree.value).map((person: Person) =>
      person.id === personResponse.id
        ? parsePersonResponse(personResponse)
        : person
    );
  };

  return {
    familyTree,
    isLoading,
    addErrorMessage,
    editErrorMessage,
    detailsErrorMessage,
    getFamilyTree,
    addPerson,
    deletePerson,
    editPerson,
    getUsersFamilyTree,
    copyPerson,
    clear,
  };
});
