<script setup lang="ts">
import { ref } from "vue";
import { useFamilyTreeStore } from "@/stores/familyTree";
import SideMenuComponent from "@/components/SideMenuComponent.vue";

defineProps({
  "isOpenAddPerson": { type: Boolean, required: true }
});

const emits = defineEmits<{
  (e: "setIsOpenAddPerson", value: Boolean): void
}>();

const familyTreeStore = useFamilyTreeStore();
const name = ref("");
const surname = ref("");
const gender = ref("");
const dateOfBirth = ref<Date | undefined>(undefined);

const addPerson = async () => {
  const personRequest = {
    name: name.value,
    surname: surname.value,
    gender: gender.value,
    dateOfBirth: dateOfBirth.value?.toString() || ""
  };

  await familyTreeStore.addPerson(personRequest);
  emits("setIsOpenAddPerson", false);

  name.value = "";
  surname.value = "";
  gender.value = "";
  dateOfBirth.value = undefined;
};
</script>

<template>
  <SideMenuComponent :menu-status="isOpenAddPerson" @closeMenu="emits('setIsOpenAddPerson', false)">
    <div class="flex flex-col gap-2 h-full justify-center">
      <input v-model="name" type="text" placeholder="Name*" class="border w-full rounded p-2">
      <input v-model="surname" type="text" placeholder="Surname" class="border w-full rounded p-2">
      <input v-model="gender" type="text" placeholder="Gender" class="border w-full rounded p-2">
      <input v-model="dateOfBirth" type="date" class="border w-full rounded p-2">
      <button @click="addPerson"
              class="border-blue-500 hover:bg-blue-600 p-2 rounded bg-blue-500 text-white w-full self-end">Add
        Person
      </button>
    </div>
  </SideMenuComponent>
</template>