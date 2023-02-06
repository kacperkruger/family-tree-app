import { defineStore, storeToRefs } from "pinia";
import type { User } from "@/data/user";
import { ref } from "vue";
import axios, { isAxiosError } from "axios";
import router from "@/router";
import { useAuthenticationStore } from "@/stores/authentication";
import { useLoadingStore } from "@/stores/loading";

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const authStore = useAuthenticationStore();

  const loadingStore = useLoadingStore();
  const { isLoading } = storeToRefs(loadingStore);

  const getAllUsers = async () => {
    if (users.value.length !== 0) return;
    isLoading.value = true;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST_URL}/api/v1/users`,
        { withCredentials: true }
      );
      isLoading.value = false;
      users.value = response.data.users;
    } catch (e) {
      isLoading.value = false;
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const getUser = async (userId: string) => {
    if (users.value.find((user) => user?._id === userId)) return;
    isLoading.value = true;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST_URL}/api/v1/users/${userId}`,
        { withCredentials: true }
      );
      isLoading.value = false;
      users.value.push(response.data.user);
    } catch (e) {
      isLoading.value = false;
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const getUserByUsername = async (username: string) => {
    if (users.value.find((user) => user?.username === username)) return;
    isLoading.value = true;
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/users/usernames/${username}`,
        { withCredentials: true }
      );
      isLoading.value = false;
      users.value.push(response.data.user);
    } catch (e) {
      isLoading.value = false;
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const getUsersByPersonsDetails = async (
    surnames: string[],
    dateOfBirth?: string
  ) => {
    if (!surnames.length) {
      await getAllUsers();
      return;
    }
    isLoading.value = true;
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_HOST_URL
        }/api/v1/family-trees/users?${surnames
          .map((surname) => `surname=${surname}`)
          .join("&")}${dateOfBirth ? `&dateOfBirth=${dateOfBirth}` : ""}`,
        { withCredentials: true }
      );
      isLoading.value = false;
      users.value = response.data.users;
    } catch (e) {
      isLoading.value = false;
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      if (isAxiosError(e) && e.response?.status === 404) {
        users.value = [];
      }
      console.log(e);
    }
  };

  return {
    users,
    getAllUsers,
    getUser,
    getUserByUsername,
    getUsersByPersonsSurnames: getUsersByPersonsDetails,
  };
});
