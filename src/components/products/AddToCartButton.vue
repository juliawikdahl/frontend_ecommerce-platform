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
  background-color: transparent;  /* Genomskinlig bakgrund */
  border: 2px solid #444;  /* Mörkgrå kantlinje för en modern look */
  border-radius: 50%;  /* Runda hörn */
  font-size: 20px;  /* Öka storleken på ikonen för bättre synlighet */
  cursor: pointer;
  color: #444;  /* Mörkgrå färg på ikonen */
  transition: transform 0.2s ease-in-out, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  width: 40px;  /* Lite större knapp för bättre klickbarhet */
  height: 40px;  /* Lite större knapp för bättre klickbarhet */
  display: flex;
  justify-content: center;
  align-items: center;  /* Centrera ikonen i knappen */
  outline: none; /* Ta bort kantlinje vid fokusering */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);  /* Lätt skugga för en subtil 3D-effekt */
}

.add-to-cart:hover {
  background-color: #e0e0e0;  /* Ljusgrå bakgrund vid hover */
  color: #222;  /* Mörkare färg på ikonen vid hover */
  border-color: #222;  /* Mörkare kantlinje vid hover */
  transform: translateY(-3px);  /* Subtilt lyft effekt vid hover */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);  /* Större skugga för en upplyft effekt */
}

button:disabled {
  color: #b0b0b0;  /* Ljusgrå färg på varukorgsikonen när den är inaktiverad */
  pointer-events: none;
  border: none;
}

.buyButton {
  background-color: #000; /* Svart bakgrund */
  color: #fff; /* Vit text */
  border: none; /* Ingen kantlinje */
  border-radius: 5px; /* Lätt rundade hörn */
  font-size: 18px; /* Stor text */
  padding: 12px 150px; /* Större padding för en lång knapp */
  width: auto; /* Anpassa till texten */
  height: auto; /* Anpassa till texten */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Skugga för en lyft känsla */
  transition: background-color 0.3s ease, transform 0.2s ease-in-out, box-shadow 0.3s ease;
}

.buyButton:hover {
  background-color: #333; /* Mörkare svart vid hover */
  transform: translateY(-3px); /* Liten lyfteffekt vid hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Mer framträdande skugga */
  color: #fff; 
}

.buyButton:active {
  transform: translateY(0); /* Ta bort lyftet vid klick */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Minskad skugga */
}
.buyButton:disabled {
  background-color: #f0f0f0;  /* Ljusgrå bakgrund när inaktiverad */
  color: #b0b0b0;  /* Ljusgrå text för att indikera att den är inaktiverad */
  border: 2px solid #d0d0d0;  /* Ljusgrå kantlinje */
  cursor: not-allowed;  /* Visar att knappen inte går att klicka på */
  box-shadow: none;  /* Ingen skugga för en nedtonad effekt */
  transform: none;  /* Ingen transformering när man hovrar */
}

  </style>
  