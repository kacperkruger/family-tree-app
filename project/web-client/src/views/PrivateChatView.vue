<script setup lang="ts">
import MessageComponent from "@/components/MessageComponent.vue"
import MessageFormComponent from "@/components/MessageFormComponent.vue"
import {computed, onMounted, ref, watch} from "vue";
import {usePrivateChatStore} from "@/stores/privateChat";
import {storeToRefs} from "pinia";
import type {PrivateChat} from "@/data/private-chat";
import {useAuthenticationStore} from "@/stores/authentication";
import type {Message} from "@/data/message";

const privateChatStore = usePrivateChatStore();
const authStore = useAuthenticationStore();
const {loggedUser} = storeToRefs(authStore);
const {privateChats, fetchedPrivateChats} = storeToRefs(privateChatStore)
const selectedChatId = ref<string | undefined>(undefined);
const messages = ref<Message[]>([])
const search = ref('');

watch(search, async () => {
  await privateChatStore.getPrivateChats(search.value)
})

const parseChatName = (privateChat: PrivateChat) => {
  return privateChat.users.map(user => loggedUser.value?._id === user._id ? "" : user.username).filter(s => s !== "").join(", ")
}

onMounted(async () => {
  await privateChatStore.getPrivateChats('tomek')
  selectedChatId.value = privateChats.value[0]?._id
})

watch(selectedChatId, async () => {
  if (selectedChatId.value) {
    await privateChatStore.getPrivateChatMessages(selectedChatId.value)
    messages.value = fetchedPrivateChats.value.get(selectedChatId.value) || []
  }
})

watch(privateChatStore.fetchedPrivateChats, () => {
  if (!selectedChatId.value) return;

  messages.value = fetchedPrivateChats.value.get(selectedChatId.value) || []
}, {deep: true})

const chatNameProperties = computed(() => {
  return (chatId: string | undefined) => selectedChatId.value === chatId ? "bg-gray-200" : "hover:bg-gray-100";
})

const sendMessage = (message: string) => {
  if (!selectedChatId.value) return;
  if (!authStore.loggedUser) return
  privateChatStore.sendMessage(selectedChatId.value, message)
}
</script>

<template>
  <div class="view p-6 overflow-auto gap-2">
    <section class="flex w-2/5 flex-col gap-4">
      <div class="flex flex-col border-b-2 pb-2 gap-2">
        <div class="flex items-center justify-between w-full px-2">
          <p class="text-lg">Private Chats</p>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor"
                 class="w-7 h-7 hover: hover:stroke-2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
            </svg>
          </button>
        </div>
        <input v-model="search" type="text" class="border rounded-full w-full p-2" placeholder="Find in private chats...">
      </div>
  <ul class="flex flex-col gap-1 overflow-auto">
    <li @click="selectedChatId = privateChat._id" v-for="(privateChat, index) in privateChats" :key="index"
        :class="`${chatNameProperties(privateChat?._id)} border p-8 rounded `">{{
        parseChatName(privateChat)
      }}
    </li>
  </ul>
  </section>
  <section class="flex w-full flex-col gap-4 overflow-auto">
    <div class="flex flex-col justify-end flex-grow w-full gap-2">
      <MessageComponent v-for="(message, index) in messages" :key="index" :message="message"/>
    </div>
    <MessageFormComponent @sendMessage="sendMessage"/>
  </section>
  </div>
</template>