<template>
    <div class="container mt-4">
      <h1>Your wishlist</h1>
      <div v-if="wishlistProducts.length === 0" class="no-products">Your wishlist is empty.</div>
      <div v-else>
        <AllProductsList :products="wishlistProducts" />
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  import { getAllProducts } from '@/api/products.js'; 
  import AllProductsList from '@/components/products/AllProductsList.vue';
  
  export default {
    name: 'WishlistView',
    components: {
      AllProductsList
    },
    data() {
      return {
        products: [], // För att lagra alla produkter från API
        wishlistProducts: [] // För att lagra produkter som finns i wishlisten
      };
    },
    computed: {
  ...mapGetters('wishlist', ['wishlist']), // Lägg till modulens namn här
},
    created() {
      this.fetchProducts(); // Hämta produkter från API när komponenten laddas
    },
    watch: {
  wishlist: {
    handler() {
      console.log('Wishlist ändrad i Vuex: (wishviewwatch)', this.wishlist); 
      this.updateWishlistProducts(); // Uppdatera wishlist när Vuex wishlist förändras
    },
    deep: true
  }
},
    methods: {
        async fetchProducts() {
    try {
      console.log('Försöker hämta alla produkter från API(fetchprodwishview)');
      this.products = await getAllProducts();
      console.log('Alla produkter hämtade:(fetchprodwishview)', this.products);
      this.updateWishlistProducts();
    } catch (error) {
      console.error('Det gick inte att hämta produkter:', error);
    }
  },

  updateWishlistProducts() {
  console.log("Wishlist innan uppdatering:", this.wishlist);
  console.log("Alla produkter:", this.products);

  if (!this.wishlist || this.wishlist.length === 0) {
    console.log("Wishlist är tom.");
    this.wishlistProducts = []; // Rensa wishlistProducts när wishlist är tom
    return;
  }

  if (!this.products || this.products.length === 0) {
    console.log("Produkter är tomma.");
    return;
  }
 // eftersom min wishlist endast innehåller id behöver jag hämta produkter för att få ut all information som bild text osv.
  this.wishlistProducts = this.wishlist.map(productId => {
    return this.products.find(product => product.id === productId);
  }).filter(product => product !== undefined);

  console.log('Uppdaterad wishlist med produkter:', this.wishlistProducts);
}
    },
    
  };
  </script>
  
  <style scoped>
  .no-products {
    text-align: center;
    font-size: 18px;
    color: #888;
  }
  </style>
  