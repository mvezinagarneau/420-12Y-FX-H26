<template>
  <div>
    <h2>Gestion des utilisateurs</h2>
    <button class="btn btn-success mb-3" @click="openCreateModal">
      Ajouter un utilisateur
    </button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Courriel</th>
          <th>Rôle</th>
          <th>Actif</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.active ? "Oui" : "Non" }}</td>
          <td>
            <button
              class="btn btn-sm btn-warning me-2"
              @click="openEditModal(user)"
            >
              Modifier
            </button>
            <button
              class="btn btn-sm btn-secondary"
              @click="toggleActive(user)"
            >
              {{ user.active ? "Désactiver" : "Activer" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Create/Edit Modal -->
    <div class="modal fade" id="userModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? "Modifier" : "Ajouter" }} un utilisateur
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Nom</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.lastName.$error }"
                  required
                  @input="v$.lastName.$touch()"
                />
                <div v-if="v$.lastName.$error" class="text-danger">
                  <span v-if="v$.lastName.required.$invalid"
                    >Le nom est requis</span
                  >
                  <span v-else-if="v$.lastName.minLength.$invalid"
                    >Le nom doit contenir au moins 2 caractères</span
                  >
                  <span v-else-if="v$.lastName.maxLength.$invalid"
                    >Le nom ne peut pas dépasser 50 caractères</span
                  >
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Prénom</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.firstName.$error }"
                  required
                  @input="v$.firstName.$touch()"
                />
                <div v-if="v$.firstName.$error" class="text-danger">
                  <span v-if="v$.firstName.required.$invalid"
                    >Le prénom est requis</span
                  >
                  <span v-else-if="v$.firstName.minLength.$invalid"
                    >Le prénom doit contenir au moins 2 caractères</span
                  >
                  <span v-else-if="v$.firstName.maxLength.$invalid"
                    >Le prénom ne peut pas dépasser 50 caractères</span
                  >
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Courriel</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': v$.email.$error }"
                  required
                  @input="
                    v$.email.$touch();
                    emailError = '';
                  "
                  @blur="checkEmail"
                />
                <div v-if="v$.email.$error" class="text-danger">
                  <span v-if="v$.email.required.$invalid"
                    >Le courriel est requis</span
                  >
                  <span v-else-if="v$.email.email.$invalid"
                    >Le courriel est invalide</span
                  >
                  <span v-else-if="v$.email.maxLength.$invalid"
                    >Le courriel ne peut pas dépasser 50 caractères</span
                  >
                </div>
                <div v-if="emailError" class="text-danger">
                  {{ emailError }}
                </div>
              </div>
              <div class="mb-3" v-if="!isEditing">
                <label class="form-label">Mot de passe</label>
                <input
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': v$.password.$error }"
                  required
                  @input="v$.password.$touch()"
                />
                <div v-if="v$.password.$error" class="text-danger">
                  <span v-if="v$.password.required.$invalid"
                    >Le mot de passe est requis</span
                  >
                  <span v-else-if="v$.password.minLength.$invalid"
                    >Le mot de passe doit contenir au moins 6 caractères</span
                  >
                  <span v-else-if="v$.password.pattern.$invalid"
                    >Le mot de passe doit contenir au moins une minuscule, une
                    majuscule, un chiffre et un caractère spécial</span
                  >
                </div>
              </div>
              <div class="mb-3" v-if="!isEditing">
                <label class="form-label">Confirmer mot de passe</label>
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': v$.confirmPassword.$error }"
                  required
                  @input="v$.confirmPassword.$touch()"
                />
                <div v-if="v$.confirmPassword.$error" class="text-danger">
                  <span v-if="v$.confirmPassword.required.$invalid"
                    >La confirmation du mot de passe est requise</span
                  >
                  <span v-else-if="v$.confirmPassword.sameAsPassword.$invalid"
                    >Les mots de passe ne correspondent pas</span
                  >
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Téléphone</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="form-control"
                  :class="{ 'is-invalid': v$.phone.$error }"
                  required
                  @input="v$.phone.$touch()"
                />
                <div v-if="v$.phone.$error" class="text-danger">
                  <span v-if="v$.phone.required.$invalid"
                    >Le téléphone est requis</span
                  >
                  <span v-else-if="v$.phone.pattern.$invalid"
                    >Le numéro de téléphone doit être composé de 10
                    chiffres</span
                  >
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Rôle</label>
                <select v-model="form.role" class="form-control" required>
                  <option value="client">Client</option>
                  <option value="technicien">Technicien</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="mb-3 form-check" v-if="isEditing">
                <input
                  v-model="form.active"
                  type="checkbox"
                  class="form-check-input"
                  id="active"
                />
                <label class="form-check-label" for="active">Actif</label>
              </div>
              <button type="submit" class="btn btn-primary">
                {{ isEditing ? "Modifier" : "Ajouter" }}
              </button>
            </form>
            <p v-if="error" class="text-danger mt-3">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";
import { Modal } from "bootstrap";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  maxLength,
  helpers,
} from "@vuelidate/validators";

const users = ref([]);
const isEditing = ref(false);
const error = ref("");
const emailError = ref("");
const form = ref({
  lastName: "",
  firstName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  role: "client",
  active: true,
});

const rules = computed(() => ({
  lastName: { required, minLength: minLength(2), maxLength: maxLength(50) },
  firstName: { required, minLength: minLength(2), maxLength: maxLength(50) },
  email: { required, email, maxLength: maxLength(50) },
  password: isEditing.value
    ? {}
    : {
        required,
        minLength: minLength(6),
        pattern: helpers.withMessage(
          "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial",
          (value) =>
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$ %^&*\-]).*$/.test(
              value,
            ),
        ),
      },
  confirmPassword: isEditing.value
    ? {}
    : {
        required,
        sameAsPassword: helpers.withMessage(
          "Les mots de passe ne correspondent pas",
          (value) => value === form.value.password,
        ),
      },
  phone: {
    required,
    pattern: helpers.withMessage(
      "Le numéro de téléphone doit être composé de 10 chiffres ou au format (XXX) XXX-XXXX",
      (value) => /^\(\d{3}\) \d{3}-\d{4}$|^\d{10}$/.test(value),
    ),
  },
}));

const v$ = useVuelidate(rules, form);

onMounted(async () => {
  await loadUsers();
});

const loadUsers = async () => {
  try {
    const response = await api.getUsers();
    users.value = response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  error.value = "";
  emailError.value = "";
  form.value = {
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "client",
    active: true,
  };
  v$.value.$reset();
  const modal = new Modal(document.getElementById("userModal"));
  modal.show();
};

const openEditModal = (user) => {
  isEditing.value = true;
  error.value = "";
  emailError.value = "";
  form.value = { ...user };
  delete form.value.password; // don't send password
  delete form.value.confirmPassword; // not needed for edit
  v$.value.$reset();
  const modal = new Modal(document.getElementById("userModal"));
  modal.show();
};

const toggleActive = async (user) => {
  try {
    await api.toggleActive(user.id, !user.active);
    await loadUsers();
  } catch (error) {
    console.error(error);
  }
};

const checkEmail = async () => {
  if (form.value.email && v$.value.email.email && !v$.value.email.$error) {
    try {
      const response = await api.checkEmailExists(form.value.email);
      if (response.data.data.exists) {
        emailError.value = "Courriel déjà utilisé.";
      } else {
        emailError.value = "";
      }
    } catch (err) {
      console.error("Error checking email:", err);
    }
  }
};

const handleSubmit = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  try {
    const data = { ...form.value };
    delete data.id; // remove id since it's in the URL
    if (data.phone && /^\d{10}$/.test(data.phone)) {
      data.phone = `(${data.phone.slice(0, 3)}) ${data.phone.slice(3, 6)}-${data.phone.slice(6)}`;
    }
    if (isEditing.value) {
      console.log("Updating user with data:", data);
      console.log("User ID:", form.value.id);
      await api.updateUser(form.value.id, data);
    } else {
      // For create, use register
      console.log("Creating user with data:", data);
      delete data.active; // Not needed for registration, users are active by default
      await api.register(data);
    }
    await loadUsers();
    const modal = Modal.getInstance(document.getElementById("userModal"));
    modal.hide();
  } catch (err) {
    console.error("Error creating/updating user:", err.response?.data || err);
    const message =
      err.response?.data?.message || "Erreur lors de la création/mise à jour";
    if (message === "Courriel déjà utilisé.") {
      emailError.value = message;
    } else {
      error.value = message;
    }
  }
};
</script>
