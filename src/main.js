import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Importera Vuex Store

// Funktion för att kontrollera om token har gått ut
function isTokenExpired() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Dekoda JWT
    const expirationTime = decodedToken.exp * 1000; // Omvandla till millisekunder
    const currentTime = Date.now();
    return currentTime > expirationTime;
  }
  return false;
}

// Funktion för att logga ut användaren om token har gått ut
function checkTokenExpiration() {
  if (isTokenExpired()) {
    store.dispatch('auth/logout'); // Anropa Vuex logout action
    router.push('/login'); // Om token har gått ut, omdirigera till inloggningssidan
  }
}

// Kontrollera om token har gått ut när appen startas
checkTokenExpiration();

// Skapa appen, använd router och Vuex, och mounta den
createApp(App)
  .use(router)
  .use(store) // Lägg till Vuex Store
  .mount('#app');
