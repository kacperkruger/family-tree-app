<script lang="ts" setup>
import { onMounted } from "vue";
import { usePublicChatStore } from "@/stores/publicChat";
import { useAuthenticationStore } from "@/stores/authentication";
import { useSocketStore } from "@/stores/socket";
import { storeToRefs } from "pinia";
import ChatComponent from "@/components/ChatComponent.vue";

const publicChatStore = usePublicChatStore();
const { messages, isLoading } = storeToRefs(publicChatStore);
const authStore = useAuthenticationStore();
const socketStore = useSocketStore();


onMounted(async () => {
  await publicChatStore.getMessages();
  socketStore.connect("chat/public", publicChatStore.addMessage);
});

const sendMessage = async (message: string) => {
  if (!authStore.loggedUser) return;
  if (!message) return;

  await publicChatStore.sendMessage(message);
};
</script>

<template>
  <div class="view overflow-auto py-2">
    <ChatComponent :isLoading="isLoading" :messages="messages" @sendMessage="sendMessage" />
  </div>
</template>
