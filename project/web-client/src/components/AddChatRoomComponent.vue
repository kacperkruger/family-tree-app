<script setup lang="ts">


import { onMounted, ref } from "vue";
import type { User } from "@/data/user";
import { useUsersStore } from "@/stores/users";
import { storeToRefs } from "pinia";

const userToAdd = ref();
const usersToAdd = ref(new Set<User>());

const userStore = useUsersStore();
const { users } = storeToRefs(userStore);

const addUser = () => {
  usersToAdd.value.add(JSON.parse(userToAdd.value));
  userToAdd.value = undefined;
};

onMounted(async () => {
  await userStore.getAllUsers();
});

const emits = defineEmits<{
  (e: "createChat", usersToAdd: Set<User>): void
}>();

const emitCreateChat = () => {
  emits("createChat", usersToAdd.value);
};
</script>

<template>
  <section class="flex flex-col gap-4 border p-4 rounded">
    <select v-model="userToAdd" @change="addUser"
            class="border rounded px-4 py-2" name="test" id="test">
      <option :value="undefined" disabled selected="selected">Select user to add</option>
      <option v-for="(user, index) in users.filter(u => ![...usersToAdd].some(uu => uu?._id === u._id))"
              :value="JSON.stringify(user)" :key="index">{{ user.username }}
      </option>
    </select>
    <div class="flex gap-1 flex-wrap">
      <button @click="usersToAdd.delete(user)" class="rounded px-2 py-1 bg-gray-100 flex gap-1 items-center"
              v-for="(user, index) in usersToAdd" :key="index">
        {{ user.username }}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <button @click="emitCreateChat"
            class="text-sm p-2 border rounded bg-blue-500 text-white hover:bg-blue-600 self-end">Create
    </button>
  </section>
</template>