<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useFamilyTreeStore } from "@/stores/familyTree";
import SideMenuComponent from "@/components/SideMenuComponent.vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import { storeToRefs } from "pinia";

defineProps({
  "isOpenAddPerson": { type: Boolean, required: true }
});

const emits = defineEmits<{
  (e: "setIsOpenAddPerson", value: Boolean): void
}>();

const familyTreeStore = useFamilyTreeStore();
const { isLoading, addErrorMessage } = storeToRefs(familyTreeStore);
const nameElement = ref<HTMLElement>();

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

  if (addErrorMessage) return;
  emits("setIsOpenAddPerson", false);

  name.value = "";
  surname.value = "";
  gender.value = "";
  dateOfBirth.value = undefined;
};

onMounted(() => nameElement.value?.focus());
</script>

<template>
  <SideMenuComponent :menu-status="isOpenAddPerson" @closeMenu="emits('setIsOpenAddPerson', false)">
    <LoadingComponent v-show="isLoading" />
    <div v-show="!isLoading" class="flex flex-col gap-2 h-full justify-center">
      <input v-model="name" @keydown.enter="addPerson" type="text" ref="nameElement" placeholder="Name*"
             class="border w-full rounded p-2">
      <input v-model="surname" @keydown.enter="addPerson" type="text" placeholder="Surname"
             class="border w-full rounded p-2">
      <input v-model="gender" type="text" placeholder="Gender" class="border w-full rounded p-2">
      <input v-model="dateOfBirth" type="date" class="border w-full rounded p-2">
      <button @click="addPerson"
              class="border-blue-500 hover:bg-blue-600 p-2 rounded bg-blue-500 text-white w-full self-end">Add
        Person
      </button>
    </div>
  </SideMenuComponent>
</template>