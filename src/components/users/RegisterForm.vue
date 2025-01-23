<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input v-model="name" type="text" class="form-control" id="name" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input v-model="email" type="email" class="form-control" id="email" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" id="password" required>
      </div>
      <div class="mb-3">
        <label for="address" class="form-label">Address</label>
        <input v-model="address" type="text" class="form-control" id="address" required>
      </div>
      <div class="mb-3">
        <label for="mobile" class="form-label">Mobile</label>
        <input v-model="mobile" type="text" class="form-control" id="mobile" required>
      </div>
      <div class="mb-3">
        <label for="city" class="form-label">City</label>
        <input v-model="city" type="text" class="form-control" id="city" required>
      </div>
      <div class="mb-3">
        <label for="zipcode" class="form-label">Zipcode</label>
        <input v-model="zipcode" type="text" class="form-control" id="zipcode" required>
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
    <p v-if="registerError" class="text-danger">{{ registerError }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      address: '',
      mobile: '',
      city: '',
      zipcode: '',
    };
  },
  computed: {
    registerError() {
      return this.$store.state.auth.registerError;
    }
  },
  methods: {
    ...mapActions('auth', ['register']),
    async submitForm() {
      const registerData = {
        name: this.name,
        email: this.email,
        password: this.password,
        address: this.address,
        mobile: this.mobile,
        city: this.city,
        zipcode: this.zipcode,
      };
      
      try {
        await this.register(registerData);
        this.$router.push('/login'); // Navigera till login-sidan vid framgång
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
/* Lägg till stil för registreringsformuläret */
</style>
