<template>
  <div class="order-confirmation">
    <div v-if="order">
      <h1 class="">Thanks for your order, {{user.name}}!</h1>
      <div class="order-row-one">
        <p><strong>Order Number:</strong> {{ order.orderId }}</p>
      </div>

      <div v-if="user" class="user-form">
        <div class="delivery-info">
          <div class="delivery-box">
            <div class="row-two">
              <p><strong>Email:</strong> {{ user.email }},</p>
              <p><strong>Mobile:</strong> {{ user.mobile }}</p>
            </div>
            <p><strong>Address:</strong> {{ user.address }}</p>
            <div class="row-two">
              <p><strong>Zipcode:</strong> {{ user.zipcode }},</p>
              <p><strong>City:</strong> {{ user.city }}</p>
            </div>
          </div>  
        </div>
      </div>

      <div class="products-box">
        <ul>
            <strong>Created Date: {{ formatDate(order.orderDate) }}</strong>
            <p class="total"><strong>Total Amount:</strong> {{ order.totalAmount }} kr</p>
          <li v-for="item in order.orderItems" :key="item.id">
            <div class="product-info">
                <router-link :to="{ name: 'product-detail', params: { id: item.productId } }" class="router-link">
                <img v-if="item.encodedImage" :src="getImageSource(item)" alt="product.name" class="cart-img" />
              </router-link>
              <div class="product-details">
                <span class="product-name">Product Name: {{ item.productName }}</span>
                <span class="product-quantity">Quantity: {{ item.quantity }}</span>
                <span class="product-price">Price: {{ item.price }} kr</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div v-else-if="loading">
      <p>Loading order information...</p>
    </div>

    <p v-else>No order was found...</p>

    <router-link to="/" class="back-link">Back To Home</router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('orders', ['orders', 'loading']),
    ...mapState('auth', ['user']),

    order() {
      const orderId = Number(this.$route.params.orderId);
      return this.orders.find((o) => o.orderId === orderId) || null;
    },
  },
  created() {
    this.$store.dispatch('auth/loadUserProfile');
    this.$store.dispatch('orders/fetchUserOrders');
  },
  methods: {
    getImageSource(item) {
      if (item.encodedImage && item.encodedImage.startsWith('data:image')) {
        return item.encodedImage;
      }
      if (item.encodedImage) {
        return `data:image/webp;base64,${item.encodedImage}`;
      }
      return 'default-image.jpg';
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('sv-SE');
    },
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 3rem;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-confirmation {
  margin: auto;
  padding: 20px;
  text-align: center;
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 90%;
}
.user-form {
  margin-bottom:2rem;
  text-align: left;
  max-width: 500px;
}
.order-row-one, .row-two {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.products-box {
  background-color: #f9f9f9;
  text-align: left;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 700px;
}
.product-info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.product-details {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.cart-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
  border-radius: 8px;
}

.total {
  font-weight: bold;
  text-align: left;
}

.delivery-info {
  display: flex;
  align-items: center;
}

.delivery-box {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  max-width: 400px;
  width: 100%;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  font-weight: bold;
  color: #007bff;
}

.back-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .order-confirmation h1 {
    font-size: 1.5rem;
  }

  .product-details span {
    font-size: 0.9rem;
  }

  .cart-img {
    width: 50px;
    height: 50px;
  }

  .products-box, .delivery-box {
    padding: 10px;
  }
}
</style>
