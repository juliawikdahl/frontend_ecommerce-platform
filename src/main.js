import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Importera Vuex Store

// Skapa appen, använd router och Vuex, och mounta den
createApp(App)
  .use(router)
  .use(store) // Lägg till Vuex Store
  .mount('#app');
