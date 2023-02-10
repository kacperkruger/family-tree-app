<script lang="ts" setup>
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
      <input ref="nameElement" v-model="name" class="border w-full rounded p-2" placeholder="Name*" type="text"
             @keydown.enter="addPerson">
      <input v-model="surname" class="border w-full rounded p-2" placeholder="Surname" type="text"
             @keydown.enter="addPerson">
      <input v-model="gender" class="border w-full rounded p-2" placeholder="Gender" type="text">
      <input v-model="dateOfBirth" class="border w-full rounded p-2" type="date">
      <button class="border-blue-500 hover:bg-blue-600 p-2 rounded bg-blue-500 text-white w-full self-end"
              @click="addPerson">Add
        Person
      </button>
    </div>
  </SideMenuComponent>
</template>