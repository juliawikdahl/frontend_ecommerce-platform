import { getCategories, postCategory, postSubCategory} from '@/api/categories';
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
    }
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
        const newCategory = await postCategory(categoryData); // Skicka POST-begäran
        console.log('Category added:', newCategory);
        commit('addCategoryToState', newCategory);
        dispatch('loadCategories'); // Hämta uppdaterade kategorier
      } catch (error) {
        console.error('Failed to add category:', error);
      }
    },
    async addSubCategory({ commit }, { categoryId, subCategoryData }) {
      try {
        const newSubCategory = await postSubCategory(categoryId, subCategoryData); // Skicka POST-begäran för subkategori
        console.log('SubCategory added:', newSubCategory);
        commit('addSubCategoryToState', { categoryId, subCategory: newSubCategory }); // Lägg till den nya subkategorin till Vuex state
      } catch (error) {
        console.error('Failed to add subcategory:', error);
      }
    }
  }
};
