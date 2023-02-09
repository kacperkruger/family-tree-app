<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { usePrivateChatStore } from "@/stores/privateChat";
import { storeToRefs } from "pinia";
import type { Message } from "@/data/message";
import type { User } from "@/data/user";
import { useSocketStore } from "@/stores/socket";
import LoadingComponent from "@/components/LoadingComponent.vue";
import ChatComponent from "@/components/ChatComponent.vue";

import PrivateChatButtonsComponent from "@/components/PrivateChatButtonsComponent.vue";
import ListChatRoomComponent from "@/components/ListChatRoomComponent.vue";
import type { PrivateChat } from "@/data/private-chat";
import { useAuthenticationStore } from "@/stores/authentication";

const authStore = useAuthenticationStore();
const { loggedUser } = storeToRefs(authStore);
const privateChatStore = usePrivateChatStore();
const socketStore = useSocketStore();
const { privateChats, fetchedPrivateChats, isLoadingMessages, isLoadingRooms } = storeToRefs(privateChatStore);
const isOpenAddChat = ref(false);

const selectedChatId = ref<string | undefined>(undefined);
const messages = ref<Message[]>([]);


const sendMessage = async (message: string) => {
  if (!selectedChatId.value) return;
  if (!message) return;
  await privateChatStore.sendMessage(selectedChatId.value, message);
};

const createChat = async (usersToAdd: Set<User>) => {
  await privateChatStore.create([...usersToAdd].map(user => user._id));
  isOpenAddChat.value = false;
};

onMounted(async () => {
  await privateChatStore.getPrivateChats();
  selectedChatId.value = privateChats.value[0]?._id;
  socketStore.connect("chat/private", (newRoom: PrivateChat) => {
    privateChats.value.push(newRoom);
  }, { userId: loggedUser.value?._id });
});

watch(selectedChatId, async () => {
  const chatId = selectedChatId.value;
  if (chatId) {
    await privateChatStore.getPrivateChatMessages(chatId);
    messages.value = fetchedPrivateChats.value.get(chatId) || [];
    await socketStore.connect(`chat/private/${chatId}/messages`, (message: Message) => privateChatStore.addMessage(chatId, message));
  }
});

watch(fetchedPrivateChats, () => {
  if (!selectedChatId.value) return;
  messages.value = fetchedPrivateChats.value.get(selectedChatId.value) || [];
}, { deep: true });
</script>

<template>
  <div class="view py-2 overflow-auto gap-2">
    <section class="flex w-2/5 flex-col gap-2">
      <PrivateChatButtonsComponent :isOpenAddChat="isOpenAddChat"
                                   @setIsOpenAddChat="(value: Boolean) => isOpenAddChat = value" />
      <LoadingComponent v-show="isLoadingRooms" />
      <ListChatRoomComponent :is-open-add-chat="isOpenAddChat" :selected-chat-id="selectedChatId"
                             @createChat="createChat"
                             @setSelectedChatId="(value: String | undefined) => selectedChatId = value" />
    </section>
    <ChatComponent :isLoading="isLoadingMessages" :messages="messages" @sendMessage="sendMessage" />
  </div>
</template>