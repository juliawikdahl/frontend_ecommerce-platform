// store/modules/orders.js
import { createOrder, getAllOrders, getUserOrders, updateOrder, updateOrderStatus, deleteOrder} from '@/api/orders';


export default {
  namespaced: true,
  state: {
    orders: [],
    loading: false,
    error: false,
  },
  getters: {
    allOrders(state) {
        return state.orders;
    },
    isLoading(state) {
        return state.loading;
    },
    error(state) {
        return state.error;
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
    removeOrder(state, orderId) {
      state.orders = state.orders.filter(order => order.id !== orderId);
    },
    updateOrderInState(state, updatedOrder) {
      const index = state.orders.findIndex(order => order.id === updatedOrder.id);
      if(index !== -1) {
        state.orders.splice(index, 1, updatedOrder);
      }
    }
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
      async fetchOrders({ commit }) {
        commit('setLoading', true);
        try {
          const orders = await getAllOrders();
          console.log('Fetched orders:', orders); // Lägg till logg här
          commit('setOrders', orders);
          commit('setLoading', false);
        } catch (error) {
          commit('setLoading', false);
          commit('setError', error.message);
        }
      },
      

     async fetchUserOrders({ commit }) {
      commit('setLoading', true); // Sätt loading till true
      try {
        const orders = await getUserOrders(); // Hämta användarens ordrar
        commit('setOrders', orders); // Sätt användarens ordrar i state
        commit('setLoading', false);
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.message); // Hantera fel om det sker något problem
      }
    },
    async updateOrder({ commit }, { orderId, orderData }) {
      commit('setLoading', true);
      try {
        const response = await updateOrder(orderId, orderData);
        commit('updateOrderInState', response);
        commit('setLoading', false);
        return response;
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.message);
        throw error;
      }
    },
    async updateOrderStatus({ commit }, { orderId, status }) {
      commit('setLoading', true);
      try {
        const response = await updateOrderStatus(orderId, status);
        commit('updateOrderInState', response);
        commit('setLoading', false);
        return response;
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.message);
        throw error;
      }
    },
    async deleteOrder({ commit }, orderId) {
      commit('setLoading', true);
      try {
        await deleteOrder(orderId);
        commit('removeOrder', orderId);
        commit('setLoading', false);
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.message);
        throw error;
      }
    }
    
  },
 
};
