import { ref } from "vue";
import { defineStore } from "pinia";
import type { Message } from "@/data/message";
import axios, { isAxiosError } from "axios";
import { useAuthenticationStore } from "@/stores/authentication";
import router from "@/router";
import { useSocketStore } from "@/stores/socket";

export const usePublicChatStore = defineStore("publicChat", () => {
  const messages = ref<Message[]>([]);
  const authStore = useAuthenticationStore();
  const socketServer = useSocketStore();

  const addMessage = (message: Message) => {
    messages.value.push(message);
  };

  const sendMessage = async (message: string): Promise<void> => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/public/messages`,
        { text: message },
        { withCredentials: true });
      const messageResponse = response.data.message;
      addMessage(messageResponse);
      socketServer.emitMessage("public", messageResponse);
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  const getMessages = async () => {
    if (messages.value.length) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/public`, { withCredentials: true });
      messages.value = response.data.publicChat;
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        authStore.logout();
        await router.push({ name: "login" });
      }
      console.log(e);
    }
  };

  return { messages, sendMessage, getMessages, addMessage };
});
