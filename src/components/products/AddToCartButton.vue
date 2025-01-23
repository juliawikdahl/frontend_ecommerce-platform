<template>
    <button 
      class="add-to-cart" 
      @click="addToCart" 
      :disabled="Boolean(isCartFull || product.stockQuantity === 0)" 
      :class="{ disabled: isCartFull }">
      {{ isCartFull || product.stockQuantity === 0 ? 'Slutsåld' : '🛒 Lägg i varukorg '}}
    </button>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'AddToCartButton',
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapGetters(['cart']),
      isCartFull() {
        const existing = this.cart.find(item => item.id === this.product.id);
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

  button:disabled {
    pointer-events: none;
    background-color: #f44336b1;
    cursor: not-allowed;
  }
  </style>
  