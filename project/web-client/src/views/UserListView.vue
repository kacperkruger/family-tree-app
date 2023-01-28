<script setup lang="ts">
import {useUsersStore} from "@/stores/users";
import {onMounted} from "vue";
import {useRouter} from "vue-router";

const usersStore = useUsersStore();
const router = useRouter();

onMounted(async () => {
  await usersStore.getAllUsers();
})
</script>

<template>
  <div class="view flex-col w-full overflow-auto gap-4 p-4">
    <div class="flex gap-2 w-full items-center justify-between">

      <h1 class="text-4xl">User List</h1>
      <input type="text" class="border p-2 rounded self-center" placeholder="Search in users...">
    </div>
    <div class="text-lg flex flex-grow justify-center overflow-auto w-full">
      <div class="flex flex-col w-max gap-1">
        <button @click="router.push(`/users/${user?.username}`)" class="border p-8 rounded text-center hover:bg-gray-100" v-for="(user, index) in usersStore.users" :key="index">{{ user?.username }}</button>
      </div>
    </div>
  </div>
</template>