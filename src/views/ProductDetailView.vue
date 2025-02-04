<template>
    <div class="product-detail-view">
        <div v-if="loading" class="spinner">Laddar...</div>
        <div v-else>
            <ProductDetail :product="product" />
        </div>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
</template>

<script>
 import { getProductById } from '@/api/products';  
 import ProductDetail from '@/components/products/ProductDetails.vue'; 
 export default {
    name: 'ProductDetailView',
    components: {
        ProductDetail
    },
    data () {
        return {
            product: null,
            errorMessage: '',
            loading: true,
        };
    },
    computed: {
        productId() {
            return this.$route.params.id;
        }
    },
    methods: {
        async fetchProduct() {
        try {
            console.log('Fetching product with ID:', this.productId); // Logga productId för att se att den är korrekt
            this.product = await getProductById(this.productId);
            console.log('Fetched product:', this.product);  // Logga den hämtade produkten
            this.loading = false;
        } catch (error) {
            console.error('Error fetching product:', error);
            this.errorMessage = 'Något gick fel när vi hämtade produktinformation.';
            this.loading = false;
        }
    }
    },
    mounted() {
      this.fetchProduct();  // Hämta produkt när komponenten laddas
    },
    watch: {
    // Lägg till en watcher som triggas när productid ändras i URL
    '$route.params.id'(newProductId) {
      this.productId = newProductId; // Uppdatera productid när det ändras
      this.loading = true; 
      this.fetchProduct(); // Hämta produkt för den nya produktdetaljen
    }
  }

 }


</script>
<style scoped>
.product-detail-view {
  padding: 20px;
  text-align: left;
}
.spinner {
  display: flex;
  justify-content: center;
  height: 100vh;
  font-size: 1.5em;
  color: #555;
  text-align: center;
}

.error {
  color: red;
  font-weight: bold;
}
</style>