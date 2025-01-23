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

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView
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
    path: '/product/:id',  
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
