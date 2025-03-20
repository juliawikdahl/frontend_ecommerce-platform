<template>
  <div class="mt-4">
    <div v-if="loading" class="spinner">Loading...</div>
    <div v-else>
      <h1>All products</h1>
      <AllProductsList :products="allProducts" :isAdmin="false"  />
    </div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AllProductsList from '@/components/products/AllProductsList.vue';  // Importera komponenten

export default {
  name: 'AllProductsView',
  components: {
    AllProductsList
  },
  data() {
    return {
      loading: true,     // För att visa laddningsindikator
      errorMessage: ''   // För att visa eventuella fel
    };
  },
  computed: {
    ...mapGetters('products', ['allProducts']),
  },
  methods: {
    ...mapActions('products', ['loadAllProducts']),
  },
  async mounted() {
   try {
    await this.loadAllProducts();
   } catch (error) {
    this.errorMessage = "Kunde inte hämta produkter.";
   } finally {
    this.loading = false;
   }
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
}
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
