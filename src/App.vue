<template>
  <div id="app">
    <AppNavbar />
    <AppFooter />
    <router-view />
  </div>
</template>

<script>
import AppNavbar from '@/components/Layout/AppNavbar.vue';
import AppFooter from './components/Layout/AppFooter.vue';



export default {
  name: 'App',
  components: {
    AppNavbar,
    AppFooter
  },
 
};
</script>

<style>

/* Global styling för applikationen */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
}

#app {
  min-height: 100vh;
  text-align: center;
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
