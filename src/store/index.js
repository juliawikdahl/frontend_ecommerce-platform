import { createStore } from 'vuex';
import auth from './auth';
import wishlist from './wishlist';


export default createStore({
  modules: {
    auth,
    wishlist
  },
  state: {
    cart: [],
    message: null,
  },
  getters: {
    cartItemCount(state) {
      return state.cart.reduce((count, item) => count + item.quantity, 0);
    },
    cart(state) {
      return state.cart;
    },
    cartTotal(state) {
      return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },
 
  },
  mutations: {
    addToCart(state, product) {
      const existing = state.cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        const newProduct = { ...product, quantity: 1 };
        state.cart.push(newProduct);
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    loadCartFromStorage(state) {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      state.cart = storedCart;
    },
      updateCart(state, updatedCart) {
      state.cart = updatedCart;
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeProduct(state, productId) {
      state.cart = state.cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },

    updateProductQuantity(state, { productId, quantity }) {
      const product = state.cart.find(item => item.id === productId);
      if (product) {
        product.quantity = quantity; // Uppdatera kvantiteten
        if (product.quantity <= 0) {
          state.cart = state.cart.filter(item => item.id !== productId); // Ta bort produkten om kvantiteten är 0
        }
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
  },
  actions: {
      addToCart({ commit }, product) {
      commit('addToCart', product);
    },
    loadCart({ commit }) {
      commit('loadCartFromStorage');
    },
    updateCart({ commit }, updatedCart) {
      commit('updateCart', updatedCart);
    },
    updateProductQuantity({ commit }, payload) {
      commit('updateProductQuantity', payload);
    },
    removeProduct({ commit }, productId) {
      commit('removeProduct', productId);
    },
  },
});
