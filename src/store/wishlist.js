import { getWishlist, addToWishlist, removeFromWishlist } from '@/api/wishlist';

export default {
namespaced: true,
  state: {
    wishlist: [],
  },
  getters: {
    wishlist(state) {
      return state.wishlist;
    },
    isProductInWishlist: (state) => (productId) => {
      console.log('Kollar om produkt är i wishlist:', productId, state.wishlist);
      return state.wishlist.includes(productId);
    }
  },
  mutations: {
    setWishlist(state, wishlist) {
      console.log('Sätter wishlist i Vuex state:(setmutindex)', wishlist);
      state.wishlist = wishlist;
    },
    addToWishlist(state, productId) {
      console.log('Lägger till produkt i Vuex wishlist:(addtomutindex)', productId);
      if (!state.wishlist.includes(productId)) {
        state.wishlist.push(productId);
      }
    },
    removeFromWishlist(state, productId) {
      console.log('Tar bort produkt från Vuex wishlist:(removemutindex)', productId);
      state.wishlist = state.wishlist.filter(id => id !== productId);
    },
  },
  actions: {
    async loadWishlist({ commit }) {
      try {
        const wishlist = await getWishlist();
        commit('setWishlist', wishlist.map(item => item.productId));
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      }
    },
    async addToWishlist({ commit }, productId) {
      try {
        console.log('Försöker lägga till produkt i wishlist:(addtoindex)', productId);
        await addToWishlist(productId);
        commit('addToWishlist', productId);
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
      }
    },
    async removeFromWishlist({ commit }, productId) {
      try {
        console.log('Försöker ta bort produkt från wishlist:(removeindex)', productId);
        await removeFromWishlist(productId);
        commit('removeFromWishlist', productId);
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
      }
    },
  }
};
