<template>
    <div class="product-card">
      <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
        <img :src="product.encodedImage" alt="product.name" class="card-img-top" />
      </router-link>
      <h2>{{ product.name }}</h2>
      <p>{{ product.price }} kr</p>
      <button class="add-to-cart" @click="addToCart" :disabled="Boolean(isCartFull || product.stockQuantity === 0)"  :class="{ disabled: isCartFull }">
        {{ isCartFull || product.stockQuantity === 0 ? 'Slutsåld' : '🛒 Lägg i varukorg '}}
      </button>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'ProductCard',
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    watch: {
  isCartFull(newValue) {
    console.log("isCartFull updated:", newValue);
  }
},

    computed: {
  ...mapGetters(['cart']),
  isCartFull() {
  const existing = this.cart.find(item => item.id === this.product.id);
  console.log("isCartFull computed:", { existing, stock: this.product.stockQuantity });
  return existing && existing.quantity >= this.product.stockQuantity;
}

},
    methods: {
    addToCart() {
    this.$store.dispatch('addToCart', this.product);
  }

    }
  };
  </script>
  
  <style scoped>
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
  
 
  
  .add-to-cart:hover {
    background-color: #0056b3;
  }
  button:disabled {
    pointer-events: none;
    background-color:#f44336b1;
    cursor: not-allowed; 
}


  </style>
  