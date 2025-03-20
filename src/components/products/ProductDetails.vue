<template>
  <div class="product-detail">
    <div v-if="product" class="product-card">
      <div class="card-img-container">
        <img :src="getImageSource(product)" alt="product.name" class="card-img-top" />
      </div>
      <div class="info-container">
        <div class="d-flex">
          <p class="product-name">
            <router-link :to="`/category/${product.categoryId}`">
              {{ product.categoryName }}/
            </router-link>
          </p>
          <p class="product-name">
            <router-link :to="`/subcategory/${product.subCategoryId}`">
               {{ product.subCategoryName }}
            </router-link>
          </p>
        </div>
        <div >
          <h1 class="product-name">{{ product.name }}</h1>
          <p class="product-price"><strong>{{ product.price }} kr</strong></p>
          <p class="product-description">{{ product.description }}</p>
        </div>
        <div class="button-container">
          <AddToCartButton :product="product" :showText="true"  />
          <WishlistButton :productId="product.id" />
        </div>
        <div class="about-us-info">
          <p class="info-row">Free delivery to Sweden within 1-3 working days*</p>
          <p class="info-row">Free climate-compensated deliveries</p>
          <p class="info-row">Read more about our return policy and fees</p>
        </div>
        <div class="reviews-section">
          <div class="reviews-box" @click="toggleReviews" :aria-expanded="reviewsOpen">
            <span class="reviews-text">Reviews</span>
            <div class="star-rating">
              <span v-for="n in getStars(calculateAverageRating()).full" :key="'full-' + n" class="star full">★</span>
              <span v-if="getStars(calculateAverageRating()).half" class="star half">★</span>
              <span v-for="n in getStars(calculateAverageRating()).empty" :key="'empty-' + n" class="star empty">★</span>
            </div>
            <span class="rating-number">
              {{ calculateAverageRating().toFixed(1) }} / 5
            </span>
            <span :class="{'rotated': reviewsOpen}" class="toggle-arrow">▼</span>
          </div>
          <div v-if="reviewsOpen" class="reviews-container">
            <div class="review-container" v-if="isAuthenticated">
              <button @click="showReviewForm = !showReviewForm"  class="review-btn">
                Write a review
              </button>
            </div>
            <div v-if="showReviewForm" class="review-form-container">
              <form @submit.prevent="submitReview">
                <div class="review-rating-container">
                  <label for="rating">Rating:</label>
                  <div class="star-rating">
                    <span v-for="n in 5" :key="'star-' + n" 
                          class="star" 
                          :class="{'filled': n <= hoverRating || n <= newReview.rating}"
                          @click="setRating(n)" 
                          @mouseover="hoverRating = n" 
                          @mouseleave="hoverRating = 0">
                      ★
                    </span>
                  </div>
                </div>
                <div class="review-comment-container">
                  <label for="comment">Comment:</label>
                  <textarea v-model="newReview.comment" id="comment" required class="comment-textarea"></textarea>
                </div>
                <div class="review-buttons">
                  <button type="submit" class="submit-button">Submit Review</button>
                </div>
              </form>
            </div>
            <div v-if="reviewsLoading" class="spinner">Loading reviews</div>
            <div v-else-if="reviewsError" class="error">{{ reviewsError }}</div>
            <div v-else>
              <div v-if="reviews.length === 0">
                No reviews
              </div>
              <div v-else>
                <div v-for="review in reviews" :key="review.id" class="review-card">
                  <p>{{ review.userName }}</p>
                  <span class="review-date">{{ formatDate(review.createdAt) }}</span>
                  <div class="star-rating">
                    <span v-for="n in getStars(review.rating).full" :key="'full-' + n" class="star full">★</span>
                    <span v-if="getStars(review.rating).half" class="star half">★</span>
                    <span v-for="n in getStars(review.rating).empty" :key="'empty-' + n" class="star empty">★</span>
                  </div>
                  <p>{{ review.comment }}</p>
                </div>
              </div>  
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-product-message">
      <p>No product data available.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AddToCartButton from '@/components/products/AddToCartButton.vue'; 
import WishlistButton from './WishlistButton.vue';
import { getProductReviews, postReview } from '@/api/reviews';

export default {
  name: 'ProductDetail',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      reviews: [],
      reviewsLoading: true,
      reviewsError: '',
      reviewsOpen: false,
      showReviewForm: false,
      newReview: {
         rating: 0,
        comment: ''
      },
      hoverRating: 0,
      successMessage: '',
    }
  },
  components: {
    AddToCartButton,
    WishlistButton,
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'isAdmin']),

    username() {
      return this.$store.state.auth.user ? this.$store.state.auth.user.username : 'Anonym';
    }
  },
  mounted() {
    this.fetchReviews();
  },
  methods: {
    getImageSource(product) {
      if(product.encodedImage && product.encodedImage.startsWith('data:image')) {
        return product.encodedImage;
      }
      if(product.encodedImage) {
        return `data:image/webp;base64,${product.encodedImage}`;
      }
      return 'default-image.jpg';
    },
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); 
      const day = String(d.getDate()).padStart(2, '0'); 
      return `${year}-${month}-${day}`;
    },

    async fetchReviews() {
      try {
        this.reviews = await getProductReviews(this.product.id);
        if (!Array.isArray(this.reviews)) {
          this.reviews = [];
        }
        this.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        this.reviewsLoading = false;
      } catch (error) {
        this.reviewsError = 'Något gick fel när vi hämtade recensionerna.';
        this.reviewsLoading = false;
        this.reviews = []; 
      }
    },

    toggleReviews() {
      this.reviewsOpen = !this.reviewsOpen;
      if(this.reviewsOpen && !this.reviews.length) {
        this.fetchReviews();
      }
    },

    getStars(rating) {
      const roundedRating = Math.round(rating * 2) / 2;
      const fullStars = Math.floor(rating);
      const halfStar = (roundedRating % 1) === 0.5 ? 1 : 0;
      const emptyStars = 5 - fullStars - halfStar; 

      return {
        full: fullStars,
        half: halfStar,
        empty: emptyStars
      }
    },

    calculateAverageRating() {
      if (this.reviews.length === 0) return 0;
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      return totalRating / this.reviews.length;
    },

    setRating(rating) {
      this.newReview.rating = rating; 
    },

    async submitReview() {
      const reviewData = {
        rating: this.newReview.rating,
        comment: this.newReview.comment
      };

      try {
        const response = await postReview(this.product.id, reviewData);
        
        if (response && Array.isArray(response.reviews)) {
          this.reviews = response.reviews;
        } else {
          this.reviews = [];
        }

        this.reviewsOpen = false;
        this.fetchReviews();

        this.newReview = { rating: 5, comment: '' };
        this.showReviewForm = false;
        this.successMessage = 'Din recension har skickats in och kommer att synas snart!';
      } catch (error) {
        this.reviewsError = 'Något gick fel när vi skickade din recension. Försök igen senare.';
      }
    }
  }
};
</script>

<style scoped>
.product-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4rem;
  background-color: #f4f4f4;
}

.product-card {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  max-width: 900px;
  width: 100%;
  gap: 20px;
}

.card-img-container {
  width: 60%;
  height: 100%;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-img-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.product-name {
  font-weight: bold;
  margin-bottom: 10px;
}

.product-name a {
  color: black;
  text-decoration: none;
}

.product-name a:hover {
  color: black;
  text-decoration: underline;
}

.product-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.product-price {
  font-size: 24px;
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  gap: 10px;
}

.no-product-message {
  color: #e74c3c;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}

.about-us-info {
  margin-top: 1rem;
}

.info-row {
  margin: 0;
}

.reviews-section {
  margin-top: 20px;
  border-top: 1px solid #ccc;
  padding-top: 10px;
}

.reviews-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #ccc;
}

.reviews-text {
  font-weight: bold;
}

.toggle-arrow {
  transition: transform 0.3s ease;
}

.toggle-arrow.rotated {
  transform: rotate(180deg);
}

.reviews-container {
  margin-top: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.review-card {
  padding: 10px;
  margin-bottom: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.spinner {
  font-size: 14px;
  color: #999;
}

.error {
  color: red;
}

.no-reviews {
  font-size: 14px;
  color: #666;
}

.review-form-container {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.review-form-container h3 {
  font-size: 1.5rem;
}

.review-rating-container {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.rating-selector {
  margin-top: 5px;
  padding: 5px;
  width: 100%;
  font-size: 1rem;
  background-color: #f4f4f4;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.star {
  font-size: 20px;
  color: #ccc;
  cursor: pointer;
}

.star.full,
.star.filled {
  color: black;
}

.star.half {
  background: linear-gradient(90deg, black 50%, #e0e0e0 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.star.empty {
  color: #e0e0e0;
}

.review-comment-container {
  margin-bottom: 15px;
}

.comment-textarea {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.review-buttons {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .product-card {
    flex-direction: column;
    gap: 15px;
  }

  .card-img-container {
    width: 100%;
    height: 250px;
  }

  .product-name {
    font-size: 1.5rem;
  }

  .product-description {
    font-size: 1rem;
  }

  .product-price {
    font-size: 1.2rem;
  }
}
</style>
