import axios from 'axios';


const API_URL = 'https://localhost:7131/api/Products';


export const getAllProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('Fetched products:', response.data); 
    return response.data;
   
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;  
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

  export const addProduct = async (productData) => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error('No authentication token found.');
        return;
      }
  
      const response = await axios.post(API_URL, productData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log('Product created:', response.data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('You do not have permission to add products.'); 
      } else {
        console.error('Error creating product:', error);
      }
      throw error;
    }
  };

  export const deleteProduct = async(productId) => {
    try {
      const token = localStorage.getItem('token');
      if(!token) {
        console.error('No authentication token found.')
        return;
      }
      const response = await axios.delete(`${API_URL}/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('product deleted', response.data)
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
    throw error;
    }
  }
  export const updateProduct = async (id, productData) => {
    try {
      console.log(`🔄 Attempting to update product with ID: ${id}`);
  
      if (!id) {
        console.error(' Error: Product ID is missing.');
        throw new Error('Product ID is required.');
      }
  
      if (!productData || Object.keys(productData).length === 0) {
        console.error('Error: Product data is empty or invalid.');
        throw new Error('Product data is required for update.');
      }
  
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error(' Error: No authentication token found.');
        throw new Error('User is not authenticated.');
      }
  
      console.log('🔐 Token found, proceeding with API request...');
  
      const response = await axios.put(`${API_URL}/${id}`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data) {
        console.log('✅ Product updated successfully:', response.data);
        return response.data;
      } else {
        console.error('❌ No data returned from server.');
        throw new Error('Failed to update product. No data returned.');
      }
    } catch (error) {
      console.error('❌ Error updating product:', error.response?.data || error.message);
  
   
      if (error.response) {
        console.error('⚠️ Server responded with:', {
          status: error.response.status,
          data: error.response.data
        });
      }
  
   
      if (error.code === 'ECONNABORTED' || !navigator.onLine) {
        console.error('⚠️ Network error occurred.');
      }
  
      throw error;
    }
};
