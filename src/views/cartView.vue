<template>
  <h1>Your cart</h1>
  <div class="cart container">
    <div v-if="cart.length === 0" class="empty-cart">
      Your cart is empty.
    </div>
    <div class="cart-container" v-else>
      <div class="cart-item" v-for="item in cart" :key="item.id">
        <img :src="getImageSource(item)" alt="item.name" class="cart-img" />
        <div class="cart-item-details">
          <router-link :to="{name: 'product-detail', params: {id: item.id}}">
            <h4>{{ item.name }}</h4>
          </router-link>
          <p>{{ item.price }} kr</p>
          <div class="quantity-controls">
            <button class="btn-quantity" @click="updateQuantity(item.id, item.quantity - 1)">-</button>
            <span class="quantity-number">{{ item.quantity }}</span>
            <button class="btn-quantity" @click="updateQuantity(item.id, item.quantity + 1)" :disabled="item.quantity >= item.stockQuantity">+</button>
          </div>
          <p v-if="item.quantity >= item.stockQuantity" class="error-message">
            There is not enough in stock to add more..
          </p>
          <p class="total-text">Total for this product: {{ totalPriceForProduct(item) }} kr</p> 
        </div>
      </div>
      <div class="cart-summary">
        <h2>Total: {{ cartTotal }} kr</h2>
        <button class="checkout-btn" @click="proceedToCheckout">Go to checkout</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['cart', 'cartTotal']),
  },
  mounted() {
    this.$store.dispatch('loadCart');
  },
  methods: {
    ...mapActions(['updateProductQuantity', 'removeProduct']),
    getImageSource(item) {
      if (item.encodedImage && item.encodedImage.startsWith('data:image')) {
        return item.encodedImage;
      }
      if (item.encodedImage) {
        return `data:image/webp;base64,${item.encodedImage}`;
      }
      return 'default-image.jpg';
    },
    updateQuantity(productId, quantity) {
      this.updateProductQuantity({ productId, quantity });
    },
    totalPriceForProduct(item) {
      return item.price * item.quantity;
    },
    async proceedToCheckout() {
      const orderData = {
        orderItems: this.cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        totalAmount: this.cartTotal,
      };

      try {
        const response = await this.$store.dispatch('orders/createOrder', orderData);

        if (response && response.orderId) {
          this.orderId = response.orderId;
          this.$router.push({ name: 'PaymentView', params: { orderId: this.orderId, totalAmount: this.cartTotal } });
        } else {
          console.error('Order ID was not returned from server');
        }
      } catch (error) {
        console.error('Error during order creation:', error);
      }
    },
  },
};
</script>

<style scoped>
h1 {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 3rem;
}
.cart-container {
  width: 80%;
}
.cart {
  max-width: 800px;
  display: flex;
  justify-content: center;
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
}
.empty-cart {
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
}
a {
  color: black;
}
.cart-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 6px 0;
  padding: 8px;
  border-bottom: 1px solid #ddd;
  width: 100%;
  position: relative;
  min-height: 90px;
}
.cart-item-details {
  flex-grow: 1;
  text-align: left;
}
.cart-img {
  max-width: 18%;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1.5rem;
  display: block;
}
.cart-summary {
  display: flex;
  justify-content: space-between;
}
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 0;
}
.btn-remove {
  background-color: #f44336;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  align-items: center;
  display: flex;
  justify-content: center;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}
.btn-remove:hover {
  background-color: #e53935;
  transform: scale(1.1);
}
.quantity-number {
  margin: 0.5rem 0.5rem;
}
.quantity-controls {
  margin-bottom: 0.5rem;
}
.btn-quantity {
  background-color: white;
  color: black;
  border: 1px solid black;
  padding: 0px 10px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}
.btn-quantity:hover {
  background-color: #c5c9cb;
  transform: scale(1.1);
}
.btn-quantity:disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
  border: 1px solid #d0d0d0;
  transform: none;
}
@media (max-width: 768px) {
  .cart {
    padding: 1rem;
  }
  .cart-container {
    width: 90%;
  }
  .cart-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .cart-item-details {
    width: 100%;
    margin-top: 10px;
    text-align: center;
  }
  .cart-img {
    max-width: 50%;
    margin-right: 0;
    margin-bottom: 1rem;
  }
  .btn-quantity {
    padding: 8px 12px;
    font-size: 16px;
  }
  .btn-remove {
    width: 35px;
    height: 35px;
    font-size: 22px;
  }
}
@media (max-width: 480px) {
  h1 {
    font-size: 1.5rem;
    margin-bottom: 3rem;
  }
  .cart {
    padding: 0.5rem;
  }
  .cart-item {
    padding: 8px;
    margin: 5px 0;
  }
  .cart-img {
    max-width: 60%;
  }
  .btn-quantity {
    padding: 5px 8px;
    font-size: 14px;
  }
  .btn-remove {
    width: 40px;
    height: 40px;
    font-size: 25px;
  }
  .cart-summary h2 {
    font-size: 1.2rem;
  }
}
</style>
