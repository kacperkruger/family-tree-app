<script setup lang="ts">
import axios from 'axios';
import {computed, ref} from "vue";
import {useAuthenticationStore} from "@/stores/authentication";
import {useRouter} from "vue-router";
import LoginButton from "@/components/LoginButton.vue";
import RegisterButton from "@/components/RegisterButton.vue";

const authStore = useAuthenticationStore();
const router = useRouter();

const username = ref('');
const password = ref('')
const isError = ref(false)

const errorProperties = computed(() => {
  return isError.value ? '' : 'hidden'
})

const logIn = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication/login`, {
      username: username.value,
      password: password.value
    })
    authStore.reverseState()
    await router.push({name: 'home'})
  } catch (_e) {
    isError.value = true
  }
}
</script>

<template>
  <div class="view">
    <div class="flex flex-col gap-3">
      <input v-model="username" placeholder="Login" class="border rounded p-1" type="text" id="username"/>
      <input v-model="password" placeholder="Password" class="border rounded p-1" type="password" id="password"/>
      <p :class="`${errorProperties} text-red-600 text-sm`">
        Invalid username or password
      </p>
      <LoginButton @click="logIn" />
      <p class="self-center">OR</p>
      <RegisterButton @click="router.push({name: 'register'})" />
    </div>
  </div>
</template>

<style scoped>

</style>