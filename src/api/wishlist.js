import axios from 'axios';

const API_URL = 'https://localhost:7131/api/wishlist';

// Hämta token från localStorage eller Vuex store
const getAuthToken = () => {
    const token = localStorage.getItem('token');
    console.log('Auth Token:(wishlistoken)', token);  // Logga token för att verifiera att den finns
    return token;
  };
  
// Hämta hela önskelistan för den inloggade användaren
export const getWishlist = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No token found. User is not authenticated.');
    }
    console.log('Hämtar wishlist för användare med token:(getwishlist)', token);
    // Skicka med token i Authorization header
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Wishlist hämtad:(getwishlist)', response.data);
    return response.data; // Returnera användarens wishlist
  } catch (error) {
    console.error('Failed to fetch wishlist:', error.response || error);
    return []; // Returnera en tom lista om något går fel
  }
};

export const addToWishlist = async (productId) => {
  try {
    // Skicka produktens ID till backend för att lägga till i wishlist
    const response = await axios.post(
      API_URL,
      { ProductId: productId },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    console.log('Produkt tillagd i din önskelista:', response.data);
  } catch (error) {
    // Om produkten redan finns i wishlist, kommer backend att returnera en konflikt
    if (error.response && error.response.status === 409) {
      console.log('Produkten finns redan i din önskelista.');
    } else {
      console.error('Misslyckades att lägga till produkt i din önskelista:', error.response || error);
    }
  }
};


// Ta bort en produkt från den inloggade användarens wishlist
export const removeFromWishlist = async (productId) => {
  try {
    console.log('Försöker ta bort produkt med ID:', productId);
    const response = await axios.delete(`${API_URL}/${productId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    console.log('Produkt borttagen från din önskelista:(removewish)', response.data);
  } catch (error) {
    console.error('Misslyckades att ta bort produkt från din önskelista:', error.response || error);
  }
};
