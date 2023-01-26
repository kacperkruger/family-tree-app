<script setup lang="ts">
import PrivateMessageComponent from "@/components/PrivateMessageComponent.vue"
import MessageFormComponent from "@/components/MessageFormComponent.vue"
import {onMounted, ref, watch} from "vue";
import {usePrivateChatStore} from "@/stores/privateChat";
import {storeToRefs} from "pinia";
import type {Message} from "@/data/message";

const privateChatStore = usePrivateChatStore();
const {privateChats, fetchedPrivateChats} = storeToRefs(privateChatStore)
const selectedChatId = ref<string>();

const messages = ref<Message[]>([])

onMounted(async () => {
  await privateChatStore.getAllPrivateChats()
  selectedChatId.value = privateChats.value[0]._id
})

watch(selectedChatId, async () => {
  if (selectedChatId.value) {
    await privateChatStore.getPrivateChatMessages(selectedChatId.value)
    messages.value = fetchedPrivateChats.value.get(selectedChatId.value) || []
  }
})

</script>

<template>
  <div class="view p-6">
    <ul class="flex w-2/5 flex-col gap-1 flex-grow">
      <li v-for="privateChat in privateChats" :key="privateChat._id" class="border p-8 rounded">{{ privateChat._id }}
      </li>
    </ul>
    <div class="flex w-full flex-col gap-4">
      <div class="flex flex-col justify-end flex-grow w-full gap-2">
        <PrivateMessageComponent v-for="message in messages" :key="message._id" :message="message"/>
      </div>
      <MessageFormComponent/>
    </div>
  </div>
</template>