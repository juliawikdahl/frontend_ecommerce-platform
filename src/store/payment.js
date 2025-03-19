import { createFakePayment, confirmOrder } from '@/api/payment';

export default {
  namespaced: true,
  state: {
    clientSecret: null,
    paymentStatus: null,
    error: null,
    loading: false,
    useFakePayment: false,
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
    setUseFakePayment(state, useFakePayment) {
      state.useFakePayment = useFakePayment;
    },
  },
  actions: {
    async createPayment({ commit, state }, paymentData) {
      commit('setLoading', true);
      try {
        // Om fejkbetalning används, anropa createFakePayment
        let clientSecret;
        if (state.useFakePayment) {
          clientSecret = await createFakePayment(paymentData);
        }

        commit('setClientSecret', clientSecret);
        commit('setLoading', false);
        return clientSecret;
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.message);
        throw error; // Skicka vidare felet för vidare hantering
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
        throw error; // Skicka vidare felet för vidare hantering
      }
    },
  },
};
