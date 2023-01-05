<template>
  <div>
    Dodawanie kontaktu
    <label for="name">Name:</label><input v-model="name" id="name"/>
    <label for="email">Email:</label><input v-model="email" id="email"/>
    <label for="age">Age:</label><input v-model="age" id="age"/>
    <label for="address">Address:</label><input v-model="address" id="address"/>
  </div>
  <button @click="addContact">Dodaj</button>
</template>

<script>
import axios from "axios";

export default {
  props: ['item'],
  created() {
    console.log("Edycja kontaktu");
  },
  data() {
    return {
      name: '',
      email: '',
      age: 0,
      address: ''
    }
  },
  methods: {
    addContact() {
      console.log("Dodawanie kontalktu");
      axios.post('http://localhost:5000/persons', {
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
