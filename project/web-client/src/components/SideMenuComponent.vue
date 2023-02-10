<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  menuStatus: { type: Boolean, required: true }
});
defineEmits<{
  (e: "closeMenu"): void
}>();

const sideMenuProperties = computed(() => {
  return props.menuStatus ? "translate-x-0" : "translate-x-full";
});

</script>

<template>
  <div
    :class="`${sideMenuProperties} flex flex-col h-full w-3/4 lg:w-1/4 md:w-1/2 border-left absolute right-0 z-10 p-2 gap-4 backdrop-blur`">
    <button class="w-fit" @click="$emit('closeMenu')">
      <svg class="w-10 h-10 hover:stroke-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <slot />
  </div>
</template>