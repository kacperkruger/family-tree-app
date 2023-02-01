<script setup lang="ts">
import SideMenuComponent from "@/components/SideMenuComponent.vue";
import { ref } from "vue";
import type { Person } from "@/data/person";
import { useFamilyTreeStore } from "@/stores/familyTree";
import FamilyTreeComponent from "@/components/FamilyTreeComponent.vue";
import FamilyTreeButtons from "@/components/FamilyTreeButtons.vue";

const familyTreeStore = useFamilyTreeStore();
const selectedPerson = ref<Person>();

const isOpenPersonDetails = ref(false);
const isOpenEditPerson = ref(false);
const isOpenAddPerson = ref(false);

const name = ref("");
const surname = ref("");
const gender = ref("");
const dateOfBirth = ref<Date | undefined>(undefined);

const nGenerations = ref(0);

defineProps({
  readOnly: { type: Boolean, required: true },
  userId: { type: String, required: true }
});

const openAddPersonMenu = () => {
  isOpenPersonDetails.value = false;
  isOpenEditPerson.value = false;
  isOpenAddPerson.value = true;
};

const addPerson = async () => {
  const personRequest = {
    name: name.value,
    surname: surname.value,
    gender: gender.value,
    dateOfBirth: dateOfBirth.value?.toString() || ""
  };

  await familyTreeStore.addPerson(personRequest);
  isOpenAddPerson.value = false;

  name.value = "";
  surname.value = "";
  gender.value = "";
  dateOfBirth.value = undefined;
};

const openEditPersonMenu = () => {
  isOpenAddPerson.value = false;
  isOpenPersonDetails.value = false;
  isOpenEditPerson.value = true;
};

const openPersonDetailsMenu = () => {
  isOpenAddPerson.value = false;
  isOpenEditPerson.value = false;
  isOpenPersonDetails.value = true;
};

const deletePerson = () => {
  familyTreeStore.deletePerson(selectedPerson.value?.id);
  selectedPerson.value = undefined;
  isOpenPersonDetails.value = false;
};

const copyPerson = () => {
  familyTreeStore.copyPerson(selectedPerson.value?.id, nGenerations.value);
  nGenerations.value = 0;
  selectedPerson.value = undefined;
  isOpenPersonDetails.value = false;
};

const editPerson = () => {
  if (!selectedPerson.value) return;
  familyTreeStore.editPerson(selectedPerson.value.id, {
    name: selectedPerson.value.name,
    surname: selectedPerson.value.surname,
    gender: selectedPerson.value.gender,
    dateOfBirth: selectedPerson.value.dateOfBirth || ""
  });
  selectedPerson.value = undefined;
  isOpenEditPerson.value = false;
};

const selectPerson = (person: Person | undefined): void => {
  selectedPerson.value = person;
};
</script>

<template>
  <div class="view flex-col">
    <SideMenuComponent :menu-status="isOpenAddPerson" @closeMenu="isOpenAddPerson = false">
      <div class="flex flex-col gap-2 h-1/2 justify-end">
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
    <SideMenuComponent v-if="selectedPerson && !readOnly" :menu-status="isOpenEditPerson"
                       @closeMenu="isOpenEditPerson = false">
      <div class="flex flex-col gap-2 h-1/2 justify-end">
        <input v-model.trim="selectedPerson.name" type="text" placeholder="Name*" class="border w-full rounded p-2">
        <input v-model.trim="selectedPerson.surname" type="text" placeholder="Surname"
               class="border w-full rounded p-2">
        <input v-model.trim="selectedPerson.gender" type="text" placeholder="Gender" class="border w-full rounded p-2">
        <input v-model.trim="selectedPerson.dateOfBirth" type="date" class="border w-full rounded p-2">
        <button @click="editPerson"
                class="border-blue-500 hover:bg-blue-600 p-2 rounded bg-blue-500 text-white w-full self-end">Edit
          Person
        </button>
      </div>
    </SideMenuComponent>
    <SideMenuComponent v-if="selectedPerson" :menu-status="isOpenPersonDetails"
                       @closeMenu="isOpenPersonDetails = false">
      <div class="flex flex-col gap-2 h-1/2 justify-end text-lg">
        <div class="flex gap-2">
          <p>Name:</p>
          <p>{{ selectedPerson.name }}</p>
        </div>
        <div class="flex gap-2">
          <p>Surname:</p>
          <p>{{ selectedPerson.surname }}</p>
        </div>
        <div class="flex gap-2">
          <p>Gender:</p>
          <p>{{ selectedPerson.gender }}</p>
        </div>
        <div class="flex gap-2">
          <p>Date of birth:</p>
          <p>{{ selectedPerson.dateOfBirth }}</p>
        </div>
        <div class="flex gap-1 w-full justify-end">
          <div class="flex gap-1 p-2 border-yellow-500 text-white rounded text-sm bg-yellow-500 hover:bg-yellow-600">
            <button @click="copyPerson"
            >Copy
            </button>
            <select name="nGenerations"
                    class="text-black cursor-pointer"
                    id="nGenerations"
                    v-model="nGenerations">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <button v-if="!readOnly" @click="openEditPersonMenu"
                  class="p-2 border-green-500 text-white rounded text-sm bg-green-500 hover:bg-green-600">Edit
          </button>
          <button v-if="!readOnly" @click="deletePerson"
                  class="p-2 border-red-500 text-white rounded text-sm bg-red-500 hover:bg-red-600">Delete
          </button>
        </div>
      </div>
    </SideMenuComponent>
    <FamilyTreeButtons v-if="!readOnly" @openAddPersonMenu="openAddPersonMenu" />
    <FamilyTreeComponent :userId="userId" @openPersonDetailsMenu="openPersonDetailsMenu" @selectPerson="selectPerson" />
  </div>
</template>