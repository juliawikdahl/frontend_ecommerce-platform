<template>
    <div class="about-page mt-4">
      <h1>About Us</h1>
      <p>Welcome to Julias Shopping Site! We offer a wide range of products to suit all your needs, carefully curated for quality and customer satisfaction. Discover our top categories and start shopping today!</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AboutView'
  };
  </script>
  
  <style scoped>
  .about-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-family: 'Arial', sans-serif;
    color: #333;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    font-weight: 600;
  }
  
  p {
    font-size: 1.2rem;
    line-height: 1.6;
    color: #555;
    margin-bottom: 30px;
    text-align: justify;
  }
  
  @media (max-width: 768px) {
    .about-page {
      padding: 20px;
    }
  
    h1 {
      font-size: 2rem;
    }
  
    p {
      font-size: 1rem;
    }
  }
  </style>
  