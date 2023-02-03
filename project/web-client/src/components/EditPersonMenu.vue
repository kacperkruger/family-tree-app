<script setup lang="ts">
import SideMenuComponent from "@/components/SideMenuComponent.vue";
import type { Person } from "@/data/person";
import type { PropType } from "vue";
import { ref, watch } from "vue";
import { useFamilyTreeStore } from "@/stores/familyTree";

const parentToAdd = ref();
const partnerToAdd = ref();


const props = defineProps({
  isOpenEditPerson: { type: Boolean, required: true },
  selectedPerson: { type: Object as PropType<Person> | undefined, required: true },
  parents: { type: Object as PropType<Set<Person | undefined>>, required: true },
  partners: { type: Object as PropType<Set<Person | undefined>>, required: true }
});

const emits = defineEmits<{
  (e: "setIsOpenEditPerson", value: Boolean): void,
  (e: "setSelectedPerson", value: Person | undefined): void,
  (e: "setParents", value: Set<Person | undefined>): void,
  (e: "setPartners", value: Set<Person | undefined>): void
}>();

watch(props.selectedPerson, () => {
  console.log(props.selectedPerson);
  copySelectedPerson.value = props.selectedPerson;
});
const copySelectedPerson = ref(props.selectedPerson);
const copyParents = ref(props.parents);
const copyPartners = ref(props.partners);

watch(props.parents, () => {
  copyParents.value = props.parents;
});

watch(props.partners, () => {
  copyPartners.value = props.partners;
});

const familyTreeStore = useFamilyTreeStore();

const editPerson = async () => {
  if (!props.selectedPerson) return;
  familyTreeStore.editPerson(props.selectedPerson.id, {
    name: copySelectedPerson.value.name,
    surname: copySelectedPerson.value.surname,
    gender: copySelectedPerson.value.gender,
    dateOfBirth: copySelectedPerson.value.dateOfBirth || ""
  });

  const parentsToAdd = [...copyParents.value]
    .filter(newParent =>
      !props.selectedPerson?.parents.some(parentId => parentId === newParent?.id))
    .filter((person): person is Person => !!person)
    .map(person => person.id);
  const parentsToDelete = props.selectedPerson.parents
    .filter(parentId => ![...copyParents.value].some(newParent => newParent?.id === parentId));

  const partnersToAdd = [...copyPartners.value]
    .filter(newParent =>
      !props.selectedPerson?.pids.some(partnerId => partnerId === newParent?.id))
    .filter((person): person is Person => !!person)
    .map(person => person?.id);
  const partnersToDelete = props.selectedPerson.pids
    .filter(partnerId => ![...copyPartners.value].some(newPartner => newPartner?.id === partnerId));

  const selectedPersonId = props.selectedPerson.id;

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

  emits("setParents", new Set());
  emits("setPartners", new Set());
  emits("setSelectedPerson", undefined);
  emits("setIsOpenEditPerson", false);
};

const addParent = () => {
  if (props.parents.size >= 2) return;
  copyParents.value.add(JSON.parse(parentToAdd.value));
  parentToAdd.value = undefined;
};

const addPartner = () => {
  copyParents.value.add(JSON.parse(partnerToAdd.value));
  partnerToAdd.value = undefined;
};
</script>

<template>
  <SideMenuComponent v-if="copySelectedPerson" :menu-status="isOpenEditPerson"
                     @closeMenu="emits('setIsOpenEditPerson', false)">
    <div class="flex flex-col gap-2 h-full justify-center">
      <input v-model.trim="copySelectedPerson.name" type="text" placeholder="Name*" class="border w-full rounded p-2">
      <input v-model.trim="copySelectedPerson.surname" type="text" placeholder="Surname"
             class="border w-full rounded p-2">
      <select v-model="copySelectedPerson.gender" name="gender" id="gender"
              class="border p-2 rounded">
        <option value="" disabled selected>Select Gender</option>
        <option value="male">male</option>
        <option value="female">female</option>
      </select>
      <input v-model.trim="copySelectedPerson.dateOfBirth" type="date" class="border w-full rounded p-2">
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
</template>