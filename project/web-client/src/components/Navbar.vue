<script setup lang="ts">
import {computed, ref} from "vue";

const isMenuOpen = ref(false);
const menuStatus = computed(() => {
  return isMenuOpen.value ? '' : 'hidden'
})

const menuSize = computed(() => {
  return isMenuOpen.value ? 'lg:static absolute lg:h-auto h-screen lg:w-auto w-full lg:overflow-visible overflow-hidden' : ''
})

const handleMenuClick = () => {
  console.log(isMenuOpen.value)
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav :class="`flex lg:items-center p-4 flex-col lg:flex-row ${menuSize}`">
    <section class="flex justify-between items-center">
      <div class="flex items-center gap-4 cursor-pointer">
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
      <p class="cursor-pointer">Private Chat</p>
      <p class="cursor-pointer">Public Chat</p>
      <p class="cursor-pointer">Users</p>
      <p class="px-4 py-2 leading-none border rounded mt-2 lg:mt-0 cursor-pointer">Login</p>
    </section>
  </nav>
</template>

<style scoped lang="scss">

</style>