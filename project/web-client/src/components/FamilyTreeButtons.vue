<script setup lang="ts">
import {computed, ref} from "vue";
import {useFamilyTreeStore} from "@/stores/familyTree";

  const treeStore = useFamilyTreeStore();
  const isAddPersonOpen = ref(false)
  const name = ref('')
  const surname = ref('')
  const gender = ref('')
  const dateOfBirth = ref<Date | undefined>(undefined)

  const addPersonMenuProperties = computed(() => {
    return isAddPersonOpen.value ? '' : 'hidden'
  })

  const addPerson = async () => {
    const personRequest = {
      name: name.value,
      surname: surname.value,
      gender: gender.value,
      dateOfBirth: dateOfBirth.value?.getUTCDate().toString()
    }

    console.log(personRequest)
    await treeStore.addPerson(personRequest)
    isAddPersonOpen.value = false

    name.value = ''
    surname.value = ''
    gender.value = ''
    dateOfBirth.value = undefined
  }

</script>

<template>
  <div :class="`${addPersonMenuProperties} flex flex-col h-full w-3/4 lg:w-1/4 md:w-1/2 border-left absolute right-0 z-10 p-2 gap-4 backdrop-blur`">
    <button @click="isAddPersonOpen = false" class="w-fit">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 hover:stroke-2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <div class="flex flex-col gap-2 h-1/2 justify-end">
      <input v-model="name" type="text" placeholder="Name*" class="border w-full rounded p-2">
      <input v-model="surname" type="text" placeholder="Surname" class="border w-full rounded p-2">
      <input v-model="gender" type="text" placeholder="Gender" class="border w-full rounded p-2">
      <input v-model="dateOfBirth" type="date" class="border w-full rounded p-2">
      <button @click="addPerson" class="border-blue-500 hover:bg-blue-600 p-2 rounded bg-blue-500 text-white w-full self-end">Add Person</button>
    </div>
  </div>
  <div class="flex gap-8 w-full justify-end p-2">
    <button>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 hover:stroke-2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
    <button @click="isAddPersonOpen = true">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 hover:stroke-2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
      </svg>
    </button>
  </div>
</template>

<style scoped>

</style>