<script setup lang="ts">
import {useAuthenticationStore} from "@/stores/authentication";
import {provide} from "vue";
import FamilyTreeView from "@/views/FamilyTreeView.vue";
import {storeToRefs} from "pinia";

const authStore = useAuthenticationStore();
const { isAuthenticated, loggedUser } = storeToRefs(authStore)
const userId = loggedUser.value?._id

provide('userId', userId)

</script>

<template>
  <div class="view">
    <FamilyTreeView v-if="isAuthenticated" :read-only="false"/>
    <div v-else class="text-4xl">Welcome to Family Tree App</div>
  </div>
</template>

<style scoped>

</style>