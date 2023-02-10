<script lang="ts" setup>
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
      <input ref="loginElement" v-model="username" class="border rounded p-1" placeholder="Username" type="text"
             @keydown.enter="register" />
      <input v-model="email" class="border rounded p-1" placeholder="E-mail" type="email" @keydown.enter="register" />
      <input v-model="password" class="border rounded p-1" placeholder="Password" type="password"
             @keydown.enter="register" />
      <p class="text-red-600">{{ registerErrorMessage }}</p>
      <RegisterButton @click="register" />
      <p class="self-center">OR</p>
      <LoginButton @click="router.push({name: 'login'})" />
    </div>
  </div>
</template>

<style scoped>

</style>