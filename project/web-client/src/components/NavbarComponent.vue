<script setup lang="ts">
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useAuthenticationStore} from "@/stores/authentication";
import axios from "axios";

const router = useRouter();
const authStore = useAuthenticationStore();

const loginProperties = computed(() => {
  return authStore.isAuthenticated ? 'cursor-pointer' : 'cursor-not-allowed text-gray-500'
})

const isMenuOpen = ref(false);
const menuStatus = computed(() => {
  return isMenuOpen.value ? 'bg-white' : 'hidden'
})

const menuProperties = computed(() => {
  return isMenuOpen.value ? 'lg:static z-50 absolute lg:h-auto h-screen lg:w-auto w-full lg:overflow-visible' : ''
})

const handleMenuClick = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const navigate = (to: string, auth: boolean) => {
  if (auth && !authStore.isAuthenticated) return
  router.push({name: to})
  isMenuOpen.value = false
}

const logIn = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication/me`, {withCredentials: true})
    authStore.isAuthenticated = true
    console.log(response.data.user)
  } catch (e) {
    navigate('login', false);
  }
}

const logOut = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication/logout`, {}, {withCredentials: true})
    authStore.isAuthenticated = false
    navigate('home', false)
  } catch (e) {
    alert('Internal error')
  }
}
</script>

<template>
  <nav :class="`flex lg:items-center p-4 flex-col lg:flex-row ${menuProperties}`">
    <section class="flex justify-between items-center">
      <div @click="navigate('home')" class="flex items-center gap-4 cursor-pointer">
        <img src="@/assets/logo.svg" alt="logo" width="75" height="75">
        <span class="font-semibold text-xl tracking-tight">Family Tree App</span>
      </div>
      <div class="block lg:hidden">
        <button
            @click="handleMenuClick" class="flex items-center px-3 py-2">
          <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>

        </button>
      </div>
    </section>
    <section :class="`${menuStatus} lg:flex text-lg flex flex-col lg:flex-row lg:justify-end items-center gap-6 flex-grow justify-center`">
      <p @click="navigate('private chat', true)" :class="`${loginProperties} cursor-pointer text-`">Private Chat</p>
      <p @click="navigate('public chat', true)" :class="`${loginProperties} cursor-pointer`">Public Chat</p>
      <p @click="navigate('users', true)" :class="`${loginProperties} cursor-pointer`">Users</p>
      <p v-if="authStore.isAuthenticated" @click="logOut" class="px-4 py-2 leading-none border rounded mt-2 lg:mt-0 cursor-pointer">Logout</p>
      <p v-else @click="logIn" class="px-4 py-2 leading-none border rounded mt-2 lg:mt-0 cursor-pointer">Login</p>
    </section>
  </nav>
</template>

<style scoped lang="scss">
body {
  overflow: hidden;
}
</style>