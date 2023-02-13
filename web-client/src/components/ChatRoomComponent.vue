<script lang="ts" setup>
import { computed, type PropType } from "vue";
import type { PrivateChat } from "@/data/private-chat";
import { useAuthenticationStore } from "@/stores/authentication";
import { storeToRefs } from "pinia";

const authStore = useAuthenticationStore();

const { loggedUser } = storeToRefs(authStore);

const props = defineProps({
  privateChat: { type: Object as PropType<PrivateChat>, required: true },
  selectedChatId: { type: String }
});

const chatNameProperties = computed(() => {
  return (chatId: string | undefined) => props.selectedChatId === chatId ? "bg-gray-200" : "hover:bg-gray-100";
});

const parseChatName = (privateChat: PrivateChat) => {
  return privateChat.users.map(user => loggedUser.value?._id === user._id ? "" : user.username).filter(s => s !== "").join(", ");
};

</script>

<template>
  <div :class="`${chatNameProperties(privateChat?._id)} border p-8 rounded `">
    {{ parseChatName(privateChat) }}
  </div>
</template>