<template>
  <div class="order-container">
    <h1 class="page-title">My Orders</h1>

    <!-- Visa laddning om ordrarna hämtas -->
    <div v-if="isLoading" class="loading-message">
      <span>Loading your orders...</span>
    </div>

    <!-- Visa felmeddelande om något gick fel -->
    <div v-if="error" class="error-message">
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Visa ett meddelande om inga ordrar finns -->
    <div v-if="!isLoading && orders.length === 0" class="no-orders-message">
      You have no orders.
    </div>

    <!-- Lista alla ordrar -->
    <div v-if="!isLoading && orders.length > 0" class="orders-list">
      <div v-for="order in sortedOrders" :key="order.orderId" class="order-card">
        <div class="order-header">
          <div>
            <strong>Order Number:</strong> {{ order.orderId }}
          </div>
          <div>
            <strong>Order Date:</strong> {{ formatDate(order.orderDate) }}
          </div>
          <div>
            <strong>Status:</strong> {{ order.status }}
          </div>
          <div>
            <strong>Total Amount:</strong> {{ order.totalAmount }}
          </div>
        </div>

        <!-- Lista alla order items -->
        <div v-if="order.orderItems && order.orderItems.length > 0" class="order-items">
          <ul>
            <li v-for="item in order.orderItems" :key="item.productId" class="order-item">
              <div class="product-info">
                <!-- Produktbild -->
                <router-link :to="{ name: 'product-detail', params: { id: item.productId } }">
                <img v-if="item.encodedImage" :src="getImageSource(item)" alt="product.name" class="product-image" />
              </router-link>
                
                <div class="product-details">
                  <div>
                    <strong>Product Name:</strong> {{ item.productName }}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {{ item.quantity }}
                  </div>
                  <div>
                    <strong>Price:</strong> {{ item.price }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'OrderView',
  computed: {
    ...mapState('orders', ['orders', 'loading', 'error']), // Mappa Vuex state till computed properties
    isLoading() {
      return this.loading;
    },
    sortedOrders(){
      return this.orders.slice().sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    }
  },
  created() {
    this.fetchUserOrders(); // Hämta användarens ordrar när komponenten skapas
  },
  watch: {
    // Logga hela orderinnehållet varje gång orders hämtas eller ändras
    orders(newOrders) {
      console.log('Fetched Orders:', newOrders);
    }
  },
  methods: {
    ...mapActions('orders', ['fetchUserOrders']), // Mappa Vuex actions till komponentens metoder

    getImageSource(product) {
      if (product.encodedImage && product.encodedImage.startsWith('data:image')) {
        return product.encodedImage;
      }
      if (product.encodedImage) {
        return `data:image/webp;base64,${product.encodedImage}`;
      }
      return 'default-image.jpg';
    },
      formatDate(date) {
        return new Date(date).toLocaleDateString('sv-SE');
      },
  }
};
</script>

<style scoped>
.order-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
}

ul {
list-style-type: none;
padding-left: 0;
}
.page-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.loading-message, .error-message, .no-orders-message {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 20px;
}


.error-message {
  color: #FF6347;
  font-weight: bold;
}

.no-orders-message {
  color: #888;
  font-style: italic;
}

.orders-list {
  display: flex;
  flex-direction: column; /* Gör att ordrarna placeras vertikalt */
  gap: 20px; /* Lägger till avstånd mellan varje order */
}

.order-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

/* .order-card:hover {
  transform: scale(1.02);
} */

.order-header {
  display: flex; /* Gör att orderinformationen visas på rad under varandra */
  flex-direction: column; /* Vertikal layout istället för grid */
  gap: 10px;
  margin-bottom: 20px;
}

.order-header div {
  font-size: 1.1rem;
  color: #333;
}

.order-items {
  margin-top: 15px;
}

.order-items-title {
  font-size: 1.3rem;
  margin-bottom: 15px;
  font-weight: 600;
  color: #444;
}

.order-item {
  margin-bottom: 20px;
}

.order-item .product-info {
  display: flex;
  align-items: center;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
  border-radius: 8px;
}

.product-details {
  flex-grow: 1;
}

.product-details div {
  font-size: 1.1rem;
  color: #555;
}

.product-details strong {
  font-weight: bold;
}

</style>
