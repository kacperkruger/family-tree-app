<script setup lang="ts">
import SideMenuComponent from "@/components/SideMenuComponent.vue";
import type { Person } from "@/data/person";
import type { PropType } from "vue";
import { ref, watch } from "vue";
import { useFamilyTreeStore } from "@/stores/familyTree";
import { clone } from "lodash";
import { storeToRefs } from "pinia";

const parentToAdd = ref();
const partnerToAdd = ref();
const optionalParentToAdd = ref();


const props = defineProps({
  isOpenEditPerson: { type: Boolean, required: true },
  selectedPerson: { type: Object as PropType<Person> | undefined, required: true },
  parents: { type: Object as PropType<Set<Person>>, required: true },
  partners: { type: Object as PropType<Set<Person>>, required: true },
  optionalParents: { type: Object as PropType<Set<Person>>, required: true }
});

const emits = defineEmits<{
  (e: "closeEditPersonMenu"): void,
}>();


const copySelectedPerson = ref<Person | undefined>(clone(props.selectedPerson));
const copyParents = ref<Set<Person>>(new Set(clone(props.parents)));
const copyPartners = ref<Set<Person>>(new Set(clone(props.partners)));
const copyOptionalParents = ref<Set<Person>>(new Set(clone(props.optionalParents)));

watch(props, () => {
  copySelectedPerson.value = clone(props.selectedPerson);
  copyParents.value = clone(props.parents);
  copyPartners.value = clone(props.partners);
  copyOptionalParents.value = clone(props.optionalParents);
});

const familyTreeStore = useFamilyTreeStore();
const { familyTree, editErrorMessage } = storeToRefs(familyTreeStore);

const updatePersonPersonalInfo = async () => {
  if (!copySelectedPerson.value) return;

  const updatedParentsId = [...copyParents.value].map(parent => parent.id);
  const updatedPartnersId = [...copyPartners.value].map(partner => partner.id);
  const updatedOptionalParentsId = [...copyOptionalParents.value].map(optionalParent => optionalParent.id);

  const personRequest = {
    name: copySelectedPerson.value.name,
    surname: copySelectedPerson.value.surname,
    gender: copySelectedPerson.value.gender,
    dateOfBirth: copySelectedPerson.value.dateOfBirth || "",
    parents: updatedParentsId,
    partners: updatedPartnersId,
    optionalParents: updatedOptionalParentsId
  };

  await familyTreeStore.editPerson(copySelectedPerson.value.id, personRequest);

  if (editErrorMessage.value) return;
  emits("closeEditPersonMenu");
};

const addParent = () => {
  copyParents.value.add(JSON.parse(parentToAdd.value));
  parentToAdd.value = undefined;
};

const addPartner = () => {
  copyPartners.value.add(JSON.parse(partnerToAdd.value));
  partnerToAdd.value = undefined;
};

const addOptionalParent = () => {
  copyOptionalParents.value.add(JSON.parse(optionalParentToAdd.value));
  optionalParentToAdd.value = undefined;
};
</script>

<template>
  <SideMenuComponent v-if="copySelectedPerson" :menu-status="isOpenEditPerson"
                     @closeMenu="emits('closeEditPersonMenu')">
    <div class="flex flex-col gap-2 h-full justify-center">
      <input v-model.trim="copySelectedPerson.name" type="text" placeholder="Name*" class="border w-full rounded p-2">
      <input v-model.trim="copySelectedPerson.surname" type="text" placeholder="Surname"
             class="border w-full rounded p-2">
      <select v-model="copySelectedPerson.gender" name="gender" id="gender"
              class="border p-2 rounded">
        <option value="" selected>Select Gender</option>
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
              v-for="(person, index) in [...copyOptionalParents].filter(person =>![...copyParents, selectedPerson].some(parent => parent?.id === person.id))"
              :key="index" :value="JSON.stringify(person)">
              {{ person?.name }}
              {{ person?.surname }}
            </option>
          </select>
        </div>
        <div class="flex gap-1 flex-wrap">
          <button @click="copyParents.delete(parent)"
                  class="rounded px-2 py-1 bg-gray-100 flex gap-1 items-center"
                  v-for="(parent, index) in copyParents" :key="index">
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
              v-for="(person, index) in familyTree.filter(person =>![...copyPartners, selectedPerson].some(partner => partner?.id === person.id))"
              :key="index" :value="JSON.stringify(person)">
              {{ person?.name }}
              {{ person?.surname }}
            </option>
          </select>
        </div>
        <div class="flex gap-1 flex-wrap">
          <button @click="copyPartners.delete(partner)" class="rounded px-2 py-1 bg-gray-100 flex gap-1 items-center"
                  v-for="(partner, index) in copyPartners" :key="index">
            {{ partner?.name }} {{ partner?.surname }}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-2 p-2">
        <div class="flex items-center gap-1">
          <p>Optional partners:</p>
          <select v-model="optionalParentToAdd" @change="addOptionalParent" name="optionalPartners"
                  id="optionalPartners"
                  class="w-full p-2 border rounded">
            <option :value="undefined" disabled selected="selected">Add Optional Parent</option>
            <option
              v-for="(person, index) in familyTree.filter(person =>![...copyOptionalParents, selectedPerson].some(optionalParent => optionalParent?.id === person.id))"
              :key="index" :value="JSON.stringify(person)">
              {{ person?.name }}
              {{ person?.surname }}
            </option>
          </select>
        </div>
        <div class="flex gap-1 flex-wrap">
          <button @click="copyOptionalParents.delete(partner)"
                  class="rounded px-2 py-1 bg-gray-100 flex gap-1 items-center"
                  v-for="(partner, index) in copyOptionalParents" :key="index">
            {{ partner?.name }} {{ partner?.surname }}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <p class="text-red-600">
        {{ editErrorMessage }}
      </p>
      <button @click="updatePersonPersonalInfo"
              class="border-blue-500 hover:bg-blue-600 p-2 rounded bg-blue-500 text-white w-full self-end">Edit
        Person
      </button>
    </div>
  </SideMenuComponent>
</template>