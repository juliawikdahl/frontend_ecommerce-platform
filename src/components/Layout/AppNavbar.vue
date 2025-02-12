<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand">Julias</router-link>

      <!-- Hamburger meny -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>




      <!-- Navbar länkar -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item mx-3">
            <form @submit.prevent="searchProduct" class="d-flex">
              <input
                v-model="searchQuery"
                class="form-control me-2"
                type="search"
                placeholder="Sök produkter"
                aria-label="Sök"
              />
              <button class="btn btn-outline-light" type="submit">Sök</button>
            </form>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Shopping
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <!-- Visa Alla Produkter -->
              <li>
                <router-link to="/allproducts" class="dropdown-item">
                  Visa Alla Produkter
                </router-link>
              </li>

              <!-- Dynamisk render för kategorier -->
              <li v-for="category in categories" :key="category.id" class="dropdown-submenu">
                <router-link :to="`/category/${category.id}`" class="dropdown-item">
                  {{ category.name }}
                </router-link>

                <!-- Subkategori eller "Inga subkategorier" -->
                <ul v-if="category.subCategories && category.subCategories.length > 0" class="sub-menu">
                  <li v-for="subCategory in category.subCategories" :key="subCategory.id">
                    <router-link :to="`/subcategory/${subCategory.id}`" class="dropdown-item">
                      {{ subCategory.name }}
                    </router-link>
                  </li>
                </ul>
                <p v-else class="dropdown-item text-muted">Inga subkategorier</p>
              </li>
            </ul>
          </li>

          <li class="nav-item" v-if="isAuthenticated">
            <router-link to="/wishlist" class="nav-link">Önskelista</router-link>
          </li>

          <!-- Profil dropdown meny -->
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Profil
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li v-if="!isAuthenticated">
                <router-link to="/login" class="dropdown-item">Logga In</router-link>
              </li>
              <li v-if="isAuthenticated">
                <router-link to="/orders" class="dropdown-item">Mina beställningar</router-link>
              </li>
              <li v-if="isAuthenticated">
                <router-link to="/profile" class="dropdown-item">Mina uppgifter</router-link>
              </li>
              <li v-if="isAuthenticated && isAdmin">
                <router-link to="/admin" class="dropdown-item">Admin</router-link>
              </li>
              <li v-if="isAuthenticated">
                <a class="dropdown-item" @click="handleLogout">Logga ut</a>
              </li>
            </ul>
          </li>

          <li class="navbar-item cart-icon" @mouseover="showCartDropDown" @mouseleave="hideCartDropdown">
            <button>
              🛒 <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
            </button>
            <div v-if="isCartDropdownVisible" class="cart-dropdown">
              <div v-if="cart.length === 0" class="empty-cart"> 
                Din varukorg är tom.
              </div>
              <div class="cart-container" v-else>
                <div class="cart-item" v-for="item in cart" :key="item.id">
                  <img :src="getImageSource(item)" alt="item.name" class="cart-img"/>
                  <div class="cart-item-details">
                    <router-link :to="{name: 'product-detail', params: {id: item.id}}" class="item-name">
                      <h4>{{ item.name }}</h4>
                    </router-link>
                    <p class="item-price">{{ item.price }} kr</p>
                    <div class="quantity-controls">
                      <button 
                      class="btn-quantity" 
                      @click="updateQuantity(item.id, item.quantity -1)" 
                      :disabled="item.quantity <= 1"
                      >
                      -
                    </button>
                    <span class="quantity-number">{{ item.quantity }}</span>
                    <button 
                    class="btn-quantity"
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    :disabled="item.quantity >= item.stockQuantity"
                    >
                    +
                  </button>
                 
                  <button class="btn-remove" @click="removeProductFromCart(item.id)">X</button>
                    </div>
                    <div>
                    <p v-if="item.quantity >= item.stockQuantity" class="error-message"> Det finns inte tillräckligt i lager för att lägga till fler.</p>
                    <!-- <p class="total-text"> Total för denna produkt: {{ totalPriceForProduct(item) }} kr</p> -->
                  </div>
                  </div>
                </div>
                <div class="cart-summary">
                      <h2>Totalt: {{ cartTotal }}</h2>
                      <button class="cart-btn" @click="goToCart()">Till varukorgen</button>
                    </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'AppNavbar',
  data() {
    return {
      isCartDropdownVisible: false,
      searchQuery: '',
   
    };
  },
  computed: {
    ...mapGetters(['cartItemCount', 'cart', 'cartTotal']),
    ...mapGetters('auth', ['isAuthenticated', 'isAdmin']),
    ...mapGetters('categories', ['categories']),
  },
  created() {
    if (!this.categories || this.categories.length === 0) {
      this.loadCategories();
    }
  },
  watch: {
  searchQuery(newQuery) {
    console.log("Sökfrågan ändrades till:", newQuery);  // Loggar varje gång sökfrågan ändras
  }
},
  methods: {
    ...mapActions(['updateProductQuantity', 'removeProduct']),
    ...mapActions('auth', ['logout']),
    ...mapActions('categories', ['loadCategories']),
  
    handleLogout() {
      this.logout();
      this.$router.push('/login');
    },
    goToCart() {
      this.$router.push('/cart');
    },
    showCartDropDown() {
      this.isCartDropdownVisible = true;
    },
    hideCartDropdown() {
      this.isCartDropdownVisible = false;
    },
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
      this.updateProductQuantity({productId, quantity});
    },
    removeProductFromCart(productId) {
      this.removeProduct(productId);
    },
    totalPriceForProduct(item) {
      return item.price * item.quantity;
    },
    searchProduct() {
      if (this.searchQuery.trim()) {
        console.log("Sökfråga skickas:", this.searchQuery);
        this.$router.push(`/search?query=${this.searchQuery}`);
      }
    }
  },


};
</script>

<style scoped>
/* Grundläggande stil för navbar */
.navbar {
  background-color: #333;
  padding: 15px 0;
  color: white;
  font-family: Arial, sans-serif;
 
}

/* Behåll navbarens innehåll centrerat och på rätt ställen */
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  margin: 0 auto;
}
.sub-menu li {
list-style: none;
}

.text-muted {
  color: #6c757d; /* Grå text för "Inga subkategorier" */
  font-style: italic;
}

.cart-dropdown {
  position: absolute;
  right: 1rem;
  background-color: white;
  color: black;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  width: 250px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.empty-cart {
  text-align: center;
  font-size: 16px;
  padding: 10px 0;
}
.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.cart-img {
  width: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
}
.item-price {
  margin: 0;
}
.item-name {
  color: inherit;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-number {
  margin: 0 5px;
}

.btn-quantity {
  background-color: white; /* Blå färg */
  color: black; /* Vit text */
  border: 1px solid black;
  padding: 0px 10px;
  cursor: pointer; /* Gör knappen klickbar */
  transition: background-color 0.3s, transform 0.3s; 
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 12px;
}
.btn-quantity:hover {
  background-color: #c5c9cb; /* Mörkare blå färg vid hover */
  transform: scale(1.1); /* Gör knappen lite större vid hover */
}
.btn-quantity:disabled {
  background-color: #e0e0e0; /* Ljusgrå bakgrund för disabled */
  color: #a0a0a0; /* Ljusgrå text */
  cursor: not-allowed; /* Förhindrar att muspekaren blir en hand */
  border: 1px solid #d0d0d0; /* Ljusare kantlinje */
  transform: none; /* Förhindrar hover-effekten */
}
.btn-remove {
  background-color: #f44336;
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 10px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  padding: 0; /* Säkerställer att inga extra padding läggs till */
  box-sizing: border-box; /* Inkluderar border och padding i bredd/höjd */
  margin-left: 0.5rem;
}
.btn-remove:hover {
  background-color: #e53935; /* Lite mörkare röd vid hover */
  transform: scale(1.1); /* Gör knappen lite större vid hover */
}
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 0;
}
.cart-summary {
  text-align: center;
  margin-top: 15px;
}

.checkout-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
}

.checkout-btn:hover {
  background-color: #45a049;
}

/* Responsivitet */
@media (max-width: 480px) {
  .cart-dropdown {
    width: 100%;
    left: 0;
    right: 0;
  }

  .cart-img {
    width: 40px;
    height: 40px;
  }

  .cart-item-details {
    font-size: 12px;
  }

  .btn-quantity {
    padding: 3px;
    font-size: 10px;
  }

  .btn-remove {
    font-size: 14px;
  }

  .checkout-btn {
    padding: 8px 16px;
    font-size: 12px;
  }
}




</style>
