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
const isOpenAddRelationship = ref(false);

const name = ref("");
const surname = ref("");
const gender = ref("");
const dateOfBirth = ref<Date | undefined>(undefined);

const parents = ref<Set<Person | undefined>>(new Set());
const parentToAdd = ref();
const partnerToAdd = ref();
const partners = ref<Set<Person | undefined>>(new Set());
const nGenerations = ref(0);

defineProps({
  readOnly: { type: Boolean, required: true },
  userId: { type: String, required: true }
});

const openAddPersonMenu = () => {
  isOpenPersonDetails.value = false;
  isOpenEditPerson.value = false;
  isOpenAddRelationship.value = false;
  isOpenAddPerson.value = true;
};

const openAddRelationshipMenu = () => {
  isOpenPersonDetails.value = false;
  isOpenAddPerson.value = false;
  isOpenEditPerson.value = false;
  isOpenAddRelationship.value = true;
};

const openEditPersonMenu = () => {
  isOpenAddPerson.value = false;
  isOpenPersonDetails.value = false;
  isOpenAddRelationship.value = false;
  isOpenEditPerson.value = true;
};

const openPersonDetailsMenu = () => {
  isOpenAddPerson.value = false;
  isOpenEditPerson.value = false;
  isOpenAddRelationship.value = false;
  isOpenPersonDetails.value = true;
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

const editPerson = async () => {
  if (!selectedPerson.value) return;
  familyTreeStore.editPerson(selectedPerson.value.id, {
    name: selectedPerson.value.name,
    surname: selectedPerson.value.surname,
    gender: selectedPerson.value.gender,
    dateOfBirth: selectedPerson.value.dateOfBirth || ""
  });

  const parentsToAdd = [...parents.value]
    .filter(newParent =>
      !selectedPerson.value?.parents.some(parentId => parentId === newParent?.id))
    .filter((person): person is Person => !!person)
    .map(person => person.id);
  const parentsToDelete = selectedPerson.value.parents
    .filter(parentId => ![...parents.value].some(newParent => newParent?.id === parentId));

  const partnersToAdd = [...partners.value]
    .filter(newParent =>
      !selectedPerson.value?.pids.some(partnerId => partnerId === newParent?.id))
    .filter((person): person is Person => !!person)
    .map(person => person.id);
  const partnersToDelete = selectedPerson.value.pids
    .filter(partnerId => ![...partners.value].some(newPartner => newPartner?.id === partnerId));

  const selectedPersonId = selectedPerson.value?.id;

  for (const parentToDeleteId of parentsToDelete) {
    await familyTreeStore.deleteParentRelationship(parentToDeleteId, selectedPersonId);
  }

  for (const parentToAddId of parentsToAdd) {
    await familyTreeStore.addParentRelationship(parentToAddId, selectedPersonId);
  }

  for (const partnerToDeleteId of partnersToDelete) {
    await familyTreeStore.deletePartnerRelationship(partnerToDeleteId, selectedPersonId);
  }

  for (const partnerToAddId of partnersToAdd) {
    await familyTreeStore.addPartnerRelationship(partnerToAddId, selectedPersonId);
  }

  parents.value = new Set();
  partners.value = new Set();
  selectedPerson.value = undefined;
  isOpenEditPerson.value = false;
};

const addParent = () => {
  if (parents.value.size >= 2) return;
  parents.value.add(JSON.parse(parentToAdd.value));
  parentToAdd.value = undefined;
};

const addPartner = () => {
  partners.value.add(JSON.parse(partnerToAdd.value));
  partnerToAdd.value = undefined;
};

const selectPerson = (person: Person | undefined): void => {
  selectedPerson.value = person;
  if (person && person.parents)
    parents.value = new Set(person.parents.map(parentId => familyTreeStore.familyTree.find(personFromTree => personFromTree.id === parentId)));
  if (person && person.pids)
    partners.value = new Set(person.pids.map(partnerId => familyTreeStore.familyTree.find(personFromTree => personFromTree.id === partnerId)));
};
</script>

<template>
  <div class="view flex-col">
    <SideMenuComponent :menu-status="isOpenAddPerson" @closeMenu="isOpenAddPerson = false">
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
    <SideMenuComponent v-if="selectedPerson && !readOnly" :menu-status="isOpenEditPerson"
                       @closeMenu="isOpenEditPerson = false">
      <div class="flex flex-col gap-2 h-full justify-center">
        <input v-model.trim="selectedPerson.name" type="text" placeholder="Name*" class="border w-full rounded p-2">
        <input v-model.trim="selectedPerson.surname" type="text" placeholder="Surname"
               class="border w-full rounded p-2">
        <select v-model="selectedPerson.gender" name="gender" id="gender"
                class="border p-2 rounded">
          <option value="" disabled selected>Select Gender</option>
          <option value="male">male</option>
          <option value="female">female</option>
        </select>
        <input v-model.trim="selectedPerson.dateOfBirth" type="date" class="border w-full rounded p-2">
        <div class="flex flex-col gap-2 p-2">
          <div class="flex items-center gap-1">
            <p>Parents:</p>
            <select v-model="parentToAdd" @change="addParent" name="parent" id="parent"
                    class="w-full p-2 border rounded">
              <option :value="undefined" disabled selected="selected">Add Parent</option>
              <option
                v-for="(person, index) in familyTreeStore.familyTree.filter(person =>![...parents, selectedPerson].some(parent => parent?.id === person.id))"
                :key="index" :value="JSON.stringify(person)">
                {{ person?.name }}
                {{ person?.surname }}
              </option>
            </select>
          </div>
          <div class="flex gap-1 flex-wrap">
            <button @click="parents.delete(parent)"
                    class="rounded px-2 py-1 bg-gray-100 flex gap-1 items-center"
                    v-for="(parent, index) in parents" :key="index">
              {{ parent?.name }} {{ parent?.surname }}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex flex-col gap-2 p-2">
          <div class="flex items-center gap-1">
            <p>Partners:</p>
            <select v-model="partnerToAdd" @change="addPartner" name="partner" id="partner"
                    class="w-full p-2 border rounded">
              <option :value="undefined" disabled selected="selected">Add Partner</option>
              <option
                v-for="(person, index) in familyTreeStore.familyTree.filter(person =>![...partners, selectedPerson].some(partner => partner?.id === person.id))"
                :key="index" :value="JSON.stringify(person)">
                {{ person?.name }}
                {{ person?.surname }}
              </option>
            </select>
          </div>
          <div class="flex gap-1 flex-wrap">
            <button @click="partners.delete(partner)" class="rounded px-2 py-1 bg-gray-100 flex gap-1 items-center"
                    v-for="(partner, index) in partners" :key="index">
              {{ partner?.name }} {{ partner?.surname }}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <button @click="editPerson"
                class="border-blue-500 hover:bg-blue-600 p-2 rounded bg-blue-500 text-white w-full self-end">Edit
          Person
        </button>
      </div>
    </SideMenuComponent>
    <SideMenuComponent v-if="selectedPerson" :menu-status="isOpenPersonDetails"
                       @closeMenu="isOpenPersonDetails = false">
      <div class="flex flex-col gap-2 h-full justify-center text-lg">
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
        <div class="flex gap-2">
          <p>Parents:</p>
          <div class="flex gap-1">
            <div v-for="(parent, index) in parents" :key="index">
              <p v-if="parent.surname">{{ parent.name }} {{ parent.surname }},</p>
              <p v-else>{{ parent.name }},</p>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <p>Partners:</p>
          <div v-for="(partner, index) in partners" :key="index">
            <p v-if="partner.surname">{{ partner.name }} {{ partner.surname }},</p>
            <p v-else>{{ partner.name }},</p>
          </div>
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
    <FamilyTreeButtons v-if="!readOnly" @openAddPersonMenu="openAddPersonMenu"
                       @openAddRelationshipMenu="openAddRelationshipMenu" />
    <FamilyTreeComponent :userId="userId" @openPersonDetailsMenu="openPersonDetailsMenu" @selectPerson="selectPerson" />
  </div>
</template>