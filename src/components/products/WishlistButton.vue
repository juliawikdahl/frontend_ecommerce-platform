<template>
    <button v-if="isAuthenticated" @click="toggleWishlist" class="wishlist-button">
        <i :class="{'fas fa-heart': isInWishlist, 'far fa-heart': !isInWishlist}"></i>
    </button>
   
  </template>
  
  <script>

  import { mapActions, mapGetters } from 'vuex';
  export default {
    name: 'WishlistButton',
    props: {
      productId: {
        type: Number,
        required: true
      }
    },
    computed: {
      ...mapGetters('auth', ['isAuthenticated']),
  isInWishlist() {
    return this.$store.getters['wishlist/isProductInWishlist'](this.productId); 
  }
},


    methods: {
      ...mapActions('wishlist', ['removeFromWishlist', 'addToWishlist' ]),
      async toggleWishlist() {
      try {
        if (this.isInWishlist) {
          await  this.removeFromWishlist(this.productId);
        } else {
          await this.addToWishlist(this.productId)
        }
      } catch (error) {
        console.error('Failed to toggle wishlist:', error);
      }
    }
    }
  };
  </script>
  
  <style scoped>
.wishlist-button {
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}

.wishlist-button i {
  color: #888; 
  font-size: 20px;
}
.wishlist-button i:hover {
  transform: scale(1.2); 
}

.wishlist-button .fa-heart.far {
  color: #888; /* Ihåligt hjärta */
}

.wishlist-button .fa-heart.fas {
  color: black; /* Fyllt hjärta */
}


  </style>
  