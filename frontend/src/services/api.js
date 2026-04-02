import axios from "axios";

const api = {
  register(data) {
    return axios.post("/users", data);
  },
  getProfile() {
    return axios.get("/users/profile");
  },
  updateProfile(data) {
    return axios.put("/users/profile", data);
  },
  getUsers() {
    return axios.get("/users");
  },
  getUser(id) {
    return axios.get(`/users/${id}`);
  },
  updateUser(id, data) {
    return axios.put(`/users/${id}`, data);
  },
  deleteUser(id) {
    return axios.delete(`/users/${id}`);
  },
};

export default api;
