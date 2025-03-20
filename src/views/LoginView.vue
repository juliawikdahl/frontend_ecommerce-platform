<template>
    <div>
      <h1>Welcome to login</h1>
      <LoginForm />
    </div>
  </template>
  
  <script>
  import LoginForm from '@/components/users/LoginForm.vue';
  
  export default {
    name: 'LoginView',
    components: {
      LoginForm
    }
  };
  </script>
  
  <style scoped>
 
  </style>
  