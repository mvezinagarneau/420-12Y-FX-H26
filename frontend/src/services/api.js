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
  getCategories() {
    return axios.get("/categories");
  },
  createCategory(data) {
    return axios.post("/categories", data);
  },
  updateCategory(id, data) {
    return axios.put(`/categories/${id}`, data);
  },
  deleteCategory(id) {
    return axios.delete(`/categories/${id}`);
  },
  getTickets(params = {}) {
    return axios.get("/tickets", { params });
  },
  getMyTickets(params = {}) {
    return axios.get("/tickets/my", { params });
  },
  getTicket(id) {
    return axios.get(`/tickets/${id}`);
  },
  createTicket(data) {
    return axios.post("/tickets", data);
  },
  updateTicket(id, data) {
    return axios.put(`/tickets/${id}`, data);
  },
  assignTicket(id) {
    return axios.patch(`/tickets/${id}/assign`);
  },
  archiveTicket(id) {
    return axios.patch(`/tickets/${id}/archive`);
  },
  getComments(ticketId) {
    return axios.get(`/comments/ticket/${ticketId}`);
  },
  createComment(ticketId, data) {
    return axios.post(`/comments/ticket/${ticketId}`, data);
  },
};

export default api;
