<template>
    <div class="sort-container">
      <!-- Sortera med ikon -->
      <button @click="toggleSortDropdown" class="sort-icon-button" aria-label="Sort by">
        <i class="fa-solid fa-sort"></i>
      </button>
  
      <!-- Dropdown-listan -->
      <div v-if="isDropdownOpen" class="sort-dropdown">
        <ul>
          <li @click="handleSorting('nameAsc')">Name (A-Z)</li>
          <li @click="handleSorting('nameDesc')">Name (Z-A)</li>
          <li @click="handleSorting('priceAsc')">Price (Low to High)</li>
          <li @click="handleSorting('priceDesc')">Price (High to Low)</li>
          <li @click="handleSorting('dateAsc')">Date (Oldest to Newest)</li>
          <li @click="handleSorting('dateDesc')">Date (Newest to Oldest)</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isDropdownOpen: false,
      };
    },
    methods: {
      toggleSortDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
      },
      handleSorting(orderBy) {
        this.$emit('updateSortOrder', orderBy); // Emit the sorting order back to the parent
        this.isDropdownOpen = false; // Close the dropdown after sorting
      },
    },
  };
  </script>
  
  
  <style scoped>
  .sort-container {
  position: relative;
  text-align: left;
  align-items: left;
}

.sort-icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 30px;
  padding: 8px;
  color: black;
  
}

.sort-dropdown {
  position: absolute;
  top: 40px; /* Justera detta för att passa din layout */
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.sort-dropdown ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.sort-dropdown li {
  padding: 10px;
  cursor: pointer;
}

.sort-dropdown li:hover {
  background-color: #f0f0f0;
}

  </style>
  