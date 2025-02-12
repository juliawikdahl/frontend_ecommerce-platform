<template>
  <div class="container mt-4">
    <h1>{{ categoryName }}</h1>
    <div v-if="loading" class="spinner">Laddar...</div>
    <div v-else-if="categoryList.length === 0">
      <p>Det finns inga produkter i den här kategorin.</p>
    </div>
    <div v-else>
      <AllProductsList :products="categoryList" />
    </div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AllProductsList from '@/components/products/AllProductsList.vue';  

export default {
  name: 'CategoryView',
  components: {
    AllProductsList,
  },
  computed: {
    ...mapState('products', ['products', 'error']),
    categoryList() {
      return this.products.products || [];
    },
    categoryName() {
      return this.products.categoryName || 'Okänd kategori';
    },
    loading() {
      return this.products.loading && !this.categoryList.length;
    },
    errorMessage() {
      return this.error;
    },
  },
  methods: {
    ...mapActions('products', ['fetchProductsByCategory']),
  },
  watch: {
    '$route.params.categoryId': {
      immediate: true,
      handler(newCategoryId) {
        if (newCategoryId) {
          this.fetchProductsByCategory(newCategoryId);
        }
      },
    },
  },
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
