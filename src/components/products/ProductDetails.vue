<template>
  <div class="product-detail">
    <!-- Visa produktdetaljer om produkten finns -->
    <div v-if="product" class="product-container">
      <img :src="product.encodedImage" alt="product.name" class="product-image" />
      <div class="product-info">
        <h1 class="product-name">{{ product.name }}</h1>
        <p class="product-description">{{ product.description }}</p>
        <p class="product-price"><strong>{{ product.price }} kr</strong></p>
        <!-- Använd AddToCartButton här också -->
        <AddToCartButton :product="product" />
      </div>
    </div>
    
    <!-- Visa meddelande om ingen produkt finns -->
    <div v-else class="no-product-message">
      <p>Ingen produktdata tillgänglig.</p>
    </div>
  </div>
</template>

<script>
import AddToCartButton from '@/components/products/AddToCartButton.vue';  // Importera AddToCartButton-komponenten

export default {
  name: 'ProductDetail',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  components: {
    AddToCartButton  // Lägg till AddToCartButton som en lokal komponent
  }
};
</script>

<style scoped>
.product-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  min-height: 100vh;
  background-color: #f4f4f4;
}

.product-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  margin: 20px;
  width: 100%;
}

.product-image {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.product-name {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.product-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 20px;
  text-align: center;
  line-height: 1.5;
}

.product-price {
  font-size: 1.3rem;
  color: #27ae60;
  font-weight: bold;
  text-align: center;
}

.no-product-message {
  color: #e74c3c;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
}
</style>
