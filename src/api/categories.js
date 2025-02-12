
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

export const postCategory = async (categoryData) => {
  try {
    const response = await axios.post(API_URL, categoryData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Lägg till token från localStorage om du använder autentisering
      }
    });
    return response.data; // Returnera den skapade kategorin
  } catch (error) {
    console.error('Error posting category:', error);
    throw error;
  }
};

export const putCategory = async (categoryId, categoryData) => {
  try {
    const response = await axios.put(`${API_URL}/${categoryId}`, categoryData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    await axios.delete(`${API_URL}/${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};



export const postSubCategory = async (subCategoryData) => {
  try {
    // Logga subCategoryData innan den skickas
    console.log('SubCategory data in postSubCategory:', subCategoryData);

    if (!subCategoryData || !subCategoryData.categoryId || !subCategoryData.name) {
      throw new Error("Missing categoryId or name in subCategoryData.");
    }

    // Skicka hela objektet till backend (utan att destrukturera om du inte behöver)
    const response = await axios.post(`${API_URL}/${subCategoryData.categoryId}/subcategories`, subCategoryData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data; // Returnera den skapade subkategorin
  } catch (error) {
    console.error('Error posting subcategory:', error.response ? error.response.data : error);
    throw error;
  }
};

export const putSubCategory = async (subcategoryId, subCategoryData) => {
  try {
    const response = await axios.put(`${API_URL}/subcategories/${subcategoryId}`, subCategoryData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating subcategory:', error.response ? error.response.data : error);
    throw error;
  }
};


export const deleteSubCategory = async (subcategoryId) => {
  try {
    await axios.delete(`${API_URL}/subcategories/${subcategoryId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
  } catch (error) {
    console.error('Error deleting subcategory:', error.response ? error.response.data : error);
    throw error;
  }
};

