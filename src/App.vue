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
/* Global styling för applikationen */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  height: 100%;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column; /* Gör sidan till en flex-container med vertikal layout */
}

.main-content {
  flex: 1; /* Gör att main-content fyller upp det lediga utrymmet */
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
