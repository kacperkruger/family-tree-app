<template>
  <div>
    Edycja kontaktu
    <label for="name">Name:</label><input v-model="name" id="name"/>
    <label for="email">Email:</label><input v-model="email" id="email"/>
    <label for="age">Age:</label><input v-model="age" id="age"/>
    <label for="address">Address:</label><input v-model="address" id="address"/>
  </div>
  <button @click="editContact">Edytuj</button>
</template>

<script>
import axios from "axios";

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  created() {
    console.log("Edycja kontaktu");
  },
  data() {
    return {
      name: this.item.name,
      email: this.item.email,
      age: this.item.age,
      address: this.item.address
    }
  },
  methods: {
    editContact() {
      axios.put(`http://localhost:5000/persons/${this.item.id}`, {
        name: this.name,
        email: this.email,
        age: this.age,
        address: this.address
      }).then(_ => {
        this.$router.push({
          name: 'ContactDetails' // ,
          // params: {id: this.item.id } // niepotrzebne
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
