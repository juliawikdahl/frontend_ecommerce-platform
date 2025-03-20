<template>
  <div id="app">
    <AppNavbar />
    <div class="main-content">
      <router-view :key="$route.fullPath" />
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppNavbar from '@/components/Layout/AppNavbar.vue';
import AppFooter from './components/Layout/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppFooter,
  },
};
</script>

<style>

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  height: 100%;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column; 
}

.main-content {
  flex: 1; 
  margin-top: 6rem;
}

button {
  background-color: black;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #343232;
}
</style>
