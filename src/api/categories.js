
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
export const postSubCategory = async (categoryId, subCategoryData) => {

  try {
    console.log('SubCategory data:', subCategoryData);
    const response = await axios.post(`${API_URL}/${categoryId}/subcategories`, subCategoryData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Lägg till token från localStorage om du använder autentisering
        'Content-Type': 'application/json',
      }
    });
    console.log('Response:', response);

    return response.data; // Returnera subkategori-data från backend
  } catch (error) {
    console.error('Error posting subcategory:', error.response ? error.response.data : error);
    throw error;
  }
};