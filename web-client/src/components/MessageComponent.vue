<script lang="ts" setup>
import type { PropType } from "vue";
import { computed } from "vue";
import type { Message } from "@/data/message";
import { useAuthenticationStore } from "@/stores/authentication";

const authStore = useAuthenticationStore();
const props = defineProps({
  message: { type: Object as PropType<Message>, required: true }
});

const messageProperties = computed(() => {
  return authStore.loggedUser?._id === props.message.user._id ? "bg-blue-400 text-white" : "bg-gray-200";
});

const messagePosition = computed(() => {
  return authStore.loggedUser?._id === props.message.user._id ? "self-end" : "";
});
</script>

<template>
  <div :class="`${messagePosition} flex flex-col justify-center `">
    <p v-if="authStore.loggedUser?._id !== props.message.user._id" class="p-2">{{ message.user.username }}: </p>
    <p :class="`${messageProperties} flex gap-2 py-2 px-4 border rounded-full w-fit`">{{ message.text }}</p>
  </div>
</template>