<script setup lang="ts">
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {useUsersStore} from "@/stores/users";
import type {User} from "@/data/user";
import FamilyTreeView from "@/views/FamilyTreeView.vue";
import {storeToRefs} from "pinia";

const userStore = useUsersStore()
const {users} = storeToRefs(userStore)
const route = useRoute();
const username = route.params.username
const user = ref<User>()

onMounted(async () => {
  if (typeof username === 'string') {
    await userStore.getUserByUsername(username)
    user.value = users.value.find(user => user?.username === username)
  }
})
</script>

<template>
  <div class="view items-center flex-col">
    <div v-if="user" class="w-full h-full">
      <p class="text-3xl">{{ user?.username }}</p>
      <FamilyTreeView :read-only="true" :userId="user?._id"/>
    </div>
  </div>
</template>