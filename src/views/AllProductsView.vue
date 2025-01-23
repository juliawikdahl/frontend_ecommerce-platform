<template>
  <div>
    <div v-if="loading" class="spinner">Laddar...</div>
    <div v-else>
      <AllProductsList :products="products" />
    </div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { getAllProducts } from '@/api/products.js';  // Importera getAllProducts-funktionen
import AllProductsList from '@/components/products/AllProductsList.vue';  // Importera komponenten

export default {
  name: 'AllProductsView',
  components: {
    AllProductsList
  },
  data() {
    return {
      products: [],      // För lagring av hämtade produkter
      loading: true,     // För att visa laddningsindikator
      errorMessage: ''   // För att visa eventuella fel
    };
  },
  methods: {
    // Använd vår API-funktion för att hämta produkter
    async fetchProducts() {
      try {
        this.products = await getAllProducts(); // Vänta på att produkterna ska hämtas
        this.loading = false; // Döljer laddningsindikator
      } catch (error) {
        this.errorMessage = 'Något gick fel vid hämtning av produkter.';
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchProducts();  // Hämta produkter när komponenten laddas
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
