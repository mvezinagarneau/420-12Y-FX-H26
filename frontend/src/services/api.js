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
  updatePassword(data) {
    return axios.put("/users/profile/password", data);
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
  toggleActive(id, active) {
    return axios.patch(`/users/${id}/active`, { active });
  },
  deleteUser(id) {
    return axios.delete(`/users/${id}`);
  },
  checkEmailExists(email) {
    return axios.get(`/users/check-email?email=${encodeURIComponent(email)}`);
  },
};

export default api;
