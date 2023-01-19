<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from "@/components/NavbarComponent.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />
    <RouterView />
  </div>
</template>

