import { defineStore } from "pinia";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user")) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    initialize() {
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      }
    },
    async login(credentials) {
      try {
        const response = await axios.post("/users/login", credentials);
        this.token = response.data.data.token;
        this.user = response.data.data.user;
        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    },
    async register(userData) {
      try {
        const response = await axios.post("/users", userData);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    },
    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
    },
  },
});
