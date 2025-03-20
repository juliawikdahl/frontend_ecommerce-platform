<template>
    <div class="contact-page mt-4">
      <h1>Contact Us</h1>
      <p>Feel free to reach out to us for any inquiries or support!</p>
      <form @submit.prevent="submitForm">
        <input type="text" placeholder="Your Name" v-model="name" required />
        <input type="email" placeholder="Your Email" v-model="email" required />
        <textarea placeholder="Your Message" v-model="message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ContactView',
    data() {
      return {
        name: '',
        email: '',
        message: ''
      };
    },
    methods: {
      submitForm() {
        
        console.log('Form submitted!', this.name, this.email, this.message);
      }
    }
  };
  </script>
  
  <style scoped>
  .contact-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 30px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 15px;
    color: #333;
  }
  
  p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 30px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  
  }
  
  input, textarea {
    padding: 12px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    transition: border-color 0.3s;
  }
  
  input:focus, textarea:focus {
    border-color: #007bff;
  }
  
  button {
    color: white;
    padding: 12px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  

  textarea {
    resize: vertical;
    min-height: 150px;
  }
  </style>
  