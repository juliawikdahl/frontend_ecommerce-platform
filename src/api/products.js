import axios from 'axios';

// Base URL för API:et (kan vara din server-URL eller lokal server)
const API_URL = 'https://localhost:7131/api/Products';

// Funktion för att hämta alla produkter
export const getAllProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('Fetched products:', response.data); 
    return response.data; // Returnera data som kommer från API:et
   
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;  // Kasta felet vidare så vi kan fånga det i komponenten
  }
};


export const getProductById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      console.log('Fetched product:', response.data); 
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  };


  export const getProductByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/category/${categoryId}`);
        console.log('Fetched products:', response.data); 
        return response.data;
    } catch (error) {
        console.error(`Error fetching products for category ${categoryId}:`, error);
    throw error;
    }
  }

  export const getProductBySubCategory = async (subCategoryId) => {
    try {
        const response = await axios.get(`${API_URL}/subcategory/${subCategoryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching products for category ${subCategoryId}:`, error);
    throw error;
    }
  }