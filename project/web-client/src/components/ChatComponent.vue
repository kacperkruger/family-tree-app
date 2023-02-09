<script setup lang="ts">
import LoadingComponent from "@/components/LoadingComponent.vue";
import MessageComponent from "@/components/MessageComponent.vue";
import MessageFormComponent from "@/components/MessageFormComponent.vue";
import type { PropType } from "vue";
import { ref, watch } from "vue";
import type { Message } from "@/data/message";
import scrollToBottom from "@/utils/scrollToBottom";

const props = defineProps({
  isLoading: { type: Boolean, required: true },
  messages: { type: Object as PropType<Message[]> }
});

const emits = defineEmits<{
  (e: "sendMessage", message: string): void
}>();

const container = ref<HTMLElement>();

const emitSendMessage = async (message: string) => {
  emits("sendMessage", message);
};

watch(props, () => {
  scrollToBottom(container.value);
});

</script>

<template>
  <section class="flex flex-col w-full h-full gap-4">
    <LoadingComponent v-show="isLoading" />
    <div v-show="!isLoading" class="overflow-auto flex-grow" ref="container">
      <div class="flex flex-col justify-end gap-2">
        <MessageComponent v-for="message in messages" :key="message._id" :message="message" />
      </div>
    </div>
    <MessageFormComponent @sendMessage="emitSendMessage" />
  </section>
</template>