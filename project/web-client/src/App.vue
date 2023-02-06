<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "@/components/NavbarComponent.vue";
import { useLoadingStore } from "@/stores/loading";
import LoadingView from "@/views/LoadingView.vue";
import { storeToRefs } from "pinia";

const loadingStore = useLoadingStore();
const { isLoading } = storeToRefs(loadingStore);
</script>

<template>
  <div class="flex flex-col h-screen">
    <NavBar />
    <LoadingView v-show="isLoading" />
    <RouterView v-show="!isLoading" />
  </div>
</template>

