<script setup lang="ts">
import axios from 'axios';
import {computed, ref} from "vue";
import {useAuthenticationStore} from "@/stores/authentication";
import {useRouter} from "vue-router";

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
      <button @click="logIn" class="border w-full rounded text-sm p-2 bg-blue-500 hover:bg-blue-600 text-white">Log in
      </button>
      <p class="self-center">OR</p>
      <button @click="router.push({name: 'register'})" class="border rounded w-full p-2 bg-red-500 text-white hover:bg-red-600">Register</button>
    </div>
  </div>
</template>

<style scoped>

</style>