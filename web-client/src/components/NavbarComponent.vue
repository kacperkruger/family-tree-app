<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthenticationStore } from "@/stores/authentication";

const router = useRouter();
const authStore = useAuthenticationStore();

const loginProperties = computed(() => {
  return authStore.isAuthenticated ? "cursor-pointer" : "cursor-not-allowed text-gray-500";
});

const isMenuOpen = ref(false);
const menuStatus = computed(() => {
  return isMenuOpen.value ? "bg-white" : "hidden";
});

const menuProperties = computed(() => {
  return isMenuOpen.value ? "lg:static z-50 absolute lg:h-auto h-screen lg:w-auto w-full lg:overflow-visible" : "";
});

const handleMenuClick = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const navigate = (to: string, auth: boolean) => {
  if (auth && !authStore.isAuthenticated) return;
  router.push({ name: to });
  isMenuOpen.value = false;
};

const login = () => {
  authStore.getLoggedUser(() => true, () => router.push({ name: "login" }));
  isMenuOpen.value = false;
};

const logout = () => {
  authStore.logout();
  isMenuOpen.value = false;
  router.push({ name: "home" });
};
</script>

<template>
  <nav :class="`flex lg:items-center justify-between p-4 flex-col lg:flex-row ${menuProperties} bg-white`">
    <section class="flex justify-between items-center">
      <div class="flex items-center gap-4 cursor-pointer" @click="navigate('home', false)">
        <img alt="logo" height="75" src="@/assets/logo.svg" width="75">
        <span class="font-semibold text-xl tracking-tight">Family Tree App</span>
      </div>
      <div class="lg:hidden">
        <button
          class="flex items-center px-3 py-2" @click="handleMenuClick">
          <svg v-if="!isMenuOpen" class="w-10 h-10 hover:stroke-2" fill="none" stroke="currentColor" stroke-width="1.5"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-else class="w-10 h-10 hover:stroke-2" fill="none" stroke="currentColor" stroke-width="1.5"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </section>
    <section
      :class="`${menuStatus} lg:flex text-lg flex flex-col lg:flex-row lg:justify-end items-center flex-grow lg:flex-grow-0 gap-6 justify-center`">
      <p :class="`${loginProperties} cursor-pointer`" @click="navigate('private-chat', true)">Private Chat</p>
      <p :class="`${loginProperties} cursor-pointer`" @click="navigate('public-chat', true)">Public Chat</p>
      <p :class="`${loginProperties} cursor-pointer`" @click="navigate('users', true)">Users</p>
      <p v-if="authStore.isAuthenticated"
         class="px-4 py-2 leading-none border bg-red-500 hover:bg-red-600 text-white rounded mt-2 lg:mt-0 cursor-pointer"
         @click="logout">
        Logout</p>
      <p v-else
         class="px-4 py-2 leading-none border rounded mt-2 bg-blue-500 text-white hover:bg-blue-600 lg:mt-0 cursor-pointer"
         @click="login">
        Login</p>
    </section>
  </nav>
</template>

<style lang="scss" scoped>
body {
  overflow: hidden;
}
</style>