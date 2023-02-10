<script lang="ts" setup>
import AddChatRoomComponent from "@/components/AddChatRoomComponent.vue";
import ChatRoomComponent from "@/components/ChatRoomComponent.vue";
import type { User } from "@/data/user";
import { usePrivateChatStore } from "@/stores/privateChat";
import { storeToRefs } from "pinia";

const privateChatStore = usePrivateChatStore();
const { privateChats } = storeToRefs(privateChatStore);

defineProps({
  isOpenAddChat: { type: Boolean, required: true },
  selectedChatId: { type: String }
});

const emits = defineEmits<{
  (e: "createChat", usersToAdd: Set<User>): void;
  (e: "setSelectedChatId", value: string | undefined): void
}>();

const emitCreateChat = (usersToAdd: Set<User>) => {
  emits("createChat", usersToAdd);
};
</script>

<template>
  <ul class="flex flex-col gap-1 overflow-auto">
    <li v-show="isOpenAddChat">
      <AddChatRoomComponent @createChat="emitCreateChat" />
    </li>
    <li v-for="(privateChat, index) in privateChats" :key="index" @click="$emit('setSelectedChatId', privateChat._id)">
      <ChatRoomComponent :private-chat="privateChat" :selectedChatId="selectedChatId" />
    </li>
  </ul>
</template>