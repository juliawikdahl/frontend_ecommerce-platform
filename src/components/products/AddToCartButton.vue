<template>
  <button 
    class="add-to-cart" 
    @click="addToCart" 
    :disabled="Boolean(isCartFull || product.stockQuantity === 0)" 
    :class="{ disabled: isCartFull, buyButton: showText}">
    <span v-if="isCartFull && !showText || product.stockQuantity === 0"><i class="fa-solid fa-cart-shopping"></i></span>
    <span v-if="isCartFull && showText || product.stockQuantity === 0">Slutsåld</span>
    <span v-else>
      <template v-if="showText">Buy</template>
      <template v-if="!isCartFull && !showText"><i class="fa-solid fa-cart-shopping"></i></template>
    </span>
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
    },
    showText: {
      type: Boolean,
      default: false,
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
.add-to-cart {
  background-color: transparent;
  border: 2px solid #444;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  color: #444;
  transition: transform 0.2s ease-in-out, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.add-to-cart:hover {
  background-color: #e0e0e0;
  color: #222;
  border-color: #222;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

button:disabled {
  color: #b0b0b0;
  pointer-events: none;
  border: none;
}

.buyButton {
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  padding: 12px 150px;
  width: auto;
  height: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s ease-in-out, box-shadow 0.3s ease;
}

.buyButton:hover {
  background-color: #333;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  color: #fff;
}

.buyButton:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.buyButton:disabled {
  background-color: #f0f0f0;
  color: #b0b0b0;
  border: 2px solid #d0d0d0;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
</style>
