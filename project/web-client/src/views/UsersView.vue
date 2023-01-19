<script setup lang="ts">
import UserComponent from "@/components/UserComponent.vue"
import {onMounted, ref} from "vue";
import axios, {isAxiosError} from "axios";
import type {Index} from "@/data/user";
import {useAuthenticationStore} from "@/stores/authentication";
import {useRouter} from "vue-router";

const users = ref<Index[]>([]);
const authStore = useAuthenticationStore()
const router = useRouter();

onMounted(async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/users`, {withCredentials: true})
    users.value = response.data.users
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 401) {
      authStore.isAuthenticated = false
      await router.push({name: 'home'})
    }
    console.log(e)
  }
})

</script>

<template>
  <div class="view">
    <UserComponent v-for="user in users" :key="user._id" :user="user" />
  </div>
</template>

<style scoped>

</style>