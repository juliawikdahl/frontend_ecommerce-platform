<template>
    <div>
      <h1>Betalning</h1>
      <div v-if="isLoading">Laddar...</div>
      <div v-if="error">{{ error }}</div>
      
      <button @click="startPayment" :disabled="isLoading">Starta betalning</button>
      <!-- Lägg till Stripe Element här för att slutföra betalningen -->
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex'; // Importera mapGetters och mapActions från Vuex
  
  export default {
    data() {
      return {
        orderId: 123, // Ersätt med din faktiska order ID
        paymentMethod: 'card',  // T.ex. 'card' som betalningsmetod
      };
    },
    computed: {
      ...mapGetters('payment', ['clientSecret', 'paymentStatus', 'error', 'isLoading']), // Hämta från Vuex
    },
    methods: {
      ...mapActions('payment', ['createPayment', 'confirmOrder']), // Använd actions från Vuex
  
      async startPayment() {
        try {
          // Förbered data för betalningen
          const paymentData = {
            orderId: this.orderId,
            paymentMethod: this.paymentMethod,
          };
  
          // Anropa Vuex-action för att skapa betalningen och få clientSecret
          const clientSecret = await this.createPayment(paymentData);
          
          console.log('Client Secret:', clientSecret);
          
          // Här kan du använda Stripe.js eller annan betalningsteknik för att fullfölja betalningen
          // När betalningen är slutförd, kan du bekräfta ordern
          // Exempel: this.proceedToPayment(clientSecret);
          
        } catch (error) {
          console.error('Fel vid skapandet av betalning:', error);
        }
      },
  
      async confirmOrderPayment() {
        try {
          // Bekräfta ordern via Vuex
          const confirmationData = {
            paymentStatus: 'succeeded', // Status från Stripe eller annan betalningstjänst
          };
          
          const confirmationResponse = await this.confirmOrder({
            orderId: this.orderId,
            confirmationData: confirmationData,
          });
  
          console.log('Order bekräftad:', confirmationResponse);
          // Omdirigera till t.ex. orderbekräftelsesidan eller visa meddelande
        } catch (error) {
          console.error('Fel vid orderbekräftelse:', error);
        }
      },
    },
  };
  </script>
  