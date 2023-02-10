<script lang="ts" setup>
import { onMounted, ref } from "vue";

const emit = defineEmits<{ (e: "sendMessage", message: string): Promise<void> }>();
const message = ref("");
const messageInput = ref<HTMLElement>();
const emitSendMessage = () => {
  emit("sendMessage", message.value);
  message.value = "";
};

onMounted(() => messageInput.value?.focus());
</script>

<template>
  <div class="flex w-full gap-2 items-center">
    <input ref="messageInput" v-model.trim="message" class="flex-grow p-2 border rounded-xl"
           placeholder="Type message..."
           type="text" @keydown.enter="emitSendMessage" />
    <button @click="emitSendMessage">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              stroke-linecap="round"
              stroke-linejoin="round" />
      </svg>
    </button>

  </div>
</template>