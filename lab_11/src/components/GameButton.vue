<script setup>
defineProps(["name", "disabled"]);
</script>

<template>
  <button :disabled="disabled">{{ name }}</button>
</template>
