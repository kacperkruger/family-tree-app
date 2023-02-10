import { defineStore } from "pinia";
import type { User } from "@/data/user";
import { ref } from "vue";
import axios from "axios";
import handleRequestError from "@/utils/handleRequestError";

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const isLoading = ref(false);
  const url = `${import.meta.env.API_HOST_URL}/api/v1/users`;

  const getAllUsers = async () => {
    if (users.value.length !== 0) return;
    isLoading.value = true;
    try {
      const response = await axios.get(url, { withCredentials: true });
      isLoading.value = false;
      users.value = response.data.users;
    } catch (e) {
      isLoading.value = false;
      await handleRequestError(e);
    }
  };

  const getUser = async (userId: string) => {
    if (users.value.find((user) => user?._id === userId)) return;
    isLoading.value = true;
    try {
      const response = await axios.get(`${url}/${userId}`, {
        withCredentials: true,
      });
      isLoading.value = false;
      users.value.push(response.data.user);
    } catch (e) {
      isLoading.value = false;
      await handleRequestError(e);
    }
  };

  const getUserByUsername = async (username: string) => {
    if (users.value.find((user) => user?.username === username)) return;
    isLoading.value = true;
    try {
      const response = await axios.get(`${url}/usernames/${username}`, {
        withCredentials: true,
      });
      isLoading.value = false;
      users.value.push(response.data.user);
    } catch (e) {
      isLoading.value = false;
      await handleRequestError(e);
    }
  };

  const getUsersByPersonsDetails = async (
    surnames: string[],
    dateOfBirth?: string
  ) => {
    isLoading.value = true;
    try {
      const response = await axios.get(
        buildGetUsersByPersonsDetailsUrl(surnames, dateOfBirth),
        { withCredentials: true }
      );
      isLoading.value = false;
      users.value = response.data.users;
    } catch (e) {
      isLoading.value = false;
      await handleRequestError(e);
    }
  };

  const buildGetUsersByPersonsDetailsUrl = (
    surnames: string[],
    dateOfBirth?: string
  ): string => {
    return (
      `${import.meta.env.VITE_API_HOST_URL}` +
      "/api/v1/family-trees/users?" +
      `${surnames.map((surname) => `surname=${surname}`).join("&")}${
        dateOfBirth ? `&dateOfBirth=${dateOfBirth}` : ""
      }`
    );
  };

  const clear = () => {
    users.value = [];
    isLoading.value = false;
  };

  return {
    users,
    isLoading,
    getAllUsers,
    getUser,
    getUserByUsername,
    getUsersByPersonsSurnames: getUsersByPersonsDetails,
    clear,
  };
});
