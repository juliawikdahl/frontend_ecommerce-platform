import { getCategories, postCategory, postSubCategory, putCategory, putSubCategory, deleteCategory, deleteSubCategory} from '@/api/categories';
import clothingImg from '@/assets/images/clothing.jpg';
import accessoriesImg from '@/assets/images/accesories.avif';
import homeImg from '@/assets/images/home.avif';
import shoesImg from '@/assets/images/shoes.jpg';

export default {
namespaced: true,
  state: {
    categories: [],
    subcategories: [],
    featuredCategoryIds: [1, 2, 3,4],
    featuredImages: {
        1: clothingImg,
        2: accessoriesImg,
        3: homeImg,
        4: shoesImg,
    }
  },
  getters: {
    categories(state) {
        return state.categories;
    },
    featuredCategories(state) {
        return state.categories
          .filter(category => state.featuredCategoryIds.includes(category.id))
          .map(category => ({
            ...category,
            customImageUrl: state.featuredImages[category.id] // Här kopplas rätt bild till varje kategori
          }));
      },
 
      subcategoriesByCategoryId: (state) => (categoryId) => {
        return state.subcategories[categoryId] || []; // Hämta subkategorier för en specifik kategori
      }
      
  },
  mutations: {
    setCategories(state, categories) {
      state.categories = categories;
    },
    addCategoryToState(state, newCategory) {
      state.categories.push(newCategory);
    },
    addSubCategoryToState(state, {categoryId, subCategory}) {
      if (!state.subcategories[categoryId]) {
        state.subcategories[categoryId] = [];
      }
      state.subcategories[categoryId].push(subCategory);
    },
    updateCategoryToState(state, updatedCategory) {
      const index = state.categories.findIndex(cat => cat.id === updatedCategory.id);
      if(state !== -1) {
        state.categories.splice(index, 1, updatedCategory);
      }
    },
    updateSubCategoryToState(state, {categoryId, updatedSubCategory}) {
      if (state.subcategories[categoryId]) {
        const index = state.subcategories[categoryId].findIndex(sub => sub.id === updatedSubCategory.id);
        if (index !== -1) {
          state.subcategories[categoryId].splice(index, 1, updatedSubCategory);
        }
      }
    },
    deleteCategoryFromState(state, categoryId) {
      state.categories = state.categories.filter(cat => cat.id !== categoryId);
    },
    deleteSubCategoryFromState(state, { subcategoryId }) {
      // Iterera över alla kategorier för att ta bort subkategorin
      for (const categoryId in state.subcategories) {
        if (state.subcategories[categoryId]) {
          // Här tar vi bort subkategorin baserat på dess ID
          state.subcategories[categoryId] = state.subcategories[categoryId].filter(sub => sub.id !== subcategoryId);
        }
      }
    },
  },
  actions: {
    async loadCategories({ commit }) {
      try {
        const categories = await getCategories();
        console.log(categories); // Logga datan för debugging
        commit('setCategories', categories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    },
 
    async addCategory({ commit, dispatch }, categoryData) {
      try {
        // Logga categoryData för att kontrollera att rätt data skickas
        console.log('Skickar kategori till API:', categoryData);
    
        const newCategory = await postCategory(categoryData); // Skicka POST-begäran
        console.log('Kategori tillagd:', newCategory); // Logga svaret från servern
    
        // Lägg till den nya kategorin i Vuex state
        commit('addCategoryToState', newCategory);
        
        // Hämta uppdaterade kategorier från servern
        await dispatch('loadCategories');
      } catch (error) {
        // Logga eventuella fel
        console.error('Failed to add category:', error.response ? error.response.data : error);
      }
    },
    


async addSubCategory({ commit }, subCategoryData) {
    try {
      // Logga subCategoryData innan du skickar den till postSubCategory
      console.log("subCategoryData innan skickas:", subCategoryData);

      // Skicka subCategoryData direkt till postSubCategory
      const newSubCategory = await postSubCategory(subCategoryData); 
      console.log('SubCategory added:', newSubCategory);

      commit('addSubCategoryToState', { categoryId: subCategoryData.categoryId, subCategory: newSubCategory });
    } catch (error) {
      console.error('Failed to add subcategory:', error);
    }
    },
  // Vuex: Action för att uppdatera kategori
async updateCategory({ commit }, updatedCategory) {
  try {
    // Skicka både ID och namn till API:t
    const response = await putCategory(updatedCategory.id, {
      name: updatedCategory.name 
    });
    commit('updateCategoryToState', response); 
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
},


async updateSubCategory({ commit }, updatedSubCategory) {
  try {
    // Gör API-anropet för att uppdatera subkategori
    const response = await putSubCategory(updatedSubCategory.id, {
      categoryId: updatedSubCategory.categoryId,
      name: updatedSubCategory.name
    });
    console.log('SubCategory updated:', response);
    commit('updateSubCategoryToState', response); // Uppdatera Vuex state
  } catch (error) {
    console.error('Failed to update subcategory:', error);
    if (error.response) {
      // Om det finns ett svar från servern
      console.error('Error response:', error.response.data);
    } else {
      // Om det inte finns ett svar från servern
      console.error('Error message:', error.message);
    }
    throw error;  // Kasta om felet så att det kan hanteras i komponenten
  }
},


    async deleteCategory({ commit }, categoryId) {
      try {
        await deleteCategory(categoryId);
        console.log('Category deleted:', categoryId);
        commit('deleteCategoryFromState', categoryId);
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    },
    async deleteSubCategory({ commit }, subcategoryId) {
      try {
        await deleteSubCategory(subcategoryId);
        console.log('SubCategory deleted:', subcategoryId);
        commit('deleteSubCategoryFromState', { subcategoryId });
      } catch (error) {
        console.error('Failed to delete subcategory:', error);
      }
    },
  }
};
