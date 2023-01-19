<script setup lang="ts">
import {ref} from "vue";

const emit = defineEmits<{ (e: "sendMessage", message: String): Promise<void> }>()
const message = ref('')
const emitSendMessage = () => {
  console.log(message.value)
  emit("sendMessage", message.value)
  message.value = ''
}
</script>

<template>
<div class="flex w-full gap-2 items-center">
  <input v-model.trim="message" placeholder="Type message..." class="flex-grow p-2 border rounded-xl" type="text" />
  <button @click="emitSendMessage">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  </button>

</div>
</template>