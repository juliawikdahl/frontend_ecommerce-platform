import { getAllProducts, getProductById, getProductByCategory, getProductBySubCategory, addProduct, deleteProduct, updateProduct } from '@/api/products';

export default ({
namespaced: true,
  state: {
    products: [],
    selectedProduct: null,
    error: null,
  },
  getters: {
    allProducts(state) {
    return state.products;
    },
    selectedProduct(state) {
      return state.selectedProduct;
    }
  },
  mutations: {
    setProducts(state, products) {
      console.log("Setting products in state:", products); // Logga innan uppdatering
      state.products = products;
      console.log("Products in state after mutation:", state.products); // Logga efter uppdatering
    },
    
    setSelectedProduct(state, product) {
      state.selectedProduct = product;
    },
    addProductToState(state, product) {
      state.products.push(product);
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
    },
    setError(state, error) {
      state.error = error;
    },
  },
  actions: {
    async loadAllProducts({ commit }) {
      try {
        const products = await getAllProducts(); // Hämta alla produkter
        console.log("Fetched products:", products); // Logga resultatet från API-anropet
        commit('setProducts', products); // Uppdatera Vuex-state
        console.log("State after committing products:", this.state.products); // Logga Vuex state
        return products;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    
    async fetchProductById({ commit }, productId) {
      try {
        const product = await getProductById(productId);
        commit('setSelectedProduct', product);
        return product;
      } catch (error) {
        commit('setError', error.message);
        throw error;
      }
    },
    async fetchProductsByCategory({ commit }, categoryId) {
      try {
        const products = await getProductByCategory(categoryId);
        commit('setProducts', products);
        return products;
      } catch (error) {
        commit('setError', error.message);
        throw error;
      }
    },
    async fetchProductsBySubCategory({ commit }, subCategoryId) {
      try {
        const products = await getProductBySubCategory(subCategoryId);
        commit('setProducts', products);
        return products;
      } catch (error) {
        commit('setError', error.message);
        throw error;
      }
    },
    async createProduct({ commit }, productData) {
      try {
        const newProduct = await addProduct(productData);
        commit('addProductToState', newProduct);
        return newProduct;
      } catch (error) {
        commit('setError', error.message);
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
    },
    async searchProducts({ state }, query) {
      if (!query || query.trim() === "") {
        return []; // Returnera en tom array om query är tom
      }
      
      console.log('Alla produkter i Vuex state:', state.products); // Kontrollera produkter i state
      const filtered = state.products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      console.log('Filtrerade produkter:', filtered);
      return filtered;
    }
    
    
  }
});
