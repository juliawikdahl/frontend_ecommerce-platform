<template>
  <div class="container mt-4">
    <h1>{{ subCategoryName }}</h1>
    <div v-if="loading" class="spinner">Loading...</div>
    <div v-else> 
      <AllProductsList :products="products" />
    </div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { getProductBySubCategory } from '@/api/products.js';
import AllProductsList from '@/components/products/AllProductsList.vue';

export default {
  name: 'subCategoryView',
  components: {
    AllProductsList
  },
  data() {
    return {
      products: [],
      loading: true,
      errorMessage: '',
      subCategoryId: null,
      subCategoryName: '',
    };
  },
  methods: {
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
    '$route.params.subCategoryId'(newSubCategoryId) {
      this.subCategoryId = newSubCategoryId;
      this.loading = true;
      this.fetchSubCategoryProducts();
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
