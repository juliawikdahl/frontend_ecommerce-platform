<template>
  <div class="container mt-4">
    <h1>Alla Produkter</h1>
    <div v-if="products.length === 0" class="no-products">Inga produkter tillgängliga.</div>
    
    <!-- Bootstrap grid system för produktkorten -->
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      <div class="product-card" v-for="product in products" :key="product.id">
        <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
          <img :src="product.encodedImage" alt="product.name" class="card-img-top" />
        </router-link>
        <h2>{{ product.name }}</h2>
        <p>{{ product.price }} kr</p>
        <WishlistButton  :productId="product.id" 
        />
        <AddToCartButton :product="product" />
      </div>
    </div>
  </div>  
</template>

<script>
import AddToCartButton from '@/components/products/AddToCartButton.vue';  // Importera AddToCartButton-komponenten
import WishlistButton from '@/components/products/WishlistButton.vue';

export default {
  name: 'AllProductsList',
  props: {
    products: {
      type: Array,
      required: true
    }
  },
  components: {
    AddToCartButton,
    WishlistButton   
  },
 


};
</script>

<style scoped>
.products {
  display: flex;
  justify-content: center;
}
.product-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  
}

.card-img-top {
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}
</style>
