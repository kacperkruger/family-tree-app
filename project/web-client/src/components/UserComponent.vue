<script setup lang="ts">
import type {User} from "@/data/user/"
import type {PropType} from "vue";
defineProps({
  user: {type: Object as PropType<User>, required: true}
})
</script>

<template>
  <div>{{ user.username }}</div>
</template>

<style scoped>

</style>