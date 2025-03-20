<template>
    <div>
      <h2 class="categories-title">Categories and Subcategories</h2>
      <div id="manageCategories">
      <div v-for="category in categories" :key="category.id" class="category-container">
        <div class="category-header">
          <h3 class="category-title">{{ category.name }}</h3>
          <div class="category-actions">
            <button @click="toggleEditCategoryForm(category)" class="edit-button">
              <i class="fa-solid fa-edit"></i>
            </button>
            <button @click="confirmDeleteCategory(category.id)" class="delete-button">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
  
        <div class="subcategory-container">
          <div v-for="subcategory in category.subCategories" :key="subcategory.id" class="subcategory">
            <span>{{ subcategory.name }}</span>
            <div class="subcategory-actions">
              <button @click="toggleEditSubCategoryForm(subcategory)" class="edit-button">
                <i class="fa-solid fa-edit"></i>
              </button>
              <button @click="confirmDeleteSubCategory(subcategory.id)" class="delete-button">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Redigera kategori -->
      <div v-if="isEditing" class="modal-overlay" @click="cancelEditCategory">
        <div class="modal-content" @click.stop>
          <h3>Edit Category</h3>
          <form @submit.prevent="submitEditCategory">
            <div class="form-group">
              <label for="editCategoryName">Category Name</label>
              <input type="text" v-model="editingCategory.name" id="editCategoryName" required />
            </div>
            <button type="submit">Update Category</button>
            <button type="button" @click="cancelEditCategory">Cancel</button>
          </form>
        </div>
      </div>
  
      <!-- Redigera subkategori -->
      <div v-if="isEditingSubCategory" class="modal-overlay" @click="cancelEditSubCategory">
        <div class="modal-content" @click.stop>
          <h3>Redigera Subkategori</h3>
          <form @submit.prevent="submitEditSubCategory">
            <div class="form-group">
              <label for="editSubCategoryName">Subcategory name</label>
              <input type="text" v-model="editingSubCategory.name" id="editSubCategoryName" required />
            </div>
            <div class="form-group">
              <label for="editCategory">Category</label>
              <select v-model="editingSubCategory.categoryId" id="editCategory" required>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <button type="submit">Update subcategory</button>
            <button type="button" @click="cancelEditSubCategory">Cancel</button>
          </form>
        </div>
      </div>
    </div>
</div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from "vuex";
  
  export default {
    data() {
      return {
        isEditing: false,
        isEditingSubCategory: false,
        editingCategory: {},
        editingSubCategory: {},
      };
    },
    computed: {
      ...mapGetters("categories", ["categories"]),
    },
    methods: {
      ...mapActions("categories", ["deleteCategory", "deleteSubCategory", "updateCategory", "updateSubCategory"]),

  async confirmDeleteCategory(categoryId) {
    const confirmed = window.confirm("Are you sure you want to delete this category? All products in it can also be deleted!");
    if (confirmed) {
      try {
        await this.deleteCategory(categoryId);
      } catch (error) {
        console.error("Fel vid radering av kategori:", error);
      }
    }
  },
  async confirmDeleteSubCategory(subCategoryId) {
    const confirmed = window.confirm("Are you sure you want to delete this category? All products in it can also be deleted!");
    if (confirmed) {
      try {
        await this.deleteSubCategory(subCategoryId);
      } catch (error) {
        console.error("Fel vid radering av subkategori:", error);
      }
    }
  },
      toggleEditCategoryForm(category) {
        this.editingCategory = { ...category };
        this.isEditing = true;
      },
      cancelEditCategory() {
        this.isEditing = false;
        this.editingCategory = {};
      },
      async submitEditCategory() {
        try {
          await this.updateCategory(this.editingCategory);
          this.isEditing = false;
        } catch (error) {
          console.error("Error updating category:", error);
        }
      },
      toggleEditSubCategoryForm(subcategory) {
        this.editingSubCategory = { ...subcategory };
        this.isEditingSubCategory = true;
      },
      cancelEditSubCategory() {
        this.isEditingSubCategory = false;
        this.editingSubCategory = {};
      },
      async submitEditSubCategory() {
        try {
          await this.updateSubCategory(this.editingSubCategory);
          this.isEditingSubCategory = false;
        } catch (error) {
          console.error("Error updating subcategory:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>

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
  
  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; 
}


.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
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
  padding-left: 25px; 
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
  background-color: rgb(94, 5, 5);
}

.edit-button {
  cursor: pointer;
  transition: background-color 0.3s;
}
.edit-button:hover {
  background: green;
}
.form-group {
    flex: 1;
    min-width: 200px;
    margin-bottom: 15px;
  }

  


  </style>
  