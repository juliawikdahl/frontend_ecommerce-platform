<template>
  <div class="form-container">
    <form @submit.prevent="submitAddSubCategory">
      <h2>Add a New SubCategory</h2>
      <div class="form-group">
        <label for="subcategoryName">Subcategory Name</label>
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
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      newSubCategory: {
        name: '',
        categoryId: null,
      },
    };
  },
  computed: {
    ...mapGetters('categories', ['categories']),
  },
  methods: {
   
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
