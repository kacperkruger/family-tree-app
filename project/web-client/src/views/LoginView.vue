<script setup lang="ts">
import {computed, ref} from "vue";
import {useAuthenticationStore} from "@/stores/authentication";
import {useRouter} from "vue-router";
import LoginButton from "@/components/LoginButton.vue";
import RegisterButton from "@/components/RegisterButton.vue";

const authStore = useAuthenticationStore();
const router = useRouter();

const username = ref('');
const password = ref('')

const errorProperties = computed(() => {
  return authStore.errorMessage.length ? '' : 'hidden'
})

const errorMessage = computed(() => {
  return authStore.errorMessage
})

const login = () => {
  authStore.login(username.value, password.value)
}

</script>

<template>
  <div class="view">
    <div class="flex flex-col gap-3">
      <input v-model.trim="username" placeholder="Login" class="border rounded p-1" type="text" id="username"/>
      <input v-model.trim="password" placeholder="Password" class="border rounded p-1" type="password" id="password"/>
      <p :class="`${errorProperties} text-red-600 text-sm`">
        {{ errorMessage }}
      </p>
      <LoginButton @click="login" />
      <p class="self-center">OR</p>
      <RegisterButton @click="router.push({name: 'register'})" />
    </div>
  </div>
</template>

<style scoped>

</style>