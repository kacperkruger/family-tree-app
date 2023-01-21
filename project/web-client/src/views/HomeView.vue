<script setup lang="ts">
import FamilyTreeComponent from "@/components/FamilyTreeComponent.vue"
import FamilyTreeButtons from "@/components/FamilyTreeButtons.vue"
import {useAuthenticationStore} from "@/stores/authentication";
import {computed} from "vue";

const authStore = useAuthenticationStore();
const isLoggedIn = computed(() => {
  return authStore.isAuthenticated
})
</script>

<template>
  <div class="view">
    <div class="flex flex-col w-full" v-if="isLoggedIn">
      <FamilyTreeButtons />
      <FamilyTreeComponent class="flex-grow" />
    </div>
    <div v-else class="text-4xl">Welcome to Family Tree App</div>
  </div>
</template>

<style scoped>

</style>