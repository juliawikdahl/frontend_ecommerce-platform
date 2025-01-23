<template>
    <div>
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input v-model="email" type="email" class="form-control" id="email" required>
          <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password" required>
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="rememberMe">
          <label class="form-check-label" for="rememberMe">Remember me</label>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <p v-if="loginError">{{ loginError }}</p>
      <div class="mt-3">
        <p>Not registered yet? <router-link to="/register" class="btn btn-link">Register here</router-link></p>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  export default {
    name: 'LoginForm',
    data() {
      return {
        email: '',
        password: ''
      };
    },
    computed: {
      ...mapGetters('auth', ['loginError']),
    },
    methods: {
      ...mapActions('auth', ['login']),
      async submitForm() {
        const credentials = {
          email: this.email,
          password: this.password,
        };
        await this.login(credentials)
        if(!this.loginError) {
          this.$router.push({name:'home'});
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Lägg till stil för LoginForm här */
  </style>
  