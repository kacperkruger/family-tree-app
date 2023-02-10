<script lang="ts" setup>
import { ref } from "vue";
import type { Person } from "@/data/person";
import { useFamilyTreeStore } from "@/stores/familyTree";
import FamilyTreeComponent from "@/components/FamilyTreeComponent.vue";
import FamilyTreeButtons from "@/components/FamilyTreeButtons.vue";
import AddPersonMenu from "@/components/AddPersonMenu.vue";
import DetailsPersonMenu from "@/components/DetailsPersonMenu.vue";
import EditPersonMenu from "@/components/EditPersonMenu.vue";

const familyTreeStore = useFamilyTreeStore();
const selectedPerson = ref<Person>();

const isOpenPersonDetails = ref(false);
const isOpenEditPerson = ref(false);
const isOpenAddPerson = ref(false);
const isOpenAddRelationship = ref(false);

const parents = ref<Set<Person>>(new Set());
const partners = ref<Set<Person>>(new Set());
const optionalParents = ref<Set<Person>>(new Set());


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

const openEditPersonMenu = () => {
  isOpenAddPerson.value = false;
  isOpenPersonDetails.value = false;
  isOpenAddRelationship.value = false;
  isOpenEditPerson.value = true;
};

const closeEditPersonMenu = () => {
  parents.value = new Set();
  partners.value = new Set();
  optionalParents.value = new Set();
  selectedPerson.value = undefined;
  isOpenEditPerson.value = false;
};

const openPersonDetailsMenu = () => {
  isOpenAddPerson.value = false;
  isOpenEditPerson.value = false;
  isOpenAddRelationship.value = false;
  isOpenPersonDetails.value = true;
};

const selectPerson = (person: Person | undefined): void => {
  selectedPerson.value = person;
  if (selectedPerson.value && selectedPerson.value.parents)
    parents.value = new Set(familyTreeStore.familyTree.filter(person => selectedPerson.value?.parents.some(parentId => person.id === parentId)));
  if (selectedPerson.value && selectedPerson.value.pids)
    partners.value = new Set(familyTreeStore.familyTree.filter(person => selectedPerson.value?.pids.some(partnerId => person.id === partnerId)));
  if (selectedPerson.value && selectedPerson.value.optionalParents)
    optionalParents.value = new Set(familyTreeStore.familyTree.filter(person => selectedPerson.value?.optionalParents.some(optionalParentId => person.id === optionalParentId)));
};
</script>

<template>
  <div class="view flex-col">
    <AddPersonMenu v-if="isOpenAddPerson" :isOpenAddPerson="isOpenAddPerson"
                   @setIsOpenAddPerson="(value: Boolean) => isOpenAddPerson = value" />
    <EditPersonMenu v-if="selectedPerson && !readOnly" v-show="isOpenEditPerson" :isOpenEditPerson="isOpenEditPerson"
                    :optionalParents="optionalParents"
                    :parents="parents" :partners="partners"
                    :selectedPerson="selectedPerson"
                    @closeEditPersonMenu="closeEditPersonMenu" />
    <DetailsPersonMenu v-if="selectedPerson" v-show="isOpenPersonDetails" :isOpenPersonDetails="isOpenPersonDetails"
                       :optionalParents="optionalParents"
                       :parents="parents" :partners="partners" :read-only="readOnly"
                       :selectedPerson="selectedPerson"
                       @openEditPersonMenu="openEditPersonMenu"
                       @setIsOpenPersonDetails="value => isOpenPersonDetails = value"
                       @setSelectedPerson="selectPerson" />
    <FamilyTreeButtons v-if="!readOnly" @openAddPersonMenu="openAddPersonMenu" />
    <FamilyTreeComponent :userId="userId" class="h-full" @openPersonDetailsMenu="openPersonDetailsMenu"
                         @selectPerson="selectPerson" />
  </div>
</template>