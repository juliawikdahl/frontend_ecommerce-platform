<template>
  <div class="container mt-4">
    <div v-if="products.length === 0" class="no-products">Inga produkter tillgängliga.</div>

    <div class="products-grid">
      <div class="product-card" v-for="product in localProducts" :key="product.id">
        <div class="card-img-container">
          <button v-if="isAdmin" class="edit-button" @click="openEditModal(product)">
            <i class="fa-solid fa-edit"></i>
          </button>
          <button v-if="isAdmin" class="delete-button" @click="deletebtnProduct(product.id)">
            <i class="fa-solid fa-trash"></i>
          </button>
          <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
            <img :src="getImageSource(product)" alt="product.name" class="card-img-top" />
          </router-link>
        </div>

        <div class="info-container">
          <div class="product-info">
            <h2 class="product-name">{{ product.name }}</h2>
            <p class="product-price">{{ product.price }} kr</p>
          </div>
          <div class="button-container">
            <WishlistButton :productId="product.id" />
            <AddToCartButton :product="product" />
          </div>
        </div>
      </div>
    </div>

    <!-- Redigeringsmodal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal">
        <h2>Redigera produkt</h2>
        <form @submit.prevent="putProduct(editedProduct.id)">
          <label for="editName">Namn</label>
          <input type="text" id="editName" v-model="editedProduct.name" required />

          <label for="product-description">Beskrivning</label>
          <textarea v-model="editedProduct.description" id="product-description"></textarea>
          <div class="form-row">
              <div class="form-group">
                <label for="editPrice">Pris</label>
                <input type="number" id="editPrice" v-model="editedProduct.price" required />
              </div>
              <div class="form-group">
                <label for="editStock">Lagerantal</label>
                <input type="number" id="editStock" v-model="editedProduct.stockQuantity" required />
              </div>
          </div>
          <div class="form-row">
          <div class="form-group">
              <label for="category-select">Kategori</label>
              <select v-model="editedProduct.categoryId" @change="onCategoryChange">
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="subcategory-select">Subkategori</label>
              <select v-model="editedProduct.subCategoryId"  required>
                <option v-for="sub in subcategories" :key="sub.id" :value="sub.id">
                  {{ sub.name }}
                </option>
              </select>
            </div>
        </div>
        <div class="form-group">
            <label for="product-image">Produktbild</label>
            <!-- Om det finns en bild, visa den som förhandsvisning -->
            <div v-if="editedProduct.encodedImage">
              <img  :src="getImageSource(editedProduct)" alt="Current image" class="image-preview" />
            </div>
            <input type="file" id="product-image" @change="handleImageChange" />
          </div>

          <button type="submit">Spara ändringar</button>
          <button type="button" class="cancel-button" @click="closeEditModal">Avbryt</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getCategories } from '@/api/categories';
// import { updateProduct } from '@/api/products';
import AddToCartButton from '@/components/products/AddToCartButton.vue';  
import WishlistButton from '@/components/products/WishlistButton.vue';

export default {
  name: 'AllProductsList',
  props: {
    products: {
      type: Array,
      required: true,
    },
    isAdmin: {
      type:Boolean,
      default: false,
    }
  },
  data() {
    return {
      showEditModal: false,
      editedProduct: {},
      categories: [],
      subcategories: [],
      localProducts: [...this.products],  // Skapa en lokal kopia av produkterna


    };
  },
  components: {
    AddToCartButton,
    WishlistButton   
  },
  mounted() {
    this.fetchCategories();
  },
  watch: {
    // Uppdatera komponenten när produkterna ändras
    products(newProducts) {
      this.localProducts = [...newProducts];  // Uppdatera den lokala kopian
    }
  },
  methods: {
    getImageSource(product) {
      if (product.encodedImage && product.encodedImage.startsWith('data:image')) {
        return product.encodedImage;
      }
      if (product.encodedImage) {
        return `data:image/webp;base64,${product.encodedImage}`;
      }
      return 'default-image.jpg';
    },
    openEditModal(product) {
      this.editedProduct = { ...product };
      this.showEditModal = true;
      this.onCategoryChange();
    },
    async fetchCategories() {
      try {
        const response = await getCategories();
        this.categories = response;
        this.onCategoryChange();
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    onCategoryChange() {
      const selectedCategory = this.categories.find(cat => cat.id === this.editedProduct.categoryId);
      this.subcategories = selectedCategory ? selectedCategory.subCategories : [];

    },
    closeEditModal() {
      this.showEditModal = false;
    },
    async deletebtnProduct(productId) {
      const confirmed = window.confirm('are you sure you want to delete this product from the API?');
      if (confirmed) {
        try {
          await this.$store.dispatch("products/deleteProduct", productId);
          await this.$store.dispatch('products/loadAllProducts');
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    },
    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.editedProduct.encodedImage = reader.result.split(',')[1];
        };
        reader.readAsDataURL(file);
      }
    },
    async putProduct(productId) {
      try {
        const updatedProduct = {
          id: this.editedProduct.id,
          name: this.editedProduct.name,
          description: this.editedProduct.description,
          price: this.editedProduct.price,
          stockQuantity: this.editedProduct.stockQuantity,
          subCategoryId: this.editedProduct.subCategoryId,
          categoryId: this.editedProduct.categoryId,
          categoryName: this.editedProduct.categoryName, 
          subCategoryName: this.editedProduct.subCategoryName, 
          encodedImage: this.editedProduct.encodedImage,
      };

      await this.$store.dispatch('products/updateProduct', { id: productId, productData: updatedProduct });

      console.log('✅ Product update dispatched successfully');
      await this.$store.dispatch('products/loadAllProducts'); 
      this.closeEditModal();
        } catch (error) {
        console.error('❌ Error updating product in component:', error);
        }
    },
  },
};
</script>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Fyra kolumner */
  grid-gap: 1rem;
  margin: 0 auto; /* Centrerar griden */
}

.product-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-img-container {
  position: relative;
  width: 100%;
  height: 250px; /* Ger en fast höjd för bilden */
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Skuggning runt boxen */
  overflow: hidden;
  border-radius: 8px; /* Rundar hörnen på boxen */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-img-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Förstärkt skugga vid hover */
}
.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  padding: 5px 8px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.3s ease;
}

.delete-button:hover {
  background: rgba(255, 0, 0, 1);
}

.edit-button {
  position: absolute;
  top: 10px;
  left: 10px; /* Flytta knapparna till vänstra sidan */
  border: none;
  padding: 5px 8px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.3s ease;
}




.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Gör att bilden anpassar sig till boxen */
}

.product-name {
  margin: 10px 0 5px;
  font-size: 1.2rem;
  color: #333;
}

.product-price {
  margin: 0 0 10px;
  font-size: 1.1rem;
  color: #777;
}
.info-container {
  display: flex;
  justify-content: space-between; /* Sprider elementen jämnt mellan vänster och höger */
  align-items: center; /* Vertikal centrering */
  width: 100%; /* Säkerställer att den tar upp hela bredden */
  margin-top: 10px; /* Avstånd mellan bild och text/kontroller */
}

.product-info {
  flex: 1; /* Tillåter vänstra sektionen att ta upp så mycket plats som behövs */
  text-align: left; /* Vänsterjustera texten */
}

.button-container {
  display: flex;
  margin-right: 0.5rem;
}
/* Modal-styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  display: block;
  position: relative;
  z-index: 1000;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 500px;
  max-height: 750px;
  text-align: center;
}

.modal form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal label {
  text-align: left;
  font-weight: 600;
  color: #444;
  margin-bottom: 5px;
  display: block;
}

.modal input,
.modal textarea,
.modal select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  transition: border 0.2s ease-in-out;
}

.modal input:focus,
.modal textarea:focus,
.modal select:focus {
  border: 1px solid #007bff;
  outline: none;
}

/* === KNAPPSTYLING === */
.modal button {
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.modal button[type="submit"] {
  background: #007bff;
  color: white;
}

.modal button[type="submit"]:hover {
  background: #0056b3;
}
.image-preview {
  width: 50px;  /* Gör bilden 50px bred */
  height: 50px; /* Gör bilden 50px hög */
  object-fit: cover; /* Förhindrar att bilden blir förvrängd om den inte har rätt proportioner */
}


.cancel-button {
  background: #6c757d;
  color: white;
}

.cancel-button:hover {
  background: #5a6268;
}


.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 12px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr); /* Två kolumner för mindre skärmar */
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr; /* En kolumn för mobil */
  }

  .card-img-container {
    height: 200px; /* Justera bildhöjd på mobil */
  }
}

</style>
