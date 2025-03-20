import axios from 'axios';

const API_URL = 'https://localhost:7131/api/Payment';


const getToken = () => {
  const token = localStorage.getItem('token'); // Hämtar token från localStorage
  if (!token) {
    console.error('No token found in localStorage');
    throw new Error('No token found');
  }
  return token;
};

export const createFakePayment = async (paymentData) => {
  try {
    const token = getToken(); // Hämtar token från localStorage

    // Validera paymentData innan vi skickar
    if (!paymentData.currency || !paymentData.description || !paymentData.orderId || !paymentData.paymentMethod || !paymentData.amount) {
      throw new Error('All required fields (orderId, paymentMethod, amount, currency, description) must be provided');
    }

    // Lägg till token i headers och använd query-parameter 'useFakePayment' = true
    const response = await axios.post(`${API_URL}/fake/create`, paymentData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Lägg till token i Authorization-header
      },
    });

    console.log('Fake payment created successfully:', response.data);
    return response.data.clientSecret; // Vi returnerar den fejkade clientSecret för att använda den i frontend
  } catch (error) {
    if (error.response) {
      // Servern svarade med ett statuskod som inte är 2xx
      console.error('Error response from server:', error.response.data);
    } else if (error.request) {
      // Förfrågan skickades, men inget svar mottogs
      console.error('No response from server:', error.request);
    } else {
      // Något gick fel vid inställningen av förfrågan
      console.error('Error setting up the request:', error.message);
    }
    throw error; // Skickar vidare felet för att hantera det i komponenten
  }
};

export const confirmOrder = async (orderId, confirmationData) => {
  try {
    const token = getToken(); // Hämtar token från localStorage eller annan källa

    
    const response = await axios.post(`${API_URL}/${orderId}/confirm`, confirmationData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Order confirmed:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Servern svarade med ett statuskod som inte är 2xx
      console.error('Error response from server:', error.response.data);
    } else if (error.request) {
      // Förfrågan skickades, men inget svar mottogs
      console.error('No response from server:', error.request);
    } else {
      // Något gick fel vid inställningen av förfrågan
      console.error('Error setting up the request:', error.message);
    }
    throw error; // Skickar vidare felet för att hantera det i komponenten
  }
};
