<template>
    <div class="admin-portal container">
      <h1>Admin Panel</h1>
      <div>
          <button @click="showAddProductForm = !showAddProductForm"> 
             Add product
          </button>
          <button @click="showAddCategoryForm = !showAddCategoryForm">
              Add Category
          </button>
          <button @click="showAddSubCategoryForm = !showAddSubCategoryForm">
              Add SubCategory
          </button>
      </div>
      <div v-if="showAddProductForm" class="form-container">
          <form @submit.prevent="submitAddProduct">
              <h2>Add New Product</h2>
              <div class="form-group">
                  <label for="productName">Product Name</label>
                  <input type="text" v-model="newProduct.name" id="productName" required/>
              </div>
              <div class="form-group">
                  <label for="productDescription">Product Description</label>
                  <input type="text" v-model="newProduct.description" id="productDescription" required />
              </div>
              <div class="form-group">
                  <label for="productPrice">Price</label>
                  <input type="number" v-model="newProduct.price" id="productPrice" required />
              </div>
              <div class="form-group">
                  <label for="productStockQuantity">Stock Quantity</label>
                  <input type="number" v-model="newProduct.stockQuantity" id="productStockQuantity" required />
              </div>
              <div class="form-group">
                  <label for="productCategory">Category</label>
                  <select v-model="newProduct.categoryId" id="productCategory" required @change="onCategoryChange">
                      <option v-for="category in categories" :key="category.id" :value="category.id">
                          {{ category.name }}
                      </option>
                  </select>   
              </div>
              <div class="form-group">
                  <label for="productSubcategory">SubCategory</label>
                  <select v-model="newProduct.subCategoryId" id="productSubcategory" required>
                      <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
                          {{ subcategory.name }}
                      </option>
                  </select>
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
   
         <div v-if="showAddCategoryForm" class="form-container">
            <form @submit.prevent="submitAddCategory">
                <h2>Add New Category</h2>
                <div class="form-group">
                <label for="categoryName">Category Name</label>
                <input type="text" v-model="newCategory.name" id="categoryName" required />
                </div>
                <div class="form-group">
                <button type="submit">Add Category</button>
                </div>
            </form>
        </div>
  
    
        <div v-if="showAddSubCategoryForm" class="form-container">
            <form @submit.prevent="submitAddSubCategory">
            <h2>Add New SubCategory</h2>
            <div class="form-group">
            <label for="subcategoryName">SubCategory Name</label>
            <input type="text" v-model="newSubCategory.name" id="subcategoryName" required />
            </div>
            <!-- Välj kategori för subkategori -->
            <div class="form-group">
            <label for="subcategoryCategory">Category</label>
            <select v-model="newSubCategory.categoryId" id="subcategoryCategory" required>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
                </option>
            </select>
            </div>
            <div class="form-group">
            <button type="submit">Add SubCategory</button>
            </div>
         </form>
    </div>
     
      <div class="mt-4">
    <div v-if="loading" class="spinner">Laddar...</div>
    <div v-else>
      <h1>All products</h1>
      <AllProductsList :products="allProducts" :isAdmin="true" />
    </div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
    </div>
    
  </template>
  
  <script>
//   import { getCategories } from '@/api/categories';
  import { addProduct } from '@/api/products';
  import { mapActions, mapGetters } from "vuex";
  import AllProductsList from '@/components/products/AllProductsList.vue';
  
  export default {
    components: {
        AllProductsList
    },
    data() {
      return {
        showAddProductForm: false,
        showAddCategoryForm: false,
        showAddSubCategoryForm: false,
        subcategories: [],
        newCategory: {
            name: "",
        },
        newSubCategory: {
            name: "",
            categoryId: null
        },
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
          encodedImage: "" // Här sparas Base64-strängen för bilden
        },
       
      }
    },
    computed: {
        ...mapGetters('products', ['allProducts']),
        ...mapGetters('categories', ['categories']),
    },
    created() {
      this.fetchCategories();
    },
    async mounted() {
    try {
        await this.loadAllProducts();
    } catch (error) {
        this.errorMessage = "Kunde inte hämta produkter.";
    } finally {
        this.loading = false;
    }
  },
    methods: {
        ...mapActions('products', ['loadAllProducts']),
        ...mapActions('categories', [ 'addCategory', 'addSubCategory']),
        async fetchCategories() {
            try {
                await this.loadCategories(); 
            } catch (error) {
                console.error("Error fetching categories:", error);
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
  
      // Hantera uppladdning och konvertering av bild till Base64
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            this.newProduct.encodedImage = reader.result.split(',')[1]; // Extrahera Base64-sträng (utan metadata)
            console.log("Base64 Image:", this.newProduct.encodedImage);
          };
          reader.onerror = (error) => {
            console.error("Error reading image file:", error);
          };
          reader.readAsDataURL(file); // Konvertera bilden till Base64
        }
      },
  
      // Skicka produktdata inklusive Base64-bild till servern
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
            encodedImage: this.newProduct.encodedImage  // Skicka Base64-strängen här
          };
          
          const createdProduct = await addProduct(productData);
          console.log('Product added:', createdProduct);
          this.newProduct = {};  // Töm formuläret
        } catch (error) {
          console.error('Error adding product:', error);
          alert('Failed to add product. Please check the form and try again.');
        }
      },
      async submitAddCategory() {
        try {
          if (!this.newCategory.name) {
            alert("Please enter a category name.");
            return;
          }
            
          const categoryData = {
            name: this.newCategory.name,
          };

            await this.$store.dispatch('categories/addCategory', categoryData);
            console.log('Category added successfully:', categoryData);
            // Återställ formulärfält
            this.newCategory.name = "";
            alert("Category added successfully!");
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category. Please try again.');
        }
     },
     async submitAddSubCategory() {
  try {
    // Kontrollera att subkategori-namnet och kategori-id är ifyllda
    if (!this.newSubCategory.name || !this.newSubCategory.categoryId) {
      alert("Please provide both a name and a category for the subcategory.");
      return;
    }

    // Skapa objektet för subkategori-data som ska skickas till servern
    const subCategoryData = {
      name: this.newSubCategory.name,
      categoryId: this.newSubCategory.categoryId,
    };

    // Logga subCategoryData för att kontrollera vad som skickas
    console.log('SubCategory data from:', subCategoryData); // Lägg till denna rad för att logga datan

    // Anropa Vuex action för att lägga till subkategori
    await this.$store.dispatch('categories/addSubCategory', { categoryId: subCategoryData.categoryId, subCategoryData });

    // Återställ formfälten och ge feedback till användaren
    this.newSubCategory.name = "";
    this.newSubCategory.categoryId = null;
    this.showAddSubCategoryForm = false;
    alert("SubCategory added successfully!");

  } catch (error) {
    // Fångar upp eventuella fel som uppstår vid begäran
    console.error("Failed to add subcategory:", error);
    alert("Failed to add subcategory. Please try again.");
  }
}


  }
};
  </script>
  
  <style scoped>
  .admin-portal {
    display: block;
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    font-size: 2rem;
    color: #333;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #444;
  }
  
  button {
    margin-right: 10px;
    transition: background-color 0.3s ease;
  }
  
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
    margin-bottom: 15px;
  }
  
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
    color: #555;
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
  
  button[type="submit"] {
    margin-top: 10px;
    transition: background-color 0.3s ease;
  }
  
  button[type="submit"]:hover {
    background-color: #218838;
  }
  
  @media (max-width: 768px) {
    .form-container {
      width: 90%;
    }
  }
  </style>
  