import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'; 
import RegisterView from '@/views/RegisterView.vue'; 
import WishlistView from '@/views/WishlistView.vue'
import AllProductsView from '@/views/AllProductsView.vue';
import ProductDetailView from '@/views/ProductDetailView.vue';
import CategoryView from '@/views/CategoryView.vue';
import cartView from '@/views/cartView.vue';
import SubCategoryView from '@/views/SubCategoryView.vue';
import ProfileView from '@/views/ProfileView.vue';
import AdminView from '@/views/AdminView.vue';
import SearchResultsView from '@/views/SearchResultsView.vue';
import PaymentView from '@/views/PaymentView.vue';
import OrderView from '@/views/OrderView.vue';
import OrderConfirmationView from '@/views/OrderConfirmationView.vue';
import AboutView from '@/views/AboutView.vue';
import ContactView from '@/views/ContactView.vue';


import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'homeView',
    component: HomeView
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      // Om användaren är redan inloggad, omdirigera till hem-sidan
      if (store.getters['auth/isAuthenticated']) {
        next({ name: 'homeView' }); // Redirect to home if already logged in
      } else {
        next(); // Otherwise, continue to login page
      }
    }
  },
  {
    path: '/register',
    name: 'RegisterView',
    component: RegisterView
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: WishlistView
  },
  {
    path: '/allproducts',
    name: 'allproducts',
    component: AllProductsView
  },
  {
    path: '/:id',  
    name: 'product-detail',
    component: ProductDetailView, 
    props: true  
  },
  {
    path: '/category/:categoryId',
    name: 'categoryView',
    component: CategoryView,  // Dynamisk vy för att visa produkter per kategori
    props: true  // Gör så att vi skickar id:t som en prop till komponenten
  },
  {
    path: '/subcategory/:subCategoryId',
    name: 'subCategoryView',
    component: SubCategoryView,  // Dynamisk vy för att visa produkter per kategori
    props: true  // Gör så att vi skickar id:t som en prop till komponenten
  },
  {
    path: '/cart',
    name: 'cartView',
    component: cartView
  },
  {
    path: '/profile',
    name: 'ProfileView',
    component: ProfileView
  },
  {
    path: '/admin',
    name: 'AdminView',
    component: AdminView
  },
  {
    path: '/search',
    name: 'SearchResultsView',
    component: SearchResultsView, // Använd SearchResults-komponenten för denna rutt
    props: route => ({ query: route.query.query }) // Skicka query-parametern som prop
  },
  {
    path: '/payment/:orderId/:totalAmount',
    name: 'PaymentView',
    component: PaymentView // Betalningssidan
  },
  {
    path: '/orders',
    name: 'OrderView',
    component: OrderView // Betalningssidan
  },
  {
    path: '/order-confirmation/:orderId',
    name: 'OrderConfirmation',
    component: OrderConfirmationView,
  },
  {
    path: '/about',
    name: 'AboutView',
    component: AboutView,
    meta: { title: 'About Us' }
  },
  {
    path: '/contact',
    name: 'ContactView',
    component: ContactView,
    meta: { title: 'Contact Us' }
  },


  // {
  //   path: '/subcategory/:name',  // Dynamisk ruta för subkategorier
  //   name: 'subcategory',
  //   component: SubcategoryView,  // Skapa denna vy för att hantera subkategori
  //   props: true // Gör så att vi kan få åtkomst till subkategori-namnet som en prop
  // },

 
 
]

const router = createRouter({
  history: createWebHistory(),  // Använd Web History istället för Web Hash
  routes
});

export default router
