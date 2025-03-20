<template>
  <div class="search-results">
    <h1>Search Results</h1>

    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-else>
      <div v-if="products.length === 0" class="no-results">
        <p>No product was found, try something else.</p>
      </div>

      <AllProductsList :products="products" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import AllProductsList from '@/components/products/AllProductsList.vue';

export default {
  name: 'SearchResultsView',
  components: {
    AllProductsList,
  },
  data() {
    return {
      searchQuery: this.$route.query.query || '',
      products: [],
      loading: true,
    };
  },
  watch: {
    '$route.query.query': 'fetchProducts'
  },
  created() {
    console.log("Sökfråga från URL:", this.searchQuery);
    this.fetchProducts();
  },
  methods: {
    ...mapActions('products', ['searchProducts', 'loadAllProducts']),
    async fetchProducts() {
      this.loading = true;
      this.searchQuery = this.$route.query.query || '';
      console.log("Startar sökningen efter produkter med query:", this.searchQuery);
      
      if (this.$store.state.products.products.length === 0) {
        await this.loadAllProducts();
      }

      const results = await this.searchProducts(this.searchQuery);
      console.log("Sökresultat:", results);

      this.products = results;
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.search-results {
  padding: 20px;
}

.loading {
  text-align: center;
  font-size: 18px;
}

.no-results {
  text-align: center;
  font-size: 18px;
  color: #888;
}
</style>
