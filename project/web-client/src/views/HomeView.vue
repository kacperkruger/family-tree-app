<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/authentication";
import FamilyTreeView from "@/views/FamilyTreeView.vue";
import { storeToRefs } from "pinia";

const authStore = useAuthenticationStore();
const { isAuthenticated, loggedUser } = storeToRefs(authStore);
</script>

<template>
  <div class="view items-center">
    <FamilyTreeView v-if="isAuthenticated && loggedUser" :read-only="false" :user-id="loggedUser._id" />
    <div v-else class="text-4xl">Welcome to Family Tree App</div>
  </div>
</template>

<style scoped>

</style>