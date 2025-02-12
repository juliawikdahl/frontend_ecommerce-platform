// store/modules/orders.js
import { createOrder, getAllOrders} from '@/api/orders';


export default {
  namespaced: true,
  state: {
    orders: [],
  },
  getters: {
    allOrders(state) {
        return state.orders;
    },
    isLoading(state) {
        state.loading;
    },
    error(state) {
        state.error;
    }
 
  },
  mutations: {
    setOrders(state, orders) {
        state.orders = orders;
    },
    setLoading(state, loading) {
        state.loading = loading;
    },
    setError(state, error) {
        state.error = error;
    },
  },
  actions: {
    async createOrder({ commit }, orderData) {
        console.log('Skapar en ny order med följande data:', orderData); // Loggar orderdata
        commit('setLoading', true);
        try {
          const response = await createOrder(orderData);
          console.log('Order skapad:', response); // Loggar när ordern skapats
          commit('setLoading', false);
          return response;
        } catch (error) {
          console.error('Fel vid skapande av order:', error); // Loggar fel om något går fel
          commit('setLoading', false);
          commit('setError', error.message);
          throw error;
        }
      },
     async fetchOrders({commit}) {
        commit('setLoading', true);
        try {
            const orders = await getAllOrders();
            commit('setOrders', orders);
            commit('setLoading', false);
        } catch (error) {
            commit('setLoading', false);
            commit('setError', error.message);   
          }
     }
    
  },
 
};
