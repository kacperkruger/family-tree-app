<script setup lang="ts">
import { useUsersStore } from "@/stores/users";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import LoadingComponent from "@/components/LoadingComponent.vue";

const usersStore = useUsersStore();
const { isLoading, users } = storeToRefs(usersStore);
const router = useRouter();

const searchSurnames = ref("");
const searchDateOfBirth = ref<string | undefined>(undefined);

const searchUsersByPersonSurname = async () => {
  if (!searchSurnames.value && !searchDateOfBirth.value) await usersStore.getAllUsers();
  await usersStore.getUsersByPersonsSurnames(searchSurnames.value.split(" "), searchDateOfBirth.value);
};

onMounted(async () => {
  await usersStore.getAllUsers();
});
</script>

<template>
  <div class="view flex-col w-full overflow-auto gap-4 p-4">
    <div class="flex gap-2 w-full items-center justify-between">
      <h1 class="text-4xl">User List</h1>
      <div class="flex flex-col border rounded">
        <div class="flex items-center border-b-2">
          <input v-model.trim="searchSurnames" type="text" class="p-2" placeholder="Search in users...">
          <button class="p-2" @click="searchUsersByPersonSurname">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6 hover:stroke-2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
        <input v-model="searchDateOfBirth" class="p-2 bg-gray-100 cursor-pointer" type="date">
      </div>
    </div>
    <div class="text-lg flex flex-grow justify-center overflow-auto w-full">
      <LoadingComponent v-show="isLoading" />
      <div v-show="!isLoading" class="flex flex-col w-max gap-1">
        <button @click="router.push({name: 'user', params: {username: user?.username}})"
                class="border p-8 rounded text-center hover:bg-gray-100" v-for="(user, index) in users"
                :key="index">{{ user?.username }}
        </button>
      </div>
    </div>
  </div>
</template>