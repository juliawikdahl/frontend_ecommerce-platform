<template>
  <div class="payment-container">
    <h1>Payment Page</h1>

    <!-- Kortförhandsvisning -->
    <div class="card-preview">
      <div class="card-chip"></div>
      <div class="card-number">{{ formattedCardNumber || '•••• •••• •••• ••••' }}</div>
      <div class="card-details">
        <span>{{ formattedExpiry || 'MM/YY' }}</span>
        <span>{{ cardDetails.cardCvc ? '•••' : 'CVC' }}</span>
      </div>
    </div>

    <!-- Betalningsformulär -->
    <form @submit.prevent="handlePayment">
      <div class="form-group">
        <label for="cardNumber">Card Number</label>
        <input
          v-model="cardDetails.cardNumber"
          type="text"
          id="cardNumber"
          maxlength="19"
          placeholder="1234 5678 9012 3456"
          required
          @input="formatCardNumber"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="cardExpiry">Expiration Date</label>
          <input
            v-model="cardDetails.cardExpiry"
            type="text"
            id="cardExpiry"
            maxlength="5"
            placeholder="MM/YY"
            required
            @input="formatExpiry"
          />
        </div>
        <div class="form-group">
          <label for="cardCvc">CVC</label>
          <input
            v-model="cardDetails.cardCvc"
            type="text"
            id="cardCvc"
            maxlength="3"
            placeholder="123"
            required
          />
        </div>
      </div>

      <button type="submit" :disabled="isLoading">Pay {{ amount }} {{ currency.toUpperCase() }}</button>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      orderId: '',
      cardDetails: {
        cardNumber: '',
        cardExpiry: '',
        cardCvc: ''
      },
      amount: '',
      currency: 'sek',
      description: 'Payment for order #123',
    };
  },
  computed: {
    ...mapState('payment', ['isLoading']),
    formattedCardNumber() {
      return this.cardDetails.cardNumber.replace(/(\d{4})/g, '$1 ').trim();
    },
    formattedExpiry() {
      return this.cardDetails.cardExpiry.replace(/(\d{2})(\d{2})/, '$1/$2');
    }
  },
  mounted() {
    this.orderId = this.$route.params.orderId;
    this.amount = this.$route.params.totalAmount; 
  },
  methods: {
    ...mapActions('payment', ['createPayment', 'confirmOrder']),
    async handlePayment() {
      const confirmation = window.confirm("Are you sure you want to proceed with the payment?")
      if(!confirmation) {
        return; 
      }
      try {
        this.isLoading = true;
        const paymentData = {
          orderId: this.orderId,
          paymentMethod: 'card',
          amount: this.amount,
          currency: this.currency,
          description: this.description,
        };
        const clientSecret = await this.createPayment(paymentData);
        console.log('Client Secret:', clientSecret);
        const confirmationData = { paymentStatus: 'succeeded' };
        await this.confirmOrder({ orderId: this.orderId, confirmationData });
        alert('Payment successful!');
        this.$router.push({ name: 'OrderConfirmation', params: { orderId: this.orderId } });
      } catch (error) {
        console.error('Error handling payment:', error);
        alert('Error: ' + error.message);
      }
    },
    formatCardNumber() {
      this.cardDetails.cardNumber = this.cardDetails.cardNumber
        .replace(/\D/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .substring(0, 19);
    },
    formatExpiry() {
      this.cardDetails.cardExpiry = this.cardDetails.cardExpiry
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{2})/, '$1/$2')
        .substring(0, 5);
    }
   
  }
};
</script>

<style scoped>
.payment-container {
  text-align: center;
  margin-top: 20px;
}

.card-preview {
  width: 320px;
  height: 180px;
  background: linear-gradient(135deg, #4A90E2, #9013FE);
  border-radius: 15px;
  color: white;
  padding: 20px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  font-family: 'Arial', sans-serif;
}

.card-chip {
  width: 40px;
  height: 30px;
  background: gold;
  border-radius: 5px;
}

.card-number {
  font-size: 22px;
  letter-spacing: 2px;
  text-align: center;
}

.card-details {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

form {
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.form-row {
  display: flex;
  gap: 10px;
}

.form-row .form-group {
  flex: 1;
}

form input {
  padding: 10px;
  font-size: 16px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ccc;
  transition: border 0.3s;
}

form input:focus {
  border-color: #4A90E2;
  outline: none;
}

button {
  margin-top: 20px;
  padding: 12px 20px;
  font-size: 16px;
  background: #4A90E2;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
}

button:hover {
  background: #357ABD;
}

button:disabled {
  background: #aaa;
  cursor: not-allowed;
}
</style>
