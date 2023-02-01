<script setup lang="ts">
import { computed, ref } from "vue";
import LoginButton from "@/components/LoginButton.vue";
import RegisterButton from "@/components/RegisterButton.vue";
import { useRouter } from "vue-router";
import axios, { isAxiosError } from "axios";

const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");

const errorMessage = ref("");
const errorText = computed(() => {
  return "";
});
const register = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication/register`, {
      username: username.value,
      email: email.value,
      password: password.value
    });
    await router.push({ name: "login" });
  } catch (e) {
    if (isAxiosError(e)) errorMessage.value = e.response?.data.error;
    else errorMessage.value = "Unknown error. Try again later.";
  }
};
</script>

<template>
  <div class="view flex-col">
    <div class="flex flex-col gap-2 w-min">
      <input type="text" v-model="username" placeholder="Username" class="border rounded p-1" />
      <input type="email" v-model="email" placeholder="E-mail" class="border rounded p-1" />
      <input type="password" v-model="password" placeholder="Password" class="border rounded p-1" />
      <p class="text-red-600">{{ errorMessage }}</p>
      <RegisterButton @click="register" />
      <p class="self-center">OR</p>
      <LoginButton @click="router.push({name: 'login'})" />
    </div>
  </div>
</template>

<style scoped>

</style>