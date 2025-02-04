import axios from 'axios';
const API_URL = 'https://localhost:7131/api/Reviews/product/'; 

export async function getProductReviews(productId) {
  try {
    const response = await axios.get(`${API_URL}${productId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch reviews: ' + error.message);
  }
}
export const postReview = async (productId, reviewData) => {
  try {
    const response = await axios.post(
      `${API_URL}${productId}`,
      reviewData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Skicka med token för autentisering
        }
      }
    );
    return response.data; // Svara med det skapade svaret från servern
  } catch (error) {
    console.error('Error posting review:', error);
    throw error; // Vid fel, kasta felet så att det kan hanteras på frontend
  }
};