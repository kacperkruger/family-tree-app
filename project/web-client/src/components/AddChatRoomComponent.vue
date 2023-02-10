<script lang="ts" setup>
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
  usersToAdd.value = new Set();
};
</script>

<template>
  <section class="flex flex-col gap-4 border p-4 rounded">
    <select id="test" v-model="userToAdd"
            class="border rounded px-4 py-2" name="test" @change="addUser">
      <option :value="undefined" disabled selected="selected">Select user to add</option>
      <option v-for="(user, index) in users.filter(u => ![...usersToAdd].some(uu => uu?._id === u._id))"
              :key="index" :value="JSON.stringify(user)">{{ user.username }}
      </option>
    </select>
    <div class="flex gap-1 flex-wrap">
      <button v-for="(user, index) in usersToAdd" :key="index"
              class="rounded px-2 py-1 bg-gray-100 flex gap-1 items-center" @click="usersToAdd.delete(user)">
        {{ user.username }}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5"
             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
    <button class="text-sm p-2 border rounded bg-blue-500 text-white hover:bg-blue-600 self-end"
            @click="emitCreateChat">Create
    </button>
  </section>
</template>