<template>
  <div class="order-portal container">
    <div v-if="isLoading">Loading orders...</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <!-- <th>Customer Name</th> -->
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in paginatedOrders" :key="order.orderId">
          <td>{{ order.orderId }}</td>
          <!-- <td>{{ order.customerName }}</td> -->
          <td>{{ order.status }}</td>
          <td>
            <select v-model="order.newStatus" class="form-control"   :disabled="order.disabled">
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </td>
          <span v-if="order.disabled">Cant change canceled orders</span>
          <td v-else>
            <button @click="updateOrderStatus(order.orderId, order.newStatus)" :disabled="order.disabled" >Update Status</button>
            <button @click="openEditModal(order)" :disabled="order.disabled">Edit</button>
            <button @click="deleteOrder(order.orderId)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
      <span class="total">page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage >= totalPages" @click="currentPage++">Next</button>
    </div>
    <!-- Modal för att ändra orderns innehåll -->
   
    <div v-if="orderModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Edit Order #{{ selectedOrder.orderId }}</h2>

        <div class="edit-products" v-for="item in selectedOrder.orderItems" :key="item.id">
          <label>Product:</label>
          <select v-model="item.productId">
            <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
          </select>
          <label>Quantity:</label>
          <input type="number" v-model="item.quantity" />
    
        </div>
        <div class="btn">
           <button type="submit" @click="saveOrderChanges">Save changes</button>
        <button type="submit" @click="closeModal">Cancel</button>
        </div>
       
      </div>
    </div>
  

</template>

<script>
export default {
  data() {
    return {
      orders: [],
      isLoading: false,
      errorMessage: '',
      selectedOrder: null,
      orderModal: false,
      products: [],
      currentPage: 1,
      ordersPerPage: 10,
      
      
 
    };
  },
  mounted() {
    
    console.log('Mounted: Fetching orders and products...');
    this.fetchOrders();
    this.fetchProducts(); // Hämta produkter
 

  },
  watch: {
  orders: {
    handler(newOrders) {
      newOrders.forEach(order => {
        order.disabled = order.status.toLowerCase() === 'canceled'; // Uppdatera disabled baserat på status
      });
    },
    deep: true, // Vi kollar på alla förändringar inom orders
  },
},
  computed: {
    sortedOrders() {
return [...this.orders].sort((a,b) => new Date(b.orderDate) - new Date(a.orderDate))
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.ordersPerPage;
      const end = start + this.ordersPerPage;
      return this.sortedOrders.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.orders.length / this.ordersPerPage);
    },
  },
  methods: {
   
    async fetchOrders() {
  this.isLoading = true;
  try {
    await this.$store.dispatch('orders/fetchOrders');
    const orders = this.$store.getters['orders/allOrders'];

    // Se till att orders är en array
    if (Array.isArray(orders)) {
      this.orders = orders.map(order => ({
        ...order,
        disabled: order.status.toLowerCase() === 'canceled', // Sätt disabled direkt
      }));
    } else {
      console.error('Expected orders to be an array, but got:', orders);
      this.orders = []; // Fallback till en tom array
    }
  } catch (error) {
    this.errorMessage = 'Failed to load orders.';
    console.error('Error fetching orders:', error);
  } finally {
    this.isLoading = false;
  }
},

 
async updateOrderStatus(orderId, status) {
  console.log('Updating order status for order ID:', orderId, 'New status:', status);
  try {
    await this.$store.dispatch('orders/updateOrderStatus', { orderId, status });

    // Uppdatera order.disabled baserat på ny status
    const order = this.orders.find(order => order.orderId === orderId);
    if (order) {
      order.disabled = status.toLowerCase() === 'canceled';
    }
// this.orders.find: Letar upp den specifika ordern i den lokala listan this.orders baserat på orderId.
// order.disabled = status.toLowerCase() === 'canceled':
// Om den nya statusen är 'canceled' (oavsett om den är skriven med stor eller liten bokstav), sätts order.disabled till true.
// Om statusen inte är 'canceled', sätts order.disabled till false.
// Detta säkerställer att <select>-elementet blir disabled om ordern avbryts.

    console.log('Order status updated successfully');
  } catch (error) {
    console.error('Error updating order status:', error);
  }
},

    openEditModal(order) {
      console.log('Opening edit modal for order:', order);
      this.selectedOrder = { ...order }; 
      this.orderModal = true;
    },

    closeModal() {
      console.log('Closing modal');
      this.orderModal = false;
      this.selectedOrder = null;
    },
    async fetchProducts() {
      console.log('Fetching products...');
      try {
        // Hämta alla produkter från Vuex
        await this.$store.dispatch('products/loadAllProducts');
        this.products = this.$store.getters['products/allProducts'];
        console.log('Products fetched:', this.products);
      } catch (error) {
        this.errorMessage = 'Failed to load products.';
        console.error('Error fetching products:', error);
      }
    },

    async saveOrderChanges() {
      try {
        await this.$store.dispatch("orders/updateOrder", {
          orderId: this.selectedOrder.orderId,
          orderData: {
            orderItems: this.selectedOrder.orderItems,
          },
        });

        this.closeModal();
      } catch (error) {
        console.error("Fel vid uppdatering av order:", error);
      }
    },

    async deleteOrder(orderId) {
      console.log('Preparing to delete order ID:', orderId);
      const confirmed = confirm('Are you sure you want to delete this order?');
      if (!confirmed) return;

      try {
        await this.$store.dispatch('orders/deleteOrder', orderId);
        console.log('Order deleted successfully');
        alert('Order deleted');
        this.fetchOrders(); // Refresh orders after deletion
      } catch (error) {
        this.errorMessage = 'Error deleting order';
        console.error('Error deleting order:', error);
      }
    },
  },
};
</script>

<style scoped>


.order-portal {
   display: flex;
   justify-content: center;
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 1200px;
    height: 600px;
    margin-top: 2rem;
    text-align: center;
    
  }
  button {
    margin-right: 10px;
    padding: 10px 15px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:disabled {
    background-color: grey;
  }


  input, select {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    margin-top: 5px;
    
  }
  
  input:focus, select:focus {
    border-color: #007BFF;
    outline: none;
  }

  .pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  bottom: 0;
  padding: 10px 0;

}
.total {
  margin-right: 10px;
}

  
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); /* Mörk bakgrund */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Se till att modalens overlay är ovanpå allt annat */
}

/* Innehåll i modalen */
.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
}

.error-message {
  color: red;
}
</style>
