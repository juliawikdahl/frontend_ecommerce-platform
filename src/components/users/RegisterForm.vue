<template>
  <div class="register-container">
    <form class="register-form" @submit.prevent="submitForm">
      <h2 class="form-title">Register</h2>
      <div class="form-group">
        <input 
          v-model="name" 
          type="text" 
          class="form-control" 
          id="name" 
          placeholder="Enter your name" 
          required 
        />
      </div>
      <div class="form-group">
        <input 
          v-model="email" 
          type="email" 
          class="form-control" 
          id="email" 
          placeholder="Enter your email" 
          required 
        />
      </div>
      <div class="form-group">
        <input 
          v-model="password" 
          type="password" 
          class="form-control" 
          id="password" 
          placeholder="Enter your password" 
          required 
        />
      </div>
      <div class="form-group">
        <input 
          v-model="address" 
          type="text" 
          class="form-control" 
          id="address" 
          placeholder="Enter your address" 
          required 
        />
      </div>
      <div class="form-group">
        <input 
          v-model="mobile" 
          type="text" 
          class="form-control" 
          id="mobile" 
          placeholder="Enter your mobile number" 
          required 
        />
      </div>
      <div class="form-group">
        <input 
          v-model="city" 
          type="text" 
          class="form-control" 
          id="city" 
          placeholder="Enter your city" 
          required 
        />
      </div>
      <div class="form-group">
        <input 
          v-model="zipcode" 
          type="text" 
          class="form-control" 
          id="zipcode" 
          placeholder="Enter your zipcode" 
          required 
        />
      </div>
      <button type="submit" class="btn-register">Register</button>
      <p v-if="registerError" class="error-message">{{ registerError }}</p>
    </form>
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
        this.$router.push('/login'); 
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.register-form {
  background-color: #ffffff; 
  padding: 30px;
  border-radius: 12px; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
  width: 100%;
  max-width: 500px;
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
  display: block;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background-color: #fdfdfd;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 3px rgba(0, 123, 255, 0.25);
}

.btn-register {
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.error-message {
  color: #ff4d4d;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
</style>
