import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import type { Message } from "@/data/message";
import axios, { isAxiosError } from "axios";
import { useAuthenticationStore } from "@/stores/authentication";
import router from "@/router";
import { useSocketStore } from "@/stores/socket";
import { useLoadingStore } from "@/stores/loading";

export const usePublicChatStore = defineStore("publicChat", () => {
  const messages = ref<Message[]>([]);
  const authStore = useAuthenticationStore();
  const socketServer = useSocketStore();
  const loadingStore = useLoadingStore();
  const { isLoading } = storeToRefs(loadingStore);

  const addMessage = (message: Message) => {
    messages.value.push(message);
  };

  const sendMessage = async (message: string): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/public/messages`,
        { text: message },
        { withCredentials: true }
      );
      isLoading.value = false;
      const messageResponse = response.data.message;
      addMessage(messageResponse);
      socketServer.emitMessage("public", messageResponse);
    } catch (e) {
      isLoading.value = false;
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const getMessages = async () => {
    if (messages.value.length) return;
    isLoading.value = true;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/public`,
        { withCredentials: true }
      );
      isLoading.value = false;
      messages.value = response.data.publicChat;
    } catch (e) {
      isLoading.value = false;
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  return { messages, sendMessage, getMessages, addMessage };
});
