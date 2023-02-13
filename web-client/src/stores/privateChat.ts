import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { useAuthenticationStore } from "@/stores/authentication";
import type { PrivateChat } from "@/data/private-chat";
import type { Message } from "@/data/message";
import { useSocketStore } from "@/stores/socket";
import handleRequestError from "@/utils/handleRequestError";

export const usePrivateChatStore = defineStore("privateChat", () => {
  const authStore = useAuthenticationStore();
  const socketStore = useSocketStore();
  const url = `${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/private`;

  const privateChats = ref<PrivateChat[]>([]);
  const isLoadingMessages = ref(false);
  const isLoadingRooms = ref(false);
  const fetchedPrivateChats = ref<Map<string, Message[]>>(new Map());

  const getPrivateChats = async (username?: string) => {
    isLoadingRooms.value = true;
    try {
      const response = await axios.get(
        `${url}?userId=${authStore.loggedUser?._id}${
          username ? "&username=" + username : ""
        }`,
        { withCredentials: true }
      );
      privateChats.value = response.data.privateChats;
      isLoadingRooms.value = false;
    } catch (e) {
      isLoadingRooms.value = false;
      await handleRequestError(e);
    }
  };

  const getPrivateChatMessages = async (chatId: string) => {
    if (fetchedPrivateChats.value.get(chatId)) return;
    isLoadingMessages.value = true;
    try {
      const response = await axios.get(`${url}/${chatId}`, {
        withCredentials: true,
      });
      fetchedPrivateChats.value.set(chatId, response.data.privateChat.messages);
      isLoadingMessages.value = false;
    } catch (e) {
      isLoadingMessages.value = false;
      await handleRequestError(e);
    }
  };

  const sendMessage = async (chatId: string, message: string) => {
    isLoadingMessages.value = false;
    try {
      const response = await axios.post(
        `${url}/${chatId}/messages`,
        { text: message, user: authStore.loggedUser?._id },
        { withCredentials: true }
      );
      const messageResponse = response.data.message;
      addMessage(chatId, messageResponse);
      socketStore.emit(`chat/private/${chatId}/messages`, messageResponse);
      isLoadingMessages.value = false;
    } catch (e) {
      isLoadingMessages.value = false;
      await handleRequestError(e);
    }
  };

  const create = async (usersToAdd: string[]) => {
    isLoadingRooms.value = true;
    try {
      const response = await axios.post(
        url,
        { users: usersToAdd },
        { withCredentials: true }
      );
      const createdChat = response.data.privateChat;
      privateChats.value.push(createdChat);
      socketStore.emit("chat/private", createdChat);
      isLoadingRooms.value = false;
    } catch (e) {
      isLoadingRooms.value = false;
      await handleRequestError(e);
    }
  };

  const addMessage = (chatId: string, message: Message) => {
    fetchedPrivateChats.value.set(chatId, [
      ...(fetchedPrivateChats.value.get(chatId) || []),
      message,
    ]);
  };

  const clear = () => {
    privateChats.value = [];
    isLoadingRooms.value = false;
    isLoadingMessages.value = false;
    fetchedPrivateChats.value = new Map();
  };

  return {
    privateChats,
    fetchedPrivateChats,
    isLoadingRooms,
    isLoadingMessages,
    getPrivateChats,
    getPrivateChatMessages,
    sendMessage,
    create,
    addMessage,
    clear,
  };
});
