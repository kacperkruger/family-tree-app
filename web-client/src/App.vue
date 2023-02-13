<script lang="ts" setup>
import { RouterView } from "vue-router";
import NavBar from "@/components/NavbarComponent.vue";
import LoadingView from "@/views/LoadingView.vue";
import { storeToRefs } from "pinia";
import { useAuthenticationStore } from "@/stores/authentication";

const authStore = useAuthenticationStore();
const { isLoading } = storeToRefs(authStore);
</script>

<template>
  <div class="flex flex-col h-screen">
    <NavBar />
    <LoadingView v-show="isLoading" />
    <RouterView v-show="!isLoading" />
  </div>
</template>

