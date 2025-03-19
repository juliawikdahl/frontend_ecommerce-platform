<template>
    <div class="container mt-4">
        <h1>{{ subCategoryName }}</h1>
      <div v-if="loading" class="spinner">Loading...</div>
      <div v-else> <AllProductsList :products="products" />
      </div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script>
  import { getProductBySubCategory } from '@/api/products.js';  // Importera getAllProducts-funktionen
  import AllProductsList from '@/components/products/AllProductsList.vue';  // Importera komponenten
  
  export default {
    name: 'subCategoryView',
    components: {
      AllProductsList
    },
    data() {
      return {
        products: [],      // För lagring av hämtade produkter
        loading: true,     // För att visa laddningsindikator
        errorMessage: '',   // För att visa eventuella fel
        subCategoryId: null,
        subCategoryName: '',
      };
    },
    methods: {
      // Använd vår API-funktion för att hämta produkter
      async fetchSubCategoryProducts() {
      try {
        const data = await getProductBySubCategory(this.subCategoryId);
        this.products = data || [];
        this.subCategoryName = data[0]?.subCategoryName || 'Unknown Subcategory';
        this.loading = false;
      } catch (error) {
        console.error(error);
        this.loading = false;
      }
},
    },
    mounted() {
        this.subCategoryId = this.$route.params.subCategoryId;
    if (this.subCategoryId) {
      this.fetchSubCategoryProducts();  
    } else {
      this.errorMessage = 'No subcategory chosen';
      this.loading = false;
    }
  },
  watch: {
    // Lägg till en watcher som triggas när subCategoryId ändras i URL
    '$route.params.subCategoryId'(newSubCategoryId) {
      this.subCategoryId = newSubCategoryId; // Uppdatera subCategoryId när det ändras
      this.loading = true; // Visa laddningsindikator igen
      this.fetchSubCategoryProducts(); // Hämta produkter för den nya subkategorin
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
  