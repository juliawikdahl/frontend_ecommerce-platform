<template>
    <div v-if="editableUser"  >
    <form @submit.prevent="saveProfile" class="profile-form container">
        <div>  
        <h1>{{ editableUser.name }}'s Profile</h1>
        <div>
            <div>
          <label for="email">Email:</label>
          <input
            id="email"
            v-model="editableUser.email"
            type="email"
            readonly
            class="readonly-input"
          />
        </div>
        <label for="name">Name:</label>
        <input id="name" v-model="editableUser.name" type="text" required @blur="validateName" />
        <p v-if="nameError" class="error">{{ nameError }}</p>
      </div>
        <div>
        <label for="address">Address:</label>
        <input id="address" v-model="editableUser.address" type="text" />
      </div>
      <div>
        <label for="mobile">Mobile:</label>
        <input id="mobile" v-model="editableUser.mobile" type="text" pattern="^[0-9]{10}$" />
      </div>
      <div class="location-inputs">
          <div>
            <label for="city">City:</label>
            <input id="city" v-model="editableUser.city" type="text" />
          </div>

          <div>
            <label for="zipcode">Zipcode:</label>
            <input id="zipcode" v-model="editableUser.zipcode" type="text" pattern="^[0-9]{5}$" />
          </div>
        </div>
    
      <p @click="togglePasswordForm"  class="link-text"> Want to change password?</p>
      <div v-if="showChangePassword">
          <div class="password-container">
            <label for="oldPassword">Old password:</label>
            <input id="oldPassword" v-model="passwordData.oldPassword" :type="showOldPassword ? 'text' : 'password'" required  />
            <span
        class="toggle-password-icon"
        @click="toggleShowPassword('old')"
        :aria-label="showOldPassword ? 'Hide password' : 'Show password'"
      >
        <i :class="showOldPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
      </span>
        </div>
          <div class="password-container">
            <label for="newPassword">New Password:</label>
            <input id="newPassword" v-model="passwordData.newPassword" :type="showOldPassword ? 'text' : 'password'" required />
            <span
        class="toggle-password-icon"
        @click="toggleShowPassword('new')"
        :aria-label="showOldPassword ? 'Hide password' : 'Show password'"
      >
        <i :class="showOldPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
      </span>
          </div>
          <p v-if="passwordError" class="error">{{ passwordError }}</p>
        </div>

        <p v-if="saveError" class="error">{{ saveError }}</p>
        <p v-if="saveSuccess" class="success">{{ saveSuccess }}!</p>  
      <button type="submit" :disabled="nameError">Save</button>
      </div>
    </form>
</div> 

    <div v-else>
      <p>Loading profile...</p>
    </div>
  </template>
  
  <script>

  export default {
    data() {
        return {
            editableUser: null,
            saveError: null,
            saveSuccess: null,
            nameError: null, 
        passwordData: {
        oldPassword: '',
        newPassword: '',
      },
      showChangePassword: false, 
      showOldPassword: false,
      showNewPassword: false,
        }
    },
    computed: {
      user() {
        return this.$store.getters['auth/user'];
      },
      profileError() {
        return this.$store.getters['auth/profileError'];
      },
      passwordError() {
      return this.$store.getters['auth/passwordError']; 
    },
    },
    created() {
      if (this.$store.getters['auth/isAuthenticated']) {
        this.$store.dispatch('auth/loadUserProfile').then(() => {
            this.editableUser = {...this.user};
        })
      }
    },
    methods: {
    
        async saveProfile() {
            console.log('saveProfile-metoden anropades');
            try {
                console.log('försöker uppdatera', this.editableUser )
                this.saveError = null;
                this.saveSuccess = null;
                await this.$store.dispatch('auth/updateUserProfile', this.editableUser);

                if (this.showChangePassword) {
                    await this.$store.dispatch('auth/changePassword', this.passwordData);
                    this.passwordData.oldPassword = '';
                    this.passwordData.newPassword = '';
                }
                this.saveSuccess = 'Profilen har uppdaterats';
                this.showChangePassword = false;
            } catch (error) {
                this.saveError = error.response?.data?.message || 'Kunde inte uppdatera profilen.';
            }
        },
        validateName() {
            const nameParts = this.editableUser.name.trim().split(' ');
            if(nameParts.length < 2) {
                this.nameError = 'För- och efternamn måste anges';
            } else {
                this.nameError = null;
            }
        },
        togglePasswordForm() {
          this.showChangePassword = !this.showChangePassword
        },
        toggleShowPassword(type) {
            if (type === 'old') {
                this.showOldPassword = !this.showOldPassword;
            } else if (type === 'new') {
                this.showNewPassword = !this.showNewPassword;
            }
        }
        
    }
  }
  </script>
<style scoped>

.link-text {
  color: #050505;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 1rem;
}
.profile-form {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

form {
background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

h1 {
  text-align: center;
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
}

label {
  font-size: 1rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: none;
  border-bottom: 1px solid black;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  border-bottom: 1px solid #007bff;
  outline: none;
}
.password-container input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  background-color: #f7f7f7;
  transition: all 0.3s ease;
}

.password-container input:focus {
  border-color: #246ec2;
  background-color: #ffffff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}
.password-container {
  position: relative;
}


.toggle-password-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #aaa;
  font-size: 1.3rem;
  transition: color 0.3s ease;
}


.toggle-password-icon:hover {
  color: black;
}

button {
  width: 100%;
  padding: 1rem;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #cccccc;
}
.error {
  color: #ff4d4d;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.success {
  color: #28a745;
  font-size: 1rem;
  margin-top: 1rem;
  text-align: center;
}
.readonly-input {
  color: lightgrey;
  cursor: not-allowed;
  border-bottom: 1px solid lightgrey;
  
}
.location-inputs {
  display: flex;
  gap: 1rem;
}

.location-inputs div {
  flex: 1;
}


@media (max-width: 600px) {
  .profile-form {
    padding: 1rem;
  }

  form {
    padding: 1rem;
  }
}
</style>
