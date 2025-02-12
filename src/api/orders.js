import axios from 'axios';

// Base URL för Order API
const API_URL = 'https://localhost:7131/api/Orders';

// Funktion för att skapa en order
export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token'); // Hämta token från localStorage
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    const response = await axios.post(API_URL, orderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Order created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Funktion för att hämta alla orders
export const getAllOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    console.log('Fetched all orders:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Funktion för att hämta en specifik order
export const getOrder = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    const response = await axios.get(`${API_URL}/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    console.log('Fetched order:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Funktion för att uppdatera orderstatus
export const updateOrderStatus = async (orderId, status) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    const response = await axios.put(`${API_URL}/${orderId}/status`, status, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Order status updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Funktion för att uppdatera en order
export const updateOrder = async (orderId, orderData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    const response = await axios.put(`${API_URL}/${orderId}`, orderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Order updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Funktion för att ta bort en order
export const deleteOrder = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    const response = await axios.delete(`${API_URL}/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    console.log('Order deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};
