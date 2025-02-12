<template>
    <div class="admin-portal container">
      <h1>Admin Panel</h1>
      <div>
        <button @click="setActiveForm('product')">Add product</button>
        <button @click="setActiveForm('category')">Add Category</button>
        <button @click="setActiveForm('subcategory')">Add SubCategory</button>
        <button @click="setActiveForm('manage')">Manage Categories</button>

      </div>
      <div v-if="activeForm === 'product'" class="form-container">
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
              <label for="productSubcategory">SubCategory</label>
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
    
      <div v-if="activeForm === 'category'" class="form-container">
          <form @submit.prevent="submitAddCategory">
              <h2>Add a New Category</h2>
              <div class="form-group">
                  <label for="categoryName">Category Name</label>
                  <input type="text" v-model="newCategory.name" id="categoryName" required />
              </div>
              <div class="form-group">
                  <button type="submit">Add Category</button>
              </div>
          </form>
      </div>
  
      <div v-if="activeForm === 'subcategory'" class="form-container">
          <form @submit.prevent="submitAddSubCategory">
              <h2>Add a New SubCategory</h2>
              <div class="form-group">
                  <label for="subcategoryName">SubCategory Name</label>
                  <input type="text" v-model="newSubCategory.name" id="subcategoryName" required />
              </div>
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


<div v-if="activeForm === 'manage'">
  <h2 class="categories-title">Categories and Sub Categories</h2>

  <div id="manageCategories">
    <div v-for="category in categories" :key="category.id" class="category-container">
    <!-- Kategorinamn och actions för redigering och borttagning -->
    <div class="category-header">
      <h3 class="category-title">{{ category.name }}</h3>
      <div class="category-actions">
        <button @click="toggleEditCategoryForm(category)" class="edit-button"><i class="fa-solid fa-edit"></i></button>
        <button @click="deleteCategory(category.id)" class="delete-button"> <i class="fa-solid fa-trash"></i></button>
      </div>
    </div>

    <!-- Subkategorier under varje kategori -->
    <div class="subcategory-container">
      <div v-for="subcategory in category.subCategories" :key="subcategory.id" class="subcategory">
        <span>{{ subcategory.name }}</span>
        <div class="subcategory-actions">
          <button @click="toggleEditSubCategoryForm(subcategory)" class="edit-button"> <i class="fa-solid fa-edit"></i></button>
          <button @click="deleteSubCategory(subcategory.id)" class="delete-button"> <i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>
  </div>

  <!-- Redigera kategori -->
  <div v-if="isEditing" class="modal-overlay" @click="cancelEditCategory">
    <div class="modal-content" @click.stop>
      <h3>Redigera kategori</h3>
      <form @submit.prevent="submitEditCategory">
        <div class="form-group">
          <label for="editCategoryName">Kategorinamn</label>
          <input type="text" v-model="editingCategory.name" id="editCategoryName" required />
        </div>
        <button type="submit">Uppdatera kategori</button>
        <button type="button" @click="cancelEditCategory">Avbryt</button>
      </form>
    </div>
  </div>


  <!-- Redigera subkategori -->
  <div v-if="isEditingSubCategory" class="modal-overlay" @click="cancelEditSubCategory">
    <div class="modal-content" @click.stop>
      <h3>Redigera Subkategori</h3>
      <form @submit.prevent="submitEditSubCategory">
        <div class="form-group">
          <label for="editSubCategoryName">Subkategori Namn</label>
          <input type="text" v-model="editingSubCategory.name" id="editSubCategoryName" required />
        </div>
        <div class="form-group">
          <label for="editCategory">Kategori</label>
          <select v-model="editingSubCategory.categoryId" id="editCategory" required>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <button type="submit">Uppdatera Subkategori</button>
        <button type="button" @click="cancelEditSubCategory">Avbryt</button>
      </form>
    </div>
  </div>
  </div>

 
</div>
    



      <div class="filter-container">
        <h2 class="filter-title">Filter Products:</h2>
      <div class="filter-box">
        <select id="categoryFilter" v-model="selectedCategory" @change="filterProducts" class="form-select">
          <option value="" disabled selected>Choose a Category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>

      <div class="filter-box">
        <select id="subcategoryFilter" v-model="selectedSubCategory" @change="filterProducts" class="form-select">
          <option value="" disabled selected >Choose a SubCategory</option>
          <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">{{ subcategory.name }}</option>
        </select>
      </div>
    </div>

    <SortByDropdown @updateSortOrder="updateSortOrder" />

    
      <div>
          <div v-if="loading" class="spinner">Laddar...</div>
          <div v-else>
            <h1>
                <!-- Dynamiskt ändra rubriken baserat på de valda filtren -->
                <span v-if="selectedCategory && selectedSubCategory">
                    Products in {{ getCategoryName(selectedCategory) }} > {{ getSubCategoryName(selectedSubCategory) }}
                </span>
                <span v-else-if="selectedCategory">
                    Products in {{ getCategoryName(selectedCategory) }}
                </span>
                <span v-else>
                    All products
                </span>
            </h1>
              <AllProductsList :products="filteredProducts" :isAdmin="true" />
          </div>
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      </div>
    </div>
  </template>
  
  <script>
  import { addProduct } from '@/api/products';
  import { mapActions, mapGetters } from "vuex";
  import AllProductsList from '@/components/products/AllProductsList.vue';
import SortByDropdown from '@/components/products/SortByDropdown.vue';
  
  export default {
    components: {
      AllProductsList,
      SortByDropdown
    },
    data() {
      return {
        activeForm: null,
        showEditCategoryForm: false,
        isEditing: false, 
        isEditingSubCategory: false,
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
        newCategory: {
          name: "",
        },
        newSubCategory: {
          name: "",
          categoryId: null
        },
        selectedCategory: '',
        selectedSubCategory: '',
        filteredProducts: [],
        loading: false,
        successMessage: '', 
        errorMessage: '', 
        sortOrder: 'nameAsc',
       
        
      };
    },
    computed: {
      ...mapGetters('products', ['allProducts']),
      ...mapGetters('categories', ['categories']), // här hämtas kategorierna ifrån vuex
    },

    // förstår inte varför jag måste köra loadallproducts, borde gå att bara hämta via products som det går med category
    // titta på detta !!
    mounted() {
      try {
        this.loading = true;
        this.loadAllProducts().then(() => {
          console.log('All Products:', this.allProducts);
          if (this.allProducts && this.allProducts.length > 0) {
            this.filteredProducts = [...this.allProducts];  
            this.sortProducts();
          }
        });
      } catch (error) {
        this.errorMessage = "Kunde inte hämta produkter.";
      } finally {
        this.loading = false;
      }
   },
   
    methods: {
      ...mapActions('products', ['loadAllProducts']),
      ...mapActions('categories', ['addCategory', 'addSubCategory']),


      setActiveForm(form) {
        this.activeForm = this.activeForm === form ? null : form; // Om samma knapp trycks igen döljs formuläret
      },

      toggleSortDropdown() {
      // Växla öppning och stängning av dropdown
      this.isDropdownOpen = !this.isDropdownOpen;
    },
     // Den första raden söker igenom listan av categories (som hämtas från Vuex) 
     // och hittar den kategori vars id matchar den categoryId som är kopplad till den nya produkten (this.newProduct.categoryId)
     // Om en kategori med motsvarande ID finns, kommer den att lagras i variabeln selectedCategory
     // sedan kontrolleras om selectedCategory existerar och om den har en egenskap subCategories som är en array
     // om så är fallet går vi vidare och uppdaterar listan med underkatergorier,  this.subcategories uppdateras till 
     // att innehålla alla underkategorier från den valda kategorin (selectedCategory.subCategories
     // this.newProduct.categoryName sätts till namnet på den valda kategorin (selectedCategory.name).
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

      // vi behöver hämta namnet på subcategorin eftersom vi bara binder subcategoryid, 
      // vi behöver inte göra det på categorys för vi binder namnet på category i categoryonchange metoden istället
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
          this.newCategory.name = "";
          alert("Category added successfully!");
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category. Please try again.');
        }
      },

      async submitAddSubCategory() {
        try {
          if (!this.newSubCategory.name || !this.newSubCategory.categoryId) {
            alert("Please provide both a name and a category for the subcategory.");
            return;
          }
  
          const subCategoryData = {
            name: this.newSubCategory.name,
            categoryId: this.newSubCategory.categoryId,
          };
  
          console.log('SubCategory data from:', subCategoryData); 
  
          await this.$store.dispatch('categories/addSubCategory', subCategoryData );
  
          this.newSubCategory.name = "";
          this.newSubCategory.categoryId = null;
          this.showAddSubCategoryForm = false;
          alert("SubCategory added successfully!");
        } catch (error) {
          console.error("Failed to add subcategory:", error);
          alert("Failed to add subcategory. Please try again.");
        }
      },

      toggleEditCategoryForm(category) {
        this.editingCategory = { ...category }; // Kopiera kategorin
        this.isEditing = true; // Sätt redigeringsformuläret till "true"
    },
    cancelEditCategory() {
    this.isEditing = false; // Stänger redigeringsmodalen för kategori
    this.editingCategory = {}; // Återställ den redigerade kategorin till ett tomt objekt (om du vill)
  },

    async submitEditCategory() {
  try {
    // Skapa objektet som ska skickas
    const updatedCategory = {
      id: this.editingCategory.id,
      name: this.editingCategory.name
    };

    // Uppdatera kategori via Vuex och få svar från servern
    const response = await this.$store.dispatch('categories/updateCategory', updatedCategory);

    // Kontrollera om uppdateringen var framgångsrik
    if (response.success) {
      this.successMessage = "Kategori uppdaterad!";  // Sätt framgångsmeddelande
      this.errorMessage = '';  // Rensa felmeddelande om uppdateringen lyckades
      this.isEditing = false;
    } else {
      this.successMessage = '';  // Rensa framgångsmeddelande om uppdateringen misslyckades
      this.errorMessage = "Fel vid uppdatering av kategori. Försök igen.";  // Sätt felmeddelande
    }

  } catch (error) {
    console.error("Fel vid uppdatering av kategori:", error);
    this.successMessage = '';  // Rensa framgångsmeddelande om ett fel inträffade
    this.errorMessage = "Fel vid uppdatering av kategori. Försök igen.";  // Sätt felmeddelande
  }
},

toggleEditSubCategoryForm(subcategory) {
      this.editingSubCategory = { ...subcategory }; // Copy the subcategory data for editing
      this.isEditingSubCategory = true; // Show the editing form
    },

   cancelEditSubCategory() {
    this.isEditingSubCategory = false; // Stänger redigeringsmodalen för subkategori
    this.editingSubCategory = {}; // Återställ den redigerade subkategorin till ett tomt objekt (om du vill)
  },


    async submitEditSubCategory() {
  try {
    // Logga data som skickas
    console.log('Submitting subcategory update with data:', this.editingSubCategory);

    // Uppdatera subkategori data via Vuex eller API
    const updatedSubCategory = {
      id: this.editingSubCategory.id,
      name: this.editingSubCategory.name,
      categoryId: this.editingSubCategory.categoryId
    };

    // Logga uppdaterad subkategori
    console.log('Updated subcategory object:', updatedSubCategory);

    // Skicka uppdaterad subkategori till Vuex action
    console.log('Dispatching updateSubCategory action...');
    await this.$store.dispatch('categories/updateSubCategory', updatedSubCategory);

    // Logga framgång
    console.log('Subcategory update successful');

    // Visa framgångsmeddelande och dölja redigeringsformulär
    this.successMessage = "SubCategory updated successfully!";
    this.errorMessage = ''; // Rensa felmeddelande vid framgång
    this.isEditingSubCategory = false; // Dölj redigeringsformuläret
    this.editingSubCategory = null; // Återställ redigeringsdata
  } catch (error) {
    // Logga fel vid uppdatering
    console.error("Error updating subcategory:", error);

    // Rensa framgångsmeddelande och visa felmeddelande
    this.successMessage = ''; // Rensa framgångsmeddelande vid fel
    this.errorMessage = "Error updating subcategory. Please try again.";
  }
},


async deleteCategory(id) {
  const confirmed = confirm("Är du säker på att du vill ta bort denna kategori?");
  if (!confirmed) return; 

  try {
    await this.$store.dispatch('categories/deleteCategory', id);
    alert("Kategori borttagen!");
  } catch (error) {
    console.error("Error deleting category:", error);
    alert("Fel vid borttagning av kategori.");
  }
},

async deleteSubCategory(id) {
  const confirmed = confirm("Är du säker på att du vill ta bort denna subkategori?");
  if (!confirmed) return; // Avbryt om användaren väljer "Avbryt"

  try {
    await this.$store.dispatch('categories/deleteSubCategory', id);
    alert("Subkategori borttagen!");
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    alert("Fel vid borttagning av subkategori.");
  }
},



      // let filtered = this.allProducts;: Här skapas en kopia av hela produktlistan (this.allProducts) och sparas i variabeln filtered. 
       // Om användaren har valt en kategori filtreras filtered-listan så att den bara innehåller produkter vars categoryId matchar det valda kategori-ID:t.
       // Sedan kollar vi om subkategori är vald så kollar vi om den finns i den valda kategorin 
       // const validSubCategory = this.subcategories.find(...): Vi letar efter subkategorin (selectedSubCategory) i listan av subkategorier som tillhör den valda kategorin. Om den inte finns, sätts selectedSubCategory till null.
      // Detta är viktigt för att säkerställa att om användaren har en subkategori vald, men när de byter kategori, så kanske den subkategorin inte längre finns för den nya kategorin. I så fall behöver den nollställas.
      // Uppdatera subkategorier: Efter att ha filtrerat produkter baserat på kategori, anropar vi updateSubCategoriesOnFilterChange, vilket kommer att uppdatera listan av tillgängliga subkategorier för den valda kategorin.
      // else, om ingen kategori är vald (dvs selectedcategory är null) töms listan över subkategorier eftersom  det inte finns någon kategori att filtrea på
      // om en subkategori är vald (selectedsubcategory) så filtrers produkterna ytterligare för att visa de som har en subcategoryID som matchar den valda kategorin
      //this.filteredProducts = filtered;: Efter att ha filtrerat produkterna baserat på kategori och subkategori, uppdaterar vi listan filteredProducts som används i komponenten för att visa produkterna.

    async filterProducts() {
        let filtered = this.allProducts;

        // Filtrera produkter baserat på vald kategori
        if (this.selectedCategory) {
          filtered = filtered.filter(product => product.categoryId === this.selectedCategory);

          // Om subkategori är vald, kolla om den finns inom den valda kategorin
          if (this.selectedSubCategory) {
            const validSubCategory = this.subcategories.find(subCat => subCat.id === this.selectedSubCategory);
            if (!validSubCategory) {
              // Om subkategori inte finns för den valda kategorin, sätt den till null
              this.selectedSubCategory = null;
            }
          }

          // Uppdatera subkategorier baserat på vald kategori
          await this.updateSubCategoriesOnFilterChange(this.selectedCategory);
        } else {
          this.subcategories = [];
        }
        // Filtrera på subkategori om den är vald och finns i den valda kategorin
        if (this.selectedSubCategory) {
          filtered = filtered.filter(product => product.subCategoryId === this.selectedSubCategory);
        }

        console.log("Filtered Products:", filtered);
        this.filteredProducts = filtered;
       this.sortProducts();
},

    // Denna metod tar ett categoryId som argument. Det är den valda kategorin som användaren har gjort i dropdown-menyn.
    //Om det finns ett kategori-ID (dvs. användaren har faktiskt valt en kategori), fortsätter koden nedanför för att uppdatera subkategori-listan.
    //const selectedCategory = this.categories.find(cat => cat.id === categoryId);: Metoden letar upp den kategori i this.categories-listan som matchar det valda categoryId
    // if (selectedCategory): Om den valda kategorin finns, sätts this.subcategories till värdet av selectedCategory.subCategories.
    // if (!this.subcategories.some(...)): Vi kollar om den aktuella valda subkategorin (this.selectedSubCategory) finns bland de subkategorier som tillhör den valda kategorin.
    // this.selectedSubCategory = null;: Om subkategorin inte finns, sätts this.selectedSubCategory till null (dvs. nollställs).
    // else,  Om ingen kategori har valts (dvs. categoryId är null), töms listan över subkategorier genom att sätta this.subcategories till en tom lista..

    async updateSubCategoriesOnFilterChange(categoryId) {
      try {
        if (categoryId) {
          const selectedCategory = this.categories.find(cat => cat.id === categoryId);
          
          if (selectedCategory) {
            this.subcategories = selectedCategory.subCategories || [];
            
            if (!this.subcategories.some(subCat => subCat.id === this.selectedSubCategory)) {
          this.selectedSubCategory = null;
        }
          }
        } else {
          this.subcategories = [];
        }
      } catch (error) {
        console.error("Error fetching subcategories on filter change:", error);
        this.subcategories = [];
      }
    },

    updateSortOrder(newSortOrder) {
      this.sortOrder = newSortOrder;
      this.sortProducts(); // Sortera om produkterna när sorteringsordningen ändras
    },

    sortProducts() {
      console.log("Sorterar produkter efter:", this.sortOrder);

      const order = this.sortOrder;

      if (this.filteredProducts.length === 0) {
        console.log("Inga produkter att sortera.");
        return;
      }

      let sortedProducts = [...this.filteredProducts];

      if (order === 'nameAsc') {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name)); // Sortera efter namn (A-Ö)
      } else if (order === 'nameDesc') {
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name)); // Sortera efter namn (Ö-A)
      } else if (order === 'priceAsc') {
        sortedProducts.sort((a, b) => a.price - b.price); // Sortera efter pris (Lägst till Högst)
      } else if (order === 'priceDesc') {
        sortedProducts.sort((a, b) => b.price - a.price); // Sortera efter pris (Högst till Lägst)
      } else if (order === 'dateAsc') {
        sortedProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sortera efter datum (Äldsta först)
      } else if (order === 'dateDesc') {
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sortera efter datum (Nyaste först)
      }

      this.filteredProducts = sortedProducts; // Uppdatera den sorterade listan
    },



      getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : '';
    },
    
    // Hämta underkategorinamnet
    getSubCategoryName(subCategoryId) {
      const subCategory = this.subcategories.find(sub => sub.id === subCategoryId);
      return subCategory ? subCategory.name : '';
    },

  
      
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
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 1.5rem;
    color: #444;
  }
  
  button {
    margin-right: 10px;
    padding: 10px 15px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
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
    flex: 1;
    min-width: 200px;
    margin-bottom: 15px;
  }
  .form-row {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
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
  
  #manageCategories {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 20px;
  padding: 0 20px 20px 20px;
}
.categories-title {
  margin-top: 1.5rem;
}


.category-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
}
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.category-title {
  font-size: 1.5rem;
  color: #333;
  border-bottom: 1px solid black;
}

.subcategory-container {
  margin-top: 10px;
  padding-left: 25px; /* Gör så att subkategorierna går inåt */
}

.subcategory {
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subcategory span {
  font-size: 1.1rem;
  color: #555;
}

.delete-button {
background-color: rgb(206, 10, 10);
transition: background-color 0.3s;
}
.delete-button:hover {
  background-color: rgb(170, 9, 9);
}

.edit-button {
  cursor: pointer;
  transition: background-color 0.3s;
}

 /* Kategorihantering */
 .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); /* Mörk bakgrund */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Se till att modalens overlay är ovanpå allt annat */
}

/* Innehåll i modalen */
.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
}

  /* Filter container */
  
  .filter-container {
    margin-top: 2rem;
    display: block;
    gap: 20px;
  
  }
  .filter-title {
    text-align: left;
  }

  .filter-box {
    width: 220px;
  }
 

  select.form-select {
    padding: 8px;
    font-size: 1rem;
    border-radius: 5px;
  }

  select option:disabled {
    color: #888 !important;
    font-style: italic;
  }

  select:focus {
    outline: none;
    border-color: #070707;
  }

  .spinner {
    display: inline-block;
    margin-top: 10px;
    font-size: 1.2rem;
    color: #007BFF;
  }

  /* Felmeddelanden */
  .error {
    margin-top: 10px;
    color: red;
  }

 

  /* Responsiv design */
  @media (max-width: 768px) {
    .admin-portal {
      padding: 10px;
    }

    .form-container {
      padding: 15px;
      margin-top: 15px;
      max-width: 100%;
    }

    .form-row {
      flex-direction: column;
      gap: 10px;
    }

    .filter-container {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>

  