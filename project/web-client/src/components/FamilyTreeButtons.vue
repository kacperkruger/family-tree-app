<script setup lang="ts">
defineEmits<{
  (e: "openAddPersonMenu"): void
}>();
</script>

<template>
  <div class="flex gap-8 w-full justify-end p-2">
    <button @click="$emit('openAddPersonMenu')">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
           class="w-7 h-7 hover:stroke-2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
      </svg>
    </button>
  </div>
</template>

<style scoped>

</style>