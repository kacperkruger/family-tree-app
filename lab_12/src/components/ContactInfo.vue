<template>
  <li>
    <h2>{{ name }} <img v-if="isFriend" class="friendIcon" src="friends.png" alt=""></h2>
    <button @click="handleFriend">{{ friendButtonText }}</button>
    <button @click="handleDetails">{{ detailsButtonText }}</button>
    <details-info v-if="isDetailsOpen"/>
  </li>
</template>

<script>
import DetailsInfo from "@/components/DetailsInfo";

export default {
  props: ['name', 'phoneNumber', 'emailAddress', 'friend'],
  data() {
    return {
      isFriend: this.friend,
      isDetailsOpen: false,
    };
  },
  methods: {
    handleFriend() {
      this.isFriend = !this.isFriend;
    },
    handleDetails() {
      this.isDetailsOpen = !this.isDetailsOpen
    }
  },
  computed: {
    friendButtonText() {
      if (this.isFriend) return "Usuń ze znajomych"
      return "Dodaj do znajomych"
    },
    detailsButtonText() {
      if (this.isDetailsOpen) return "Ukryj szczegóły"
      return "Pokaż szczegóły"
    }
  },
  provide() {
    return {
      phoneNumber: this.phoneNumber,
      emailAddress: this.emailAddress
    }
  },
  components: {
    DetailsInfo
  }
};
</script>

<style>
.friendIcon {
  margin-left: 10px;
  width: 30px;
}
</style>
