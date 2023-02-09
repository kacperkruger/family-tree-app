import { ref } from "vue";
import { defineStore } from "pinia";
import type { User, UserRequest } from "@/data/user";
import axios from "axios";
import { useRouter } from "vue-router";
import { usePublicChatStore } from "@/stores/publicChat";
import { useFamilyTreeStore } from "@/stores/familyTree";
import { usePrivateChatStore } from "@/stores/privateChat";
import { useUsersStore } from "@/stores/users";
import { useSocketStore } from "@/stores/socket";
import parseErrorMessage from "@/utils/parseErrorMessage";

export const useAuthenticationStore = defineStore("authentication", () => {
  const isAuthenticated = ref(false);
  const loggedUser = ref<User | undefined>(undefined);
  const loginErrorMessage = ref("");
  const registerErrorMessage = ref("");
  const isLoading = ref(false);
  const url = `${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication`;

  const router = useRouter();
  const publicChatStore = usePublicChatStore();
  const treeStore = useFamilyTreeStore();
  const privateChatStore = usePrivateChatStore();
  const usersStore = useUsersStore();
  const socketStore = useSocketStore();

  const login = async (username: string, password: string) => {
    if (loggedUser.value !== undefined) return;
    isLoading.value = true;
    try {
      const response = await axios.post(
        `${url}/login`,
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      );
      isLoading.value = false;
      loggedUser.value = response.data.user;
      isAuthenticated.value = true;
      loginErrorMessage.value = "";
      await router.push({ name: "home" });
    } catch (e) {
      isLoading.value = false;
      loginErrorMessage.value = parseErrorMessage(e);
    }
  };

  const logout = async () => {
    isLoading.value = true;
    try {
      await axios.post(`${url}/logout`, {}, { withCredentials: true });
      clear();
      publicChatStore.clear();
      treeStore.clear();
      privateChatStore.clear();
      usersStore.clear();
      socketStore.clear();
    } catch (e) {
      isLoading.value = false;
      const errorMessage = parseErrorMessage(e);
      alert(errorMessage);
    }
  };

  const getLoggedUser = async (successCb?: Function, errorCb?: Function) => {
    if (loggedUser.value) return;
    isLoading.value = true;
    try {
      const response = await axios.get(`${url}/me`, { withCredentials: true });
      isLoading.value = false;
      loggedUser.value = response.data.user;
      isAuthenticated.value = true;

      if (successCb) successCb();
    } catch (_e) {
      clear();
      if (errorCb) errorCb();
    }
  };

  const register = async (userRequest: UserRequest) => {
    isLoading.value = true;
    try {
      await axios.post(`${url}/register`, userRequest);
      await router.push({ name: "login" });
      isLoading.value = false;
    } catch (e: unknown) {
      isLoading.value = false;
      registerErrorMessage.value = parseErrorMessage(e);
    }
  };

  const clear = () => {
    isLoading.value = false;
    isAuthenticated.value = false;
    loggedUser.value = undefined;
    loginErrorMessage.value = "";
    registerErrorMessage.value = "";
  };

  return {
    isAuthenticated,
    isLoading,
    loggedUser,
    loginErrorMessage,
    registerErrorMessage,
    login,
    getLoggedUser,
    logout,
    register,
  };
});
