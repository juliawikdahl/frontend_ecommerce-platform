<template>
    <div class="container mt-4">
        <h1>{{ categoryName }}</h1>
      <div v-if="loading" class="spinner">Laddar...</div>
      <div v-else>
      
        <AllProductsList :products="products" />
      </div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script>
  import { getProductByCategory } from '@/api/products.js';  // Importera getAllProducts-funktionen
  import AllProductsList from '@/components/products/AllProductsList.vue';  // Importera komponenten
  
  export default {
    name: 'categoryView',
    components: {
      AllProductsList
    },
    data() {
      return {
        products: [],      // För lagring av hämtade produkter
        categoryName: '',
        loading: true,     // För att visa laddningsindikator
        errorMessage: '',   // För att visa eventuella fel
        categoryId: null
      };
    },
    methods: {
      // Använd vår API-funktion för att hämta produkter
      async fetchCategoryProducts() {
      try {
        const data = await getProductByCategory(this.categoryId);
        this.products = data.products || [];
        this.categoryName = data.categoryName || 'Okänd kategori';
        this.loading = false;
      } catch (error) {
        this.errorMessage = 'Något gick fel vid hämtning av produkter för denna kategori.';
        console.error(error);
        this.loading = false;
      }
},
    },
    mounted() {
        this.categoryId = this.$route.params.categoryId;
    if (this.categoryId) {
      this.fetchCategoryProducts();  // Hämta produkter för aktuell kategori
    } else {
      this.errorMessage = 'Ingen kategori vald.';
      this.loading = false;
    }
  }
  };
  </script>
  
  <style scoped>
  .spinner {
    text-align: center;
    font-size: 24px;
    color: #333;
  }
  
  .error {
    color: red;
    font-weight: bold;
  }
  </style>
  