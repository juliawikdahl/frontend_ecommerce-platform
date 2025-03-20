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
      if (store.getters['auth/isAuthenticated']) {
        next({ name: 'homeView' });
      } else {
        next();
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
    component: CategoryView,
    props: true
  },
  {
    path: '/subcategory/:subCategoryId',
    name: 'subCategoryView',
    component: SubCategoryView,
    props: true
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
    component: SearchResultsView,
    props: route => ({ query: route.query.query })
  },
  {
    path: '/payment/:orderId/:totalAmount',
    name: 'PaymentView',
    component: PaymentView
  },
  {
    path: '/orders',
    name: 'OrderView',
    component: OrderView
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router
