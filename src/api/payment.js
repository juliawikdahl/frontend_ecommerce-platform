import axios from 'axios';

const API_URL = 'https://localhost:7131/api/payment'; // Uppdatera till din faktiska backend-URL om det behövs

export const createPayment = async (paymentData) => {
  try {
    const response = await axios.post(API_URL, paymentData);
    console.log('Payment created successfully:', response.data);
    return response.data.clientSecret; // Vi returnerar clientSecret för att använda den i frontend
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error; // Skickar vidare felet för att hantera det i komponenten
  }
};

export const confirmOrder = async (orderId, confirmationData) => {
  try {
    const response = await axios.post(`/api/payment/${orderId}/confirm`, confirmationData);
    console.log('Order confirmed:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error confirming order:', error);
    throw error;
  }
};
