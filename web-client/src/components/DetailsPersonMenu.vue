<script lang="ts" setup>
import SideMenuComponent from "@/components/SideMenuComponent.vue";
import { useFamilyTreeStore } from "@/stores/familyTree";
import type { PropType } from "vue";
import { ref } from "vue";
import type { Person } from "@/data/person";
import { storeToRefs } from "pinia";

const props = defineProps({
  isOpenPersonDetails: { type: Boolean, required: true },
  selectedPerson: { type: Object as PropType<Person | undefined>, required: true },
  parents: { type: Object as PropType<Set<Person | undefined>>, required: true },
  partners: { type: Object as PropType<Set<Person | undefined>>, required: true },
  optionalParents: { type: Object as PropType<Set<Person | undefined>>, required: true },
  readOnly: { type: Boolean, required: true }
});

const emits = defineEmits<{
  (e: "setIsOpenPersonDetails", value: boolean): void,
  (e: "setSelectedPerson", value: Person | undefined): void,
  (e: "openEditPersonMenu"): void,
}>();

const familyTreeStore = useFamilyTreeStore();
const { detailsErrorMessage } = storeToRefs(familyTreeStore);
const nGenerations = ref(0);

const deletePerson = async () => {
  await familyTreeStore.deletePerson(props.selectedPerson?.id);
  if (detailsErrorMessage) return;

  emits("setSelectedPerson", undefined);
  emits("setIsOpenPersonDetails", false);
};

const copyPerson = async () => {
  await familyTreeStore.copyPerson(props.selectedPerson?.id, nGenerations.value);
  nGenerations.value = 0;
  if (detailsErrorMessage) return;
  emits("setSelectedPerson", undefined);
  emits("setIsOpenPersonDetails", false);
};

</script>

<template>
  <SideMenuComponent :menu-status="isOpenPersonDetails"
                     @closeMenu="emits('setIsOpenPersonDetails', false)">
    <div class="flex flex-col gap-2 h-full justify-center text-lg">
      <div class="flex gap-2">
        <p>Name:</p>
        <p>{{ selectedPerson?.name }}</p>
      </div>
      <div class="flex gap-2">
        <p>Surname:</p>
        <p>{{ selectedPerson?.surname }}</p>
      </div>
      <div class="flex gap-2">
        <p>Gender:</p>
        <p>{{ selectedPerson?.gender }}</p>
      </div>
      <div class="flex gap-2">
        <p>Date of birth:</p>
        <p>{{ selectedPerson?.dateOfBirth }}</p>
      </div>
      <div class="flex gap-2">
        <p>Parents:</p>
        <div class="flex gap-1">
          <div v-for="(parent, index) in parents" :key="index">
            <p v-if="parent?.surname">{{ parent?.name }} {{ parent?.surname }},</p>
            <p v-else>{{ parent?.name }},</p>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p>Partners:</p>
        <div v-for="(partner, index) in partners" :key="index">
          <p v-if="partner?.surname">{{ partner?.name }} {{ partner?.surname }},</p>
          <p v-else>{{ partner?.name }},</p>
        </div>
      </div>
      <div class="flex gap-2">
        <p>Optional parents:</p>
        <div v-for="(optionalParent, index) in optionalParents" :key="index">
          <p v-if="optionalParent?.surname">{{ optionalParent?.name }} {{ optionalParent?.surname }},</p>
          <p v-else>{{ optionalParent?.name }},</p>
        </div>
      </div>
      <div class="flex gap-1 w-full justify-end">
        <div class="flex gap-1 p-2 border-yellow-500 text-white rounded text-sm bg-yellow-500 hover:bg-yellow-600">
          <button @click="copyPerson"
          >Copy
          </button>
          <select id="nGenerations"
                  v-model="nGenerations"
                  class="text-black cursor-pointer"
                  name="nGenerations">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <p class="text-red-600">
          {{ detailsErrorMessage }}
        </p>
        <button v-if="!readOnly" class="p-2 border-green-500 text-white rounded text-sm bg-green-500 hover:bg-green-600"
                @click="emits('openEditPersonMenu')">Edit
        </button>
        <button v-if="!readOnly" class="p-2 border-red-500 text-white rounded text-sm bg-red-500 hover:bg-red-600"
                @click="deletePerson">Delete
        </button>
      </div>
    </div>
  </SideMenuComponent>
</template>