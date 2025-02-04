import { loginUser, registerUser, logoutUser, getUserProfile, updateUserProfile, changePassword  } from '@/api/users';

export default {
    namespaced: true,
    state: {
        user: null,
        token: localStorage.getItem('token') || null,
        loginError: null,
        registerError: null,
        profileError: null,
        passwordError: null,
        isAdmin: false,
    },
    getters: {
        isAuthenticated(state) {
            return !!state.token;
        },
        user(state) {
            return state.user;
        },
        loginError(state) {
            return state.loginError;
        },
        registerError(state) {
            return state.registerError;
        },
        profileError(state) {
            return state.profileError;
        },
        passwordError(state) {
            return state.passwordError;
        },
        isAdmin(state) {
            return state.isAdmin;
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        setLoginError(state, error) {
            state.loginError = error;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
        setRegisterError(state, error) {
            state.registerError = error;
        },
        setProfileError(state, error) {
            state.profileError = error;
          },
          setPasswordError(state, error) {
            state.passwordError = error;
          },
          setUserProfile(state, user) {
            state.user = user;
            state.isAdmin = user?.isAdmin || false;
          }
    },
    actions: {
        async login({ commit, dispatch }, credentials) {
            try {
                const response = await loginUser(credentials);
                const { user, token } = response.data;

                commit('setUser', user);
                commit('setToken', token);
                commit('setLoginError', null);
                await dispatch('loadUserProfile');
                await dispatch('wishlist/loadWishlist', null, { root: true });
            } catch (error) {
                commit('setLoginError', error.response?.data?.message || 'Inloggningen misslyckades');
            }
        },
        async logout({ commit }) {
            try {
                await logoutUser(); // Anropa logout-funktionen från API
                commit('logout'); // Uppdatera state och rensa token
            } catch (error) {
                console.error('Logout failed:', error);
            }
        },
        async register({ commit }, registerData) {
            try {
                const response = await registerUser(registerData);
                commit('setRegisterError', null); // Rensa felmeddelande om registreringen lyckas
                return response;
            } catch (error) {
                commit('setRegisterError', error.response?.data?.message || 'Registration failed');
                throw error;  // Kasta felet vidare för att hantera det i komponenten
            }
        },
        async loadUserProfile({ commit }) {
            try {
              const response = await getUserProfile(); // Hämta användarens profil via API
              commit('setUserProfile', response.data); // Uppdatera användarprofilen i state
              commit('setProfileError', null); // Rensa eventuella tidigare fel
            } catch (error) {
              commit('setProfileError', error.response?.data?.message || 'Failed to load user profile');
            }
          },
        async updateUserProfile({commit}, userData) {
            try {
                const response = await updateUserProfile(userData);
                commit ('setUserProfile', response.data);
                commit ('setProfilerError', null);
            } catch (error) {
                commit('setProfileError', error.response?.data?.message || 'Failed to update user profile');
                throw error;
            }
        },
        async changePassword({commit}, passwordData) {
            try {
                const response = await changePassword(passwordData);
                commit('setPasswordError', null);
                return response;
            } catch (error) {
                commit('setPasswordError', error.response?.data?.message || 'Failed to change password');
                throw error; 
            }
        }
    }
}
