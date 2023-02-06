<script setup lang="ts">
import { ref } from "vue";
import LoginButton from "@/components/LoginButton.vue";
import RegisterButton from "@/components/RegisterButton.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");

const errorMessage = ref("");

</script>

<template>
  <div class="view flex-col items-center">
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