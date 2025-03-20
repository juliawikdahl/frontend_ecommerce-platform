<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="submitForm">
      <div class="form-group">
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="email"
          placeholder="Enter your email"
          required
        />
        <div class="form-text">We'll never share your email with anyone else.</div>
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
      <div class="form-check">
        <input type="checkbox" class="form-check-input" id="rememberMe" />
        <label class="form-check-label" for="rememberMe">Remember me</label>
      </div>
      <button type="submit" class="btn-login">Login</button>
      <p v-if="loginError" class="error-message">{{ loginError }}</p>
      <div class="register-link">
        <p>
          Not registered yet?
          <router-link to="/register">Register here</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
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
      await this.login(credentials);
      if (!this.loginError) {
        this.$router.push({ name: 'homeView' });
      }
    },
  },
};
</script>

<style scoped>
/* Styling för inloggningsformuläret */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
 
  padding: 20px;
}

.login-form {
  background-color: #ffffff; 
  padding: 30px;
  border-radius: 12px; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
  width: 100%;
  max-width: 400px;

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

.form-text {
  font-size: 12px;
  color: #888;
}

.form-check {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.form-check-input {
  margin-right: 10px;
}

.btn-login {
  color: white;
  padding: 10px 20px;
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

.register-link {
  text-align: center;
  margin-top: 15px;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
