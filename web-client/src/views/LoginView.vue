<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useAuthenticationStore } from "@/stores/authentication";
import { useRouter } from "vue-router";
import LoginButton from "@/components/LoginButton.vue";
import RegisterButton from "@/components/RegisterButton.vue";
import { storeToRefs } from "pinia";
import LoadingComponent from "@/components/LoadingComponent.vue";

const authStore = useAuthenticationStore();
const { isLoading, loginErrorMessage } = storeToRefs(authStore);
const router = useRouter();
const loginElement = ref<HTMLElement>();

const username = ref("");
const password = ref("");

const login = () => {
  authStore.login(username.value, password.value);
};

onMounted(() => {
  loginElement.value?.focus();
});

</script>

<template>
  <div class="view flex-col items-center">
    <LoadingComponent v-show="isLoading" />
    <section v-show="!isLoading" class="flex flex-col gap-3">
      <input id="username" ref="loginElement" v-model.trim="username" class="border rounded p-1"
             placeholder="Login" type="text"
             @keydown.enter="login" />
      <input id="password" v-model.trim="password" class="border rounded p-1" placeholder="Password"
             type="password" @keydown.enter="login" />
      <p class="text-red-600">
        {{ loginErrorMessage }}
      </p>
      <LoginButton @click="login" />
      <p class="self-center">OR</p>
      <RegisterButton @click="router.push({name: 'register'})" />
    </section>
  </div>
</template>

<style scoped>

</style>