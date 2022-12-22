<template>
  <ul>
    <li>
      <strong>telefon:</strong>
      {{ phoneNumber }}
    </li>
    <li>
      <strong>e-mail:</strong>
      {{ emailAddress }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "DetailsInfo",
  inject: ['phoneNumber', 'emailAddress'],
  data() {
    return {
      phone: this.phoneNumber,
      emailAddress: this.emailAddress
    }
  }
}
</script>

<style scoped>

</style>