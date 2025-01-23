import axios from 'axios';

const API_URL = 'https://localhost:7131/api/Users';

export const loginUser = (credentials) => {
    return axios.post(`${API_URL}/login`, credentials);
  };

export const registerUser = (registerData) => {
  return axios.post(`${API_URL}/register`, registerData);
};

export const getUserProfile = () => {
  const token = localStorage.getItem('token'); // Hämtar token från localStorage
  if (!token) {
    console.log('Ingen token hittades, användaren är inte inloggad');
    return Promise.reject('No token found');
  }

  // Gör ett GET-anrop för att hämta användarens profil
  return axios.get(`${API_URL}/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Skicka med token i headern
    }
  });
};

export const logoutUser = () => {
  const token = localStorage.getItem('token'); // Hämta token från localStorage
  if (!token) {
      console.log('Ingen token hittades, användaren är inte inloggad');
      return;
  }
  
  return axios.post(`${API_URL}/logout`, {}, {
      headers: {
          'Authorization': `Bearer ${token}` // Lägg till token i Authorization-header
      }
  })
  .then(response => {
      console.log(response.data);
      // Ta bort token från localStorage vid logout
      localStorage.removeItem('token');
  })
  .catch(error => {
      console.error('Logout failed:', error);
  });
};

export const updateUserProfile = (userData) => {
  const token = localStorage.getItem('token');
  if (!token) {
      return Promise.reject(new Error('No token found'));
  }

  return axios.put(`${API_URL}/profile`, userData, {
      headers: {
          'Authorization': `Bearer ${token}`,
      },
  }).then(response => {
      console.log('Profil uppdaterad:', response.data);
      return response.data;
  }).catch(error => {
      console.error('Fel vid uppdatering av profil:', error);
      throw error;
  });
};

export const changePassword = (passwordData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return Promise.reject(new Error('No token found'));
  }

  return axios.put(`${API_URL}/change-password`, passwordData, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }).then(response => {
    console.log('Lösenord ändrat:', response.data);
    return response.data;
  }).catch(error => {
    console.error('Fel vid lösenordsändring:', error);
    throw error;
  });
};


