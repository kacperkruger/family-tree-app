<script setup lang="ts">
import type {PropType} from "vue";
import type {Message} from "@/data/message";
import {useAuthenticationStore} from "@/stores/authentication";

const authStore = useAuthenticationStore();
const props = defineProps({
  message: { type: Object as PropType<Message>, required: true }
})

const isUserMessage = authStore.loggedUser?._id === props.message.user._id

const messageProperties = isUserMessage ? 'bg-blue-400 text-white' : 'bg-gray-200';

const messagePosition = isUserMessage ? 'self-end' : '';
</script>

<template>
  <div :class="`${messagePosition} flex flex-col justify-center `">
    <p :class="`${messageProperties} flex gap-2 py-2 px-4 border rounded-full w-fit`">{{ message.text }}</p>
  </div>
</template>