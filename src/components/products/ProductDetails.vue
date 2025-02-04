<template>
  <div class="product-detail">
    <!-- Visa produktdetaljer om produkten finns -->
    <div v-if="product" class="product-card">
      <!-- Bilden till vänster -->
      <div class="card-img-container">
        <img :src="getImageSource(product)" alt="product.name" class="card-img-top" />
      </div>

      <!-- Text och knappar till höger -->
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
        <!-- Knappar -->
        <div class="button-container">
          <AddToCartButton :product="product" :showText="true"  />
          <WishlistButton :productId="product.id" />
        </div>
        <div class="about-us-info">
          <p class="info-row">Gratis leverans till Sverige inom 1-3 arbetsdagar*</p>
          <p class="info-row">Gratis klimatkompenserade leveranser</p>
          <p class="info-row">Läs mer om vår returpolicy och våra avgifter</p>
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
                <!-- Rating selector -->
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

                <!-- Comment section -->
                <div class="review-comment-container">
                  <label for="comment">Comment:</label>
                  <textarea v-model="newReview.comment" id="comment" required class="comment-textarea"></textarea>
                </div>

                <!-- Buttons -->
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

    <!-- Visa meddelande om ingen produkt finns -->
    <div v-else class="no-product-message">
      <p>Ingen produktdata tillgänglig.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AddToCartButton from '@/components/products/AddToCartButton.vue';  // Importera AddToCartButton-komponenten
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
      hoverRating: 0, // För att visa stjärnorna vid hover
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
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Månad +1 eftersom månaderna är 0-indexerade
      const day = String(d.getDate()).padStart(2, '0'); // Säkerställer att dagen är två siffror
      return `${year}-${month}-${day}`;
    },

    async fetchReviews() {
      try {
        this.reviews = await getProductReviews(this.product.id);
        console.log('Server Response:', this.reviews);
        if (!Array.isArray(this.reviews)) {
          this.reviews = []; // Om reviews inte är en array, gör den till en tom array
        }
        this.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        this.reviewsLoading = false;
      } catch (error) {
        console.error('Error fetching reviews:', error);
        this.reviewsError = 'Något gick fel när vi hämtade recensionerna.';
        this.reviewsLoading = false;
        this.reviews = []; // Om något går fel, sätt reviews till en tom array
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
      this.newReview.rating = rating; // Uppdaterar betyget
    },

    async submitReview() {
      const reviewData = {
        rating: this.newReview.rating,
        comment: this.newReview.comment
      };

      try {
        const response = await postReview(this.product.id, reviewData);
        
        console.log('Server Response:', response);

        if (response && Array.isArray(response.reviews)) {
          this.reviews = response.reviews;
        } else {
          console.error('Invalid response format', response);
          this.reviews = [];
        }

        this.reviewsOpen = false;
        this.fetchReviews();

        this.newReview = { rating: 5, comment: '' };
        this.showReviewForm = false;
        this.successMessage = 'Din recension har skickats in och kommer att synas snart!';
      } catch (error) {
        console.error('Fel vid inlämning av recension:', error);
        this.reviewsError = 'Något gick fel när vi skickade din recension. Försök igen senare.';
      }
    }
  }
};
</script>
<style scoped>
/* Övergripande layout */
.product-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4rem;
  background-color: #f4f4f4;
}

/* Produktkort */
.product-card {
  display: flex;
  flex-direction: row; /* Bild och text sida vid sida */
  align-items: flex-start; /* Justera vertikalt */
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  max-width: 900px;
  width: 100%;
  gap: 20px; /* Mellanrum mellan bild och text */
}

/* Bildcontainer (vänster) */
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

/* Info-sektionen (höger) */
.info-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

/* Produktnamn */
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

/* Beskrivning */
.product-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

/* Pris */
.product-price {
  font-size: 24px;
  margin-bottom: 20px;
}

/* Knappar */
.button-container {
  display: flex;
  gap: 10px;
}

/* Meddelande för ingen produkt */
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

/* Recensionssektion */
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

/* Expandera recensioner */
.reviews-container {
  margin-top: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
/* .review-container {
display: flex;
justify-content: flex-end;

} */


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


/* Formulär för att skriva recension */
.review-form-container {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

/* Rubrik */
.review-form-container h3 {
  font-size: 1.5rem;
}

/* Betygsättning */
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

/* Stjärnor */

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

/* Kommentartextruta */
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

/* Knappdesign */
.review-buttons {
  display: flex;
  justify-content: flex-end;
}

/* Responsiv design */
@media (max-width: 768px) {
  .product-card {
    flex-direction: column; /* Stapla bild och text på små skärmar */
    gap: 15px;
  }

  .card-img-container {
    width: 100%; /* Full bredd för bilden */
    height: 250px; /* Anpassad höjd */
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
