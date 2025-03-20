import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

function isTokenExpired() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    return currentTime > expirationTime;
  }
  return false;
}

function checkTokenExpiration() {
  if (isTokenExpired()) {
    store.dispatch('auth/logout');
    router.push('/login');
  }
}

checkTokenExpiration();

createApp(App)
  .use(router)
  .use(store)
  .mount('#app');
