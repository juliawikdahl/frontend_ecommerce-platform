<template>
  <div id="app">
    <AppNavbar :categories="categories" />
    <AppFooter />
    <router-view />
  </div>
</template>

<script>
import AppNavbar from '@/components/Layout/AppNavbar.vue';
import AppFooter from './components/Layout/AppFooter.vue';
import { getCategories } from '@/api/categories';


export default {
  name: 'App',
  components: {
    AppNavbar,
    AppFooter
  },
  data() {
    return {
      categories: [] 
    };
  }, methods: {
  async fetchCategories() {
    try {
      this.categories = await getCategories();
      console.log('Hämtade kategorier:', this.categories);
      
      // Logga detaljerade subkategorier
      this.categories.forEach((category) => {
        console.log(`Kategori: ${category.name}, Subkategorier: `, category.subCategories);
      });
    } catch (error) {
      console.error('Fel vid hämtning av kategorier:', error);
    }
  },
  
},

  mounted() {
    this.fetchCategories();
  }
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
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
