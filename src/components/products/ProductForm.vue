<template>
  <div class="form-container">
          <form @submit.prevent="submitAddProduct">
              <h2>Add a New Product</h2>
              <div class="form-group">
                  <label for="productName">Product Name</label>
                  <input type="text" v-model="newProduct.name" id="productName" required/>
              </div>
              <div class="form-group">
                  <label for="productDescription">Product Description</label>
                  <input type="text" v-model="newProduct.description" id="productDescription" required />
              </div>
              <div class="form-row">
                <div class="form-group">
                    <label for="productPrice">Price</label>
                    <input type="number" v-model="newProduct.price" id="productPrice" required />
                </div>
                
                <div class="form-group">
                    <label for="productStockQuantity">Stock Quantity</label>
                    <input type="number" v-model="newProduct.stockQuantity" id="productStockQuantity" required />
                </div>
            </div>
            <div class="form-row">
          <div class="form-group">
              <label for="productCategory">Category</label>
              <select v-model="newProduct.categoryId" id="productCategory" required @change="onCategoryChange">
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                  </option>
              </select>   
          </div>

          <div class="form-group">
              <label for="productSubcategory">Subcategory</label>
              <select v-model="newProduct.subCategoryId" id="productSubcategory" required>
                  <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
                      {{ subcategory.name }}
                  </option>
              </select>
          </div>
      </div>
              <div class="form-group">
                  <label for="productImage">Product Image</label>
                  <input type="file" @change="handleImageUpload" />
              </div>
              <div class="form-group">
                  <button type="submit">Add product</button>
              </div>
          </form>
      </div>
    

</template>
<script>
import { addProduct } from '@/api/products';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
        newProduct: {
          id: 0,
          name: "",
          description: "",
          price: 0,
          stockQuantity: 0,
          subCategoryId: 0,
          subCategoryName: "",
          categoryId: 0,
          categoryName: "",
          encodedImage: "" 
        },
        subcategories: [],
        
    };
  },
  computed: {
    ...mapGetters('categories', ['categories']),
  },
  methods: {

    async submitAddProduct() {
        try {
          const productData = {
            id: this.newProduct.id,
            name: this.newProduct.name,
            description: this.newProduct.description,
            price: this.newProduct.price,
            stockQuantity: this.newProduct.stockQuantity,
            subCategoryId: this.newProduct.subCategoryId,
            subCategoryName: this.subcategories.find(sub => sub.id === this.newProduct.subCategoryId)?.name || "",
            categoryId: this.newProduct.categoryId,
            categoryName: this.newProduct.categoryName,
            encodedImage: this.newProduct.encodedImage
          };
          
          const createdProduct = await addProduct(productData);
          console.log('Product added:', createdProduct);
          this.newProduct = {}; 
        } catch (error) {
          console.error('Error adding product:', error);
          alert('Failed to add product. Please check the form and try again.');
        }
      },

    onCategoryChange() {
        const selectedCategory = this.categories.find(cat => cat.id === this.newProduct.categoryId);
        if (selectedCategory && Array.isArray(selectedCategory.subCategories)) {
          this.subcategories = [...selectedCategory.subCategories];
          this.newProduct.categoryName = selectedCategory.name;
         
        } else {
          this.subcategories = [];
          this.newProduct.categoryName = "";
        }
      },
      handleImageUpload(event) {
        const file = event.target.files[0];  // Hämtar den första filen användaren valde
        if (file) {
          const reader = new FileReader(); // Skapar en FileReader för att läsa filen (JavaScript-objekt )
          reader.onload = () => {
            this.newProduct.encodedImage = reader.result.split(',')[1]; // Omvandlar filen till base64 och lagrar den i produktens data
            console.log("Base64 Image:", this.newProduct.encodedImage); // .split(',') delar upp strängen vid kommatecknet hämtar den andra delen av den uppdelade strängen, det vill säga den faktiska base64-kodade bilddatan, eftersom den andra delen (index 1) innehåller själva bildinnehållet i base64-format.
          };
          reader.onerror = (error) => {
            console.error("Error reading image file:", error);
          };
          reader.readAsDataURL(file); // Läser filen som en data-URL (base64-kodad sträng)
        }
      },
  },
};
</script>


<style scoped>
  .form-container {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
.form-group {
    flex: 1;
    min-width: 200px;
    margin-bottom: 15px;
  }
  .form-row {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }


button {
    margin-right: 10px;
    padding: 10px 15px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
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
  
</style>
