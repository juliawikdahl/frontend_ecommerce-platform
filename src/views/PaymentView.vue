<template>
  <div>
    <h1>Payment Page</h1>
    <form @submit.prevent="handlePayment">
      <div>
        <label for="cardNumber">Card Number</label>
        <input v-model="cardDetails.cardNumber" type="text" id="cardNumber" required />
      </div>
      <div>
        <label for="cardExpiry">Expiration Date</label>
        <input v-model="cardDetails.cardExpiry" type="text" id="cardExpiry" required />
      </div>
      <div>
        <label for="cardCvc">CVC</label>
        <input v-model="cardDetails.cardCvc" type="text" id="cardCvc" required />
      </div>
      <button type="submit" :disabled="isLoading">Pay</button>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';  // Importera mapState och mapActions för att använda Vuex store


export default {
  data() {
    return {
      orderId: '',  // Hämta orderId från router params
      cardDetails: {
        cardNumber: '',
        cardExpiry: '',
        cardCvc: ''
      },
      amount: 500.00,  // Exempelbelopp
      currency: 'sek',  // Valuta
      description: 'Payment for order #123',  // Beskrivning av betalningen
    };
  },
  computed: {
    ...mapState('payment', ['isLoading', 'useFakePayment', 'error']),  // Använd Vuex state för att få isLoading och useFakePayment
  },
  mounted() {
    this.orderId = this.$route.params.orderId;  
    console.log('Order ID från ruttparametrar:', this.orderId);
  if (!this.orderId) {
    console.error('Order ID saknas i URL');
  }
  },
  methods: {
    ...mapActions('payment', ['createPayment', 'confirmOrder']),  // Använd Vuex actions för createPayment och confirmOrder

    async handlePayment() {
  try {
    this.isLoading = true;

    // Förbered data för betalningen
    const paymentData = {
      orderId: this.orderId,
      paymentMethod: 'card',  // Betalningsmetod
      amount: this.amount,  // Beloppet
      currency: this.currency,  // Valuta
      description: this.description,  // Beskrivning
    };

    // Skapa betalningen via Vuex store och spara clientSecret
    const clientSecret = await this.createPayment(paymentData);

    // Nu kan du använda clientSecret för att skicka den till en betalningstjänst som Stripe
    console.log('Client Secret:', clientSecret);

    // Bekräfta betalningen (simulerar lyckad betalning)
    const confirmationData = { paymentStatus: 'succeeded' };  // Simulera lyckad betalning
    await this.confirmOrder({ orderId: this.orderId, confirmationData });

    // Visa framgångsmeddelande
    alert('Payment successful and order confirmed!');
    
    // Omdirigera till orderbekräftelsesidan
    this.$router.push({ name: 'OrderConfirmation', params: { orderId: this.orderId } });
  } catch (error) {
    console.error('Error handling payment:', error);
    alert('Error handling payment: ' + error.message);
  } 
},

  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: auto;
}

form div {
  margin-bottom: 10px;
}

form input {
  padding: 8px;
  font-size: 16px;
  width: 100%;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>
