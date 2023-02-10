<script lang="ts" setup>
import { onMounted, type Ref, ref, toRaw, watch } from "vue";
import FamilyTree from "@balkangraph/familytree.js";
import { useAuthenticationStore } from "@/stores/authentication";
import { useFamilyTreeStore } from "@/stores/familyTree";
import { storeToRefs } from "pinia";
import type { Person } from "@/data/person";
import LoadingComponent from "@/components/LoadingComponent.vue";
import buildFamilyTree from "@/utils/buildFamilyTree";

const props = defineProps({
  userId: { type: String, required: true }
});

const authStore = useAuthenticationStore();
const { loggedUser } = storeToRefs(authStore);
const treeStore = useFamilyTreeStore();
const { familyTree, isLoading } = storeToRefs(treeStore);

const tree = ref("");
const family = ref<FamilyTree>();
const fetchedNodes = ref() as Ref<Person[]>;

const emit = defineEmits<{
  (e: "openPersonDetailsMenu"): void
  (e: "selectPerson", person: Person | undefined): void
}>();

const onNodeClick = (node: FamilyTree.node) => {
  emit("selectPerson", fetchedNodes.value.find(person => person.id === node.id));
  emit("openPersonDetailsMenu");
};

onMounted(async () => {
  if (props.userId === loggedUser.value?._id) {
    await treeStore.getFamilyTree();
    fetchedNodes.value = familyTree.value;
    family.value = buildFamilyTree(tree.value, familyTree.value, onNodeClick);
  } else {
    const nodes = await treeStore.getUsersFamilyTree(props.userId);
    fetchedNodes.value = nodes;
    family.value = buildFamilyTree(tree.value, nodes, onNodeClick);
  }
});

if (props.userId === loggedUser.value?._id) {
  watch(familyTree, async () => {
    fetchedNodes.value = familyTree.value;
    if (!family.value) return;
    if (toRaw(family.value).nodes.length !== toRaw(familyTree.value).length) {
      family.value = buildFamilyTree(tree.value, familyTree.value, onNodeClick);
      return;
    }
    family.value = family.value?.load(familyTree.value);
  }, { deep: true });
}

</script>

<template>
  <div>
    <LoadingComponent v-show="isLoading" />
    <div v-show="!isLoading" id="tree" ref="tree"></div>
  </div>
</template>

<style scoped>

</style>