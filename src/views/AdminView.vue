<template>
    <div class="admin-portal container">
      <h1>Admin Panel</h1>
      <div>
        <button @click="setActiveForm('product')">Add product</button>
        <button @click="setActiveForm('category')">Add Category</button>
        <button @click="setActiveForm('subcategory')">Add Subcategory</button>
        <button @click="setActiveForm('categoryEdit')">Manage Categories</button>
        <button @click="setActiveForm('orders')">Manage Orders</button>


      </div>

      <ProductForm v-if="activeForm === 'product'"  />
  
      <CategoryForm v-if="activeForm === 'category'"  />
  
      <SubCategoryForm v-if="activeForm === 'subcategory'"  />
  
      <CategoryManagement v-if="activeForm === 'categoryEdit'" />

      <OrderManagement v-if="activeForm === 'orders'" />



    



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

  import { mapActions, mapGetters } from "vuex";
  import AllProductsList from '@/components/products/AllProductsList.vue';
import SortByDropdown from '@/components/products/SortByDropdown.vue';
import ProductForm from '@/components/products/ProductForm.vue';
import CategoryForm from '@/components/categories/CategoryForm.vue';
import SubCategoryForm from '@/components/categories/SubCategoryForm.vue';
import CategoryManagement from '@/components/categories/CategoryManagement.vue';
import OrderManagement from '@/components/orders/OrderManagement.vue'; // Importera OrderManagement-komponenten

  
  export default {
    components: {
      AllProductsList,
      SortByDropdown,
      OrderManagement,
      CategoryManagement,
      SubCategoryForm,
      CategoryForm,
      ProductForm
    },
    data() {
      return {
        activeForm: null,
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
      
      this.isDropdownOpen = !this.isDropdownOpen;
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

    .filter-container {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>

  