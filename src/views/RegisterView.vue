<template>
    <div>
      <h1>Welcome to register</h1>
      <RegisterForm />
    </div>
  </template>
  
  <script>
  import RegisterForm from '@/components/users/RegisterForm.vue';
  
  export default {
    name: 'registerView',
    components: {
        RegisterForm
    }
  };
  </script>
  
  <style scoped>
  /* Lägg till valfri styling här */
  </style>
  