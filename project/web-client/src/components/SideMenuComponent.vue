<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  menuStatus: { type: Boolean, required: true }
});
defineEmits<{
  (e: "closeMenu"): void
}>();

const menuStatus = computed(() => props.menuStatus);

const sideMenuProperties = computed(() => {
  return menuStatus.value ? "" : "hidden";
});

</script>

<template>
  <div
    :class="`${sideMenuProperties} flex flex-col h-full w-3/4 lg:w-1/4 md:w-1/2 border-left absolute right-0 z-10 p-2 gap-4 backdrop-blur`">
    <button @click="$emit('closeMenu')" class="w-fit">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
           class="w-10 h-10 hover:stroke-2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <slot />
  </div>
</template>