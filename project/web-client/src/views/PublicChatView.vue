<script setup lang="ts">
import MessageFormComponent from "@/components/MessageFormComponent.vue"
import PublicMessageComponent from "@/components/PublicMessageComponent.vue"
import {onMounted} from "vue";
import {usePublicChatStore} from "@/stores/publicChat";
import {useAuthenticationStore} from "@/stores/authentication";

const publicChatStore = usePublicChatStore();
const authStore = useAuthenticationStore();

onMounted(async () => {
  await publicChatStore.getMessages()
})

const onSendMessage = (message: string) => {
  if (!authStore.loggedUser) return
  publicChatStore.sendMessage(message)
}
</script>

<template>
  <div class="view flex-col p-6 gap-4">
    <div class="flex flex-col justify-end flex-grow w-full gap-2">
      <PublicMessageComponent v-for="message in publicChatStore.messages" :key="message._id" :message="message" />
    </div>
    <MessageFormComponent @sendMessage="onSendMessage" />
  </div>
</template>
