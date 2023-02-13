<script lang="ts" setup>
import { ref, watch } from "vue";
import { usePrivateChatStore } from "@/stores/privateChat";

defineProps({
  isOpenAddChat: { type: Boolean, required: true }
});

defineEmits<{
  (e: "setIsOpenAddChat", value: boolean): void
}>();

const privateChatStore = usePrivateChatStore();
const search = ref("");

watch(search, async () => {
  await privateChatStore.getPrivateChats(search.value);
});
</script>

<template>
  <div class="flex flex-col border-b-2 pb-2 gap-2">
    <div class="flex items-center justify-between w-full px-2">
      <p class="text-lg">Private Chats</p>
      <button @click="$emit('setIsOpenAddChat', !isOpenAddChat)">
        <svg class="w-7 h-7 hover: hover:stroke-2" fill="none" stroke="currentColor" stroke-width="1.5"
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
    </div>
    <input v-model="search" class="border rounded-full w-full p-2" placeholder="Find in private chats..."
           type="text">
  </div>
</template>