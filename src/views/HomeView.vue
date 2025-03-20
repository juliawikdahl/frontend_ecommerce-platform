<template>
  <div class="home">
    <section class="featured-categories">
      <div class="categories-grid">
        <div v-for="category in featuredCategories" :key="category.id" class="category-card">
          <img
            :src="category.customImageUrl || 'https://via.placeholder.com/300x200'"
            :alt="category.name"
            class="category-image"
          />
          <div class="category-content">
            <router-link :to="`/category/${category.id}`">
              <h3 class="category-name">{{ category.name }}</h3>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'homeView',
  computed: {
    ...mapGetters('categories', ['categories', 'featuredCategories']),
  },
  created() {
    if (!this.categories || this.categories.length === 0) {
      this.loadCategories();
    }
  },
  methods: {
    ...mapActions('categories', ['loadCategories']),
  },
}
</script>

<style scoped>
.home {
  padding: 20px;
  background-color: #f9f9f9;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.category-image {
  width: 100%;
  height: 90%;
  object-fit: cover;
}

.category-content a {
  padding: 15px;
  text-align: center;
  text-decoration: none;
}

.category-name {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
}

@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .category-image {
    height: 150px;
  }
}
</style>
