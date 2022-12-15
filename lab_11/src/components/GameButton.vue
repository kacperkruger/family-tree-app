<script setup>
defineProps(["name", "fun", "disabled"]);
</script>

<template>
  <button
    @click="
      {
        fun;
      }
    "
    :disabled="{ disabled }"
  >
    {{ name }}
  </button>
</template>
