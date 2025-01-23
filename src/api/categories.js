// api/products.js

import axios from 'axios';

const API_URL = 'https://localhost:7131/api/Categories'; 

export const getCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Returnera kategoridata
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
