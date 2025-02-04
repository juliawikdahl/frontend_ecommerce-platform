import { getAllProducts, deleteProduct, updateProduct } from '@/api/products';

export default ({
namespaced: true,
  state: {
    products: [],
  },
  getters: {
    allProducts(state) {
    return state.products;
    } 
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    removeProduct(state, productId) {
      state.products = state.products.filter(product => product.id !== productId);
    },
    updateProductInState(state, updatedProduct) {
      console.log("Updating product in state with id:", updatedProduct.id);
      const index = state.products.findIndex(product => product.id === updatedProduct.id);
      if (index !== -1) {
        state.products.splice(index, 1, updatedProduct);
        console.log("Product updated in state:", updatedProduct);
      } else {
        console.log("Product not found in state for update:", updatedProduct.id);
      }
    }
  },
  actions: {
    async loadAllProducts({ commit }) { // Fixad syntax
      try {
        const products = await getAllProducts(); // Anropa direkt utan axios.
        console.log("Fetched products:", products);
        commit('setProducts', products);
        return products;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    async deleteProduct({ commit }, productId) {
      try {
        // Anropa API-funktionen för att ta bort produkten
        await deleteProduct(productId);

        // När produkten har tagits bort från servern, uppdatera Vuex state
        commit('removeProduct', productId);

        console.log('Product successfully deleted');
      } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
    },
    async updateProduct({ commit }, { id, productData }) {
      try {
        const updatedProduct = await updateProduct(id, productData); // Anropa API och uppdatera produkt
        commit('updateProductInState', updatedProduct); // Uppdatera produkten i Vuex
        return updatedProduct; // Returnera den uppdaterade produkten
      } catch (error) {
        console.error('Error updating product:', error);
        throw error;
      }
    }
  },
});
