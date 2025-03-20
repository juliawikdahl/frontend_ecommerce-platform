import axios from 'axios';

const API_URL = 'https://localhost:7131/api/wishlist';


const getAuthToken = () => {
    const token = localStorage.getItem('token');
    console.log('Auth Token:(wishlistoken)', token);  
    return token;
  };
  

export const getWishlist = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No token found. User is not authenticated.');
    }
    console.log('Hämtar wishlist för användare med token:(getwishlist)', token);
  
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Wishlist hämtad:(getwishlist)', response.data);
    return response.data; 
  } catch (error) {
    console.error('Failed to fetch wishlist:', error.response || error);
    return []; 
  }
};

export const addToWishlist = async (productId) => {
  try {
  
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
  
    if (error.response && error.response.status === 409) {
      console.log('Produkten finns redan i din önskelista.');
    } else {
      console.error('Misslyckades att lägga till produkt i din önskelista:', error.response || error);
    }
  }
};


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
