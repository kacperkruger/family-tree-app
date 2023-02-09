<script setup lang="ts">
import { onMounted, ref } from "vue";
import LoginButton from "@/components/LoginButton.vue";
import RegisterButton from "@/components/RegisterButton.vue";
import { useAuthenticationStore } from "@/stores/authentication";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const authStore = useAuthenticationStore();
const { registerErrorMessage } = storeToRefs(authStore);
const router = useRouter();
const loginElement = ref<HTMLElement>();

const username = ref("");
const email = ref("");
const password = ref("");


const register = () => {
  authStore.register({ username: username.value, email: email.value, password: password.value });
};

onMounted(() => {
  loginElement.value?.focus();
});

</script>

<template>
  <div class="view flex-col items-center">
    <div class="flex flex-col gap-2 w-min">
      <input type="text" v-model="username" @keydown.enter="register" ref="loginElement" placeholder="Username"
             class="border rounded p-1" />
      <input type="email" v-model="email" @keydown.enter="register" placeholder="E-mail" class="border rounded p-1" />
      <input type="password" v-model="password" @keydown.enter="register" placeholder="Password"
             class="border rounded p-1" />
      <p class="text-red-600">{{ registerErrorMessage }}</p>
      <RegisterButton @click="register" />
      <p class="self-center">OR</p>
      <LoginButton @click="router.push({name: 'login'})" />
    </div>
  </div>
</template>

<style scoped>

</style>