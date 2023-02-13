<script lang="ts" setup>
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
      <input v-model.trim="copySelectedPerson.name" class="border w-full rounded p-2" placeholder="Name*" type="text">
      <input v-model.trim="copySelectedPerson.surname" class="border w-full rounded p-2" placeholder="Surname"
             type="text">
      <select id="gender" v-model="copySelectedPerson.gender" class="border p-2 rounded"
              name="gender">
        <option selected value="">Select Gender</option>
        <option value="male">male</option>
        <option value="female">female</option>
      </select>
      <input v-model.trim="copySelectedPerson.dateOfBirth" class="border w-full rounded p-2" type="date">
      <div class="flex flex-col gap-2 p-2">
        <div class="flex items-center gap-1">
          <p>Parents:</p>
          <select id="parent" v-model="parentToAdd" class="w-full p-2 border rounded" name="parent"
                  @change="addParent">
            <option :value="undefined" disabled selected>Add Parent</option>
            <option
              v-for="(person, index) in [...copyOptionalParents].filter(person =>![...copyParents, selectedPerson].some(parent => parent?.id === person.id))"
              :key="index" :value="JSON.stringify(person)">
              {{ person?.name }}
              {{ person?.surname }}
            </option>
          </select>
        </div>
        <div class="flex gap-1 flex-wrap">
          <button v-for="(parent, index) in copyParents"
                  :key="index"
                  class="rounded px-2 py-1 bg-gray-100 flex gap-1 items-center" @click="copyParents.delete(parent)">
            {{ parent?.name }} {{ parent?.surname }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-2 p-2">
        <div class="flex items-center gap-1">
          <p>Partners:</p>
          <select id="partner" v-model="partnerToAdd" class="w-full p-2 border rounded" name="partner"
                  @change="addPartner">
            <option :value="undefined" disabled selected>Add Partner</option>
            <option
              v-for="(person, index) in familyTree.filter(person =>![...copyPartners, selectedPerson].some(partner => partner?.id === person.id))"
              :key="index" :value="JSON.stringify(person)">
              {{ person?.name }}
              {{ person?.surname }}
            </option>
          </select>
        </div>
        <div class="flex gap-1 flex-wrap">
          <button v-for="(partner, index) in copyPartners" :key="index"
                  class="rounded px-2 py-1 bg-gray-100 flex gap-1 items-center" @click="copyPartners.delete(partner)">
            {{ partner?.name }} {{ partner?.surname }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-2 p-2">
        <div class="flex items-center gap-1">
          <p>Optional partners:</p>
          <select id="optionalPartners" v-model="optionalParentToAdd" class="w-full p-2 border rounded"
                  name="optionalPartners"
                  @change="addOptionalParent">
            <option :value="undefined" disabled selected>Add Optional Parent</option>
            <option
              v-for="(person, index) in familyTree.filter(person =>![...copyOptionalParents, selectedPerson].some(optionalParent => optionalParent?.id === person.id))"
              :key="index" :value="JSON.stringify(person)">
              {{ person?.name }}
              {{ person?.surname }}
            </option>
          </select>
        </div>
        <div class="flex gap-1 flex-wrap">
          <button v-for="(partner, index) in copyOptionalParents"
                  :key="index"
                  class="rounded px-2 py-1 bg-gray-100 flex gap-1 items-center"
                  @click="copyOptionalParents.delete(partner)">
            {{ partner?.name }} {{ partner?.surname }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <p class="text-red-600">
        {{ editErrorMessage }}
      </p>
      <button class="border-blue-500 hover:bg-blue-600 p-2 rounded bg-blue-500 text-white w-full self-end"
              @click="updatePersonPersonalInfo">Edit
        Person
      </button>
    </div>
  </SideMenuComponent>
</template>