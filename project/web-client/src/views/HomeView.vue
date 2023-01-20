<script setup lang="ts">
import FamilyTreeComponent from "@/components/FamilyTreeComponent.vue"
import {useAuthenticationStore} from "@/stores/authentication";
import {computed} from "vue";

const authStore = useAuthenticationStore();
const isLoggedIn = computed(() => {
  return authStore.isAuthenticated
})
</script>

<template>
  <div class="view">
    <FamilyTreeComponent v-if="isLoggedIn" />
    <div v-else class="text-4xl">Welcome to Family Tree App</div>
  </div>
</template>

<style scoped>

</style>