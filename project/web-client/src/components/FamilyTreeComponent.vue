<script setup lang="ts">
import {inject, onMounted, ref, watch} from "vue";
import FamilyTree from "@balkangraph/familytree.js";
import {useAuthenticationStore} from "@/stores/authentication";
import {useFamilyTreeStore} from "@/stores/familyTree";
import {storeToRefs} from "pinia";

const authStore = useAuthenticationStore()
const { loggedUser } = storeToRefs(authStore)
const treeStore = useFamilyTreeStore()
const { familyTree } = storeToRefs(treeStore)

const tree = ref('')
const userId = inject<string>('userId')

const emit = defineEmits<{
  (e: 'openPersonDetailsMenu'): void
  (e: 'selectPerson', personId: string | number | undefined): void
}>()

const displayFamilyTree = async () => {
  FamilyTree.templates.myTemplate = Object.assign({}, FamilyTree.templates.base);
  FamilyTree.templates.myTemplate.size = [150, 150];
  FamilyTree.templates.myTemplate.node =
      '<circle cx="75" cy="75" r="75" fill="#4D4D4D" stroke-width="1" stroke="#aeaeae"></circle>';
  FamilyTree.templates.myTemplate.defs = '';

  FamilyTree.templates.myTemplate.field_0 = '<text data-width="150" data-text-overflow="ellipsis" style="font-size: 24px;" fill="#ffffff" x="75" y="75" text-anchor="middle">{val}</text>';
  FamilyTree.templates.myTemplate.field_1 = '<text data-width="150" data-text-overflow="ellipsis" style="font-size: 16px;" fill="#ffffff" x="75" y="95" text-anchor="middle">{val}</text>';
  FamilyTree.templates.myTemplate.link =
      '<path stroke="#686868" stroke-width="1px" fill="none" data-l-id="[{id}][{child-id}]" d="M{xa},{ya} C{xb},{yb} {xc},{yc} {xd},{yd}" />';

  FamilyTree.templates.myTemplate_male = Object.assign({}, FamilyTree.templates.myTemplate);
  FamilyTree.templates.myTemplate_male.node = '<circle cx="75" cy="75" r="75" fill="#039be5" stroke-width="1" stroke="#aeaeae""></circle>';
  FamilyTree.templates.myTemplate_female = Object.assign({}, FamilyTree.templates.myTemplate);
  FamilyTree.templates.myTemplate_female.node = '<circle cx="75" cy="75" r="75" fill="#FF46A3" stroke-width="1" stroke="#aeaeae""></circle>';

  const family = new FamilyTree(tree.value, {
    template: "myTemplate",
    scaleInitial: FamilyTree.match.boundary,
    enableSearch: false,
    mouseScrool: FamilyTree.action.none,
    nodeBinding: {
      field_0: "name",
      field_1: "surname",
    },
    nodeMouseClick: undefined
  });

  if (userId === loggedUser.value?._id) {
    await treeStore.getFamilyTree();
    family.load(familyTree.value)
  } else if (userId) {
    const nodes = await treeStore.getUsersFamilyTree(userId)
    family.load(nodes)
  } else {
    family.load([])
  }
  family.onNodeClick(({node}) => {
    emit('openPersonDetailsMenu')
    emit('selectPerson', node.id)
  })
}

onMounted( () => {
  displayFamilyTree()
})

if (userId === loggedUser.value?._id) {
  watch(familyTree, () => {
    displayFamilyTree()
  })
}

</script>

<template>
  <div>
    <div id="tree" ref="tree"></div>
  </div>
</template>

<style scoped>

</style>