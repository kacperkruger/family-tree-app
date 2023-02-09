import { ref } from "vue";
import { defineStore } from "pinia";
import type { Message } from "@/data/message";
import axios from "axios";
import { useSocketStore } from "@/stores/socket";
import handleRequestError from "@/utils/handleRequestError";

export const usePublicChatStore = defineStore("publicChat", () => {
  const messages = ref<Message[]>([]);
  const socketServer = useSocketStore();
  const isLoading = ref(false);
  const url = `${import.meta.env.VITE_API_HOST_URL}/api/v1/chats/public`;

  const addMessage = (message: Message) => {
    messages.value.push(message);
  };

  const sendMessage = async (message: string): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await axios.post(
        `${url}/messages`,
        { text: message },
        { withCredentials: true }
      );
      const messageResponse = response.data.message;
      addMessage(messageResponse);
      socketServer.emitMessage("public", messageResponse);
      isLoading.value = false;
    } catch (e) {
      isLoading.value = false;
      await handleRequestError(e);
    }
  };

  const getMessages = async () => {
    if (messages.value.length) return;
    isLoading.value = true;
    try {
      const response = await axios.get(url, { withCredentials: true });
      messages.value = response.data.publicChat;
      isLoading.value = false;
    } catch (e) {
      isLoading.value = false;
      await handleRequestError(e);
    }
  };

  const clear = () => {
    messages.value = [];
    isLoading.value = false;
  };

  return { messages, isLoading, sendMessage, getMessages, addMessage, clear };
});
