<script setup lang="ts">
import MessageFormComponent from "@/components/MessageFormComponent.vue";
import MessageComponent from "@/components/MessageComponent.vue";
import { onMounted } from "vue";
import { usePublicChatStore } from "@/stores/publicChat";
import { useAuthenticationStore } from "@/stores/authentication";
import { useSocketStore } from "@/stores/socket";

const publicChatStore = usePublicChatStore();
const authStore = useAuthenticationStore();
const socketStore = useSocketStore();

onMounted(async () => {
  await publicChatStore.getMessages();
  socketStore.connect("public", publicChatStore.addMessage);
});

const onSendMessage = (message: string) => {
  if (!authStore.loggedUser) return;
  publicChatStore.sendMessage(message);
};
</script>

<template>
  <div class="view flex-col p-6 gap-4 overflow-auto">
    <div class="flex flex-col justify-end flex-grow w-full gap-2">
      <MessageComponent v-for="message in publicChatStore.messages" :key="message._id" :message="message" />
    </div>
    <MessageFormComponent @sendMessage="onSendMessage" />
  </div>
</template>
