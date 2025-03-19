<template>
  <div class="form-container">
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

</template>
<script>
import { mapGetters } from 'vuex';

export default {
data() {
  return {
    newCategory: {
        name: "",
      },
  };
},
computed: {
  ...mapGetters('categories', ['categories']),
},
methods: {
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
