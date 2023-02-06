import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import type { User } from "@/data/user";
import axios, { isAxiosError } from "axios";
import { useRouter } from "vue-router";
import { usePublicChatStore } from "@/stores/publicChat";
import { useFamilyTreeStore } from "@/stores/familyTree";
import { usePrivateChatStore } from "@/stores/privateChat";
import { useUsersStore } from "@/stores/users";
import { useLoadingStore } from "@/stores/loading";

export const useAuthenticationStore = defineStore("authentication", () => {
  const isAuthenticated = ref(false);
  const loggedUser = ref<User | undefined>(undefined);
  const errorMessage = ref("");

  const router = useRouter();

  const publicChatStore = usePublicChatStore();
  const { messages } = storeToRefs(publicChatStore);

  const treeStore = useFamilyTreeStore();
  const { familyTree } = storeToRefs(treeStore);

  const privateChatStore = usePrivateChatStore();
  const { fetchedPrivateChats, privateChats } = storeToRefs(privateChatStore);

  const usersStore = useUsersStore();
  const { users } = storeToRefs(usersStore);

  const loadingStore = useLoadingStore();
  const { isLoading } = storeToRefs(loadingStore);

  const login = async (username: string, password: string) => {
    if (loggedUser.value !== undefined) return;
    isLoading.value = true;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication/login`,
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      );
      isLoading.value = false;
      loggedUser.value = response.data.user;
      isAuthenticated.value = true;
      errorMessage.value = "";

      await router.push({ name: "home" });
    } catch (e) {
      isLoading.value = false;
      console.log(e);
      if (isAxiosError(e))
        errorMessage.value =
          e.response?.data.error || "Invalid username or password";
      else errorMessage.value = "Invalid username or password";
    }
  };

  const logout = async () => {
    isLoading.value = true;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication/logout`,
        {},
        { withCredentials: true }
      );
      isLoading.value = false;

      isAuthenticated.value = false;
      loggedUser.value = undefined;

      messages.value = [];
      familyTree.value = [];
      privateChats.value = [];
      fetchedPrivateChats.value = new Map();
      users.value = [];
    } catch (e) {
      isLoading.value = false;
      alert("Internal error");
    }
  };

  const getLoggedUser = async (successCb: Function, errorCb: Function) => {
    isLoading.value = true;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication/me`,
        { withCredentials: true }
      );
      isLoading.value = false;
      loggedUser.value = response.data.user;
      isAuthenticated.value = true;
      successCb();
    } catch (_e) {
      isLoading.value = false;
      isAuthenticated.value = false;
      loggedUser.value = undefined;
      errorCb();
    }
  };

  return {
    isAuthenticated,
    loggedUser,
    login,
    getLoggedUser,
    logout,
    errorMessage,
  };
});
