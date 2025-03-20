<template>
  <footer class="footer bg-dark text-light">
    <div class="container">
      <div class="row">
      
        <div class="col-md-4">
          <h5>About Julias Shopping Site</h5>
          <p>We offer a wide range of products to suit all your needs. Discover our categories and find the best products for you!</p>
        </div>

    
        <div class="col-md-4">
          <h5>Quick Links</h5>
          <ul class="list-unstyled">
            <li><router-link to="/about" class="text-light">About Us</router-link></li>
            <li><router-link to="/contact" class="text-light">Contact Us</router-link></li>
          </ul>
        </div>


        <div class="col-md-4">
          <h5>Follow Us</h5>
          <div class="social-icons">
            <a href="#" class="text-light me-3"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="text-light me-3"><i class="fab fa-twitter"></i></a>
            <a href="#" class="text-light me-3"><i class="fab fa-instagram"></i></a>
            <a href="#" class="text-light"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

 
      <div class="text-center mt-5">
        <p>&copy; 2025 Julias Shopping Site. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>

<style scoped>
.footer {
  background-color: #333;
  color: white;
  margin-top: 2rem;
  text-align: center;
}

.footer h5 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-top:2rem;
}

.footer p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.footer .social-icons a {
  font-size: 1.5rem;
  transition: color 0.3s, transform 0.3s;
}

.footer .social-icons a:hover {
  color: #007bff;
  transform: scale(1.1); 
}

.footer .text-light {
  color: #f8f9fa;
}

.footer .text-light:hover {
  color: #007bff;
}

.footer ul {
  padding-left: 0;
}

.footer ul li {
  margin-bottom: 10px;
}


@media (max-width: 768px) {
  .footer .row {
    text-align: center;
    margin-bottom: 1rem;
  }

  .footer .social-icons {
    margin-top: 1rem;
  }

  .footer .social-icons a {
    margin-right: 1rem;
  }

  .footer h5 {
    font-size: 1.125rem; 
  }

  .footer p {
    font-size: 0.9rem;
  }
}
</style>
