import { createPayment, confirmOrder} from '@/api/payment';

export default {
  namespaced: true,
  state: {
    clientSecret: null,
    paymentStatus: null,
    error: null,
    loading: false,
  },
  getters: {
    clientSecret(state) {
      return state.clientSecret;
    },
    paymentStatus(state) {
      return state.paymentStatus;
    },
    error(state) {
      return state.error;
    },
    isLoading(state) {
      return state.loading;
    },
  },
  mutations: {
    setClientSecret(state, clientSecret) {
      state.clientSecret = clientSecret;
    },
    setPaymentStatus(state, status) {
      state.paymentStatus = status;
    },
    setError(state, error) {
      state.error = error;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
  },
  actions: {
    async createPayment({ commit }, paymentData) {
      commit('setLoading', true);
      try {
        const clientSecret = await createPayment(paymentData); // Anropa API-funktionen för att skapa betalningen
        commit('setClientSecret', clientSecret); // Sätt clientSecret i Vuex
        commit('setLoading', false);
        return clientSecret; // Returnera clientSecret till komponenten
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.message); // Hantera fel
        throw error; // Skicka vidare felet till komponenten för vidare hantering
      }
    },
    async confirmOrder({ commit }, { orderId, confirmationData }) {
      commit('setLoading', true);
      try {
        const confirmationResponse = await confirmOrder(orderId, confirmationData); // Anropa API-funktionen för att bekräfta ordern
        commit('setPaymentStatus', 'succeeded'); // Uppdatera betalningsstatus
        commit('setLoading', false);
        return confirmationResponse; // Returnera bekräftelse från backend
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.message); // Hantera fel
        throw error; // Skicka vidare felet till komponenten för vidare hantering
      }
    },
  },
};
