<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h2>Mon Profil</h2>
      <form @submit.prevent="handleUpdate">
        <div class="mb-3">
          <label for="lastName" class="form-label">Nom</label>
          <input
            v-model="form.lastName"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': v$.lastName.$error }"
            id="lastName"
            @input="v$.lastName.$touch()"
          />
          <div v-if="v$.lastName.$error" class="text-danger">
            <span v-if="v$.lastName.required.$invalid">Le nom est requis</span>
            <span v-else-if="v$.lastName.minLength.$invalid"
              >Le nom doit contenir au moins 2 caractères</span
            >
            <span v-else-if="v$.lastName.maxLength.$invalid"
              >Le nom ne peut pas dépasser 50 caractères</span
            >
          </div>
        </div>
        <div class="mb-3">
          <label for="firstName" class="form-label">Prénom</label>
          <input
            v-model="form.firstName"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': v$.firstName.$error }"
            id="firstName"
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
          <label for="email" class="form-label">Courriel</label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
            id="email"
            readonly
          />
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Téléphone</label>
          <input
            v-model="form.phone"
            type="tel"
            class="form-control"
            :class="{ 'is-invalid': v$.phone.$error }"
            id="phone"
            @input="v$.phone.$touch()"
          />
          <div v-if="v$.phone.$error" class="text-danger">
            <span v-if="v$.phone.required.$invalid"
              >Le téléphone est requis</span
            >
            <span v-else-if="v$.phone.pattern.$invalid"
              >Le numéro de téléphone doit être composé de 10 chiffres</span
            >
          </div>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          Mettre à jour
        </button>
      </form>
      <p v-if="error" class="text-danger mt-3">{{ error }}</p>
      <p v-if="success" class="text-success mt-3">{{ success }}</p>

      <hr class="my-4" />

      <h3>Changer le mot de passe</h3>
      <form @submit.prevent="handlePasswordUpdate">
        <div class="mb-3">
          <label for="currentPassword" class="form-label"
            >Mot de passe actuel</label
          >
          <input
            v-model="passwordForm.currentPassword"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': passwordV$.currentPassword.$error }"
            id="currentPassword"
            @input="passwordV$.currentPassword.$touch()"
          />
          <div v-if="passwordV$.currentPassword.$error" class="text-danger">
            Le mot de passe actuel est requis
          </div>
        </div>
        <div class="mb-3">
          <label for="newPassword" class="form-label"
            >Nouveau mot de passe</label
          >
          <input
            v-model="passwordForm.newPassword"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': passwordV$.newPassword.$error }"
            id="newPassword"
            @input="passwordV$.newPassword.$touch()"
          />
          <div v-if="passwordV$.newPassword.$error" class="text-danger">
            <span v-if="passwordV$.newPassword.required.$invalid"
              >Le nouveau mot de passe est requis</span
            >
            <span v-else-if="passwordV$.newPassword.minLength.$invalid"
              >Le mot de passe doit contenir au moins 6 caractères</span
            >
            <span v-else-if="passwordV$.newPassword.pattern.$invalid"
              >Le mot de passe doit contenir au moins une minuscule, une
              majuscule, un chiffre et un caractère spécial</span
            >
          </div>
        </div>
        <div class="mb-3">
          <label for="confirmNewPassword" class="form-label"
            >Confirmer le nouveau mot de passe</label
          >
          <input
            v-model="passwordForm.confirmNewPassword"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': passwordV$.confirmNewPassword.$error }"
            id="confirmNewPassword"
            @input="passwordV$.confirmNewPassword.$touch()"
          />
          <div v-if="passwordV$.confirmNewPassword.$error" class="text-danger">
            <span v-if="passwordV$.confirmNewPassword.required.$invalid"
              >La confirmation est requise</span
            >
            <span
              v-else-if="
                passwordV$.confirmNewPassword.sameAsNewPassword.$invalid
              "
              >Les mots de passe ne correspondent pas</span
            >
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-warning"
          :disabled="passwordLoading"
        >
          Changer le mot de passe
        </button>
      </form>
      <p v-if="passwordError" class="text-danger mt-3">{{ passwordError }}</p>
      <p v-if="passwordSuccess" class="text-success mt-3">
        {{ passwordSuccess }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  maxLength,
  helpers,
} from "@vuelidate/validators";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import api from "../services/api";

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  lastName: "",
  firstName: "",
  email: "",
  phone: "",
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const rules = {
  lastName: { required, minLength: minLength(2), maxLength: maxLength(50) },
  firstName: { required, minLength: minLength(2), maxLength: maxLength(50) },
  phone: {
    required,
    pattern: helpers.withMessage(
      "Le numéro de téléphone doit être composé de 10 chiffres",
      (value) => /^\d{10}$/.test(value),
    ),
  },
};

const passwordRules = {
  currentPassword: { required },
  newPassword: {
    required,
    minLength: minLength(6),
    pattern: helpers.withMessage(
      "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial",
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$ %^&*\-]).*$/.test(value),
    ),
  },
  confirmNewPassword: {
    required,
    sameAsNewPassword: helpers.withMessage(
      "Les mots de passe ne correspondent pas",
      (value) => value === passwordForm.value.newPassword,
    ),
  },
};

const v$ = useVuelidate(rules, form);
const passwordV$ = useVuelidate(passwordRules, passwordForm);

const loading = ref(false);
const error = ref("");
const success = ref("");

const passwordLoading = ref(false);
const passwordError = ref("");
const passwordSuccess = ref("");

const loadProfile = async () => {
  try {
    const response = await api.getProfile();
    form.value = {
      lastName: response.data.data.lastName,
      firstName: response.data.data.firstName,
      email: response.data.data.email,
      phone: response.data.data.phone.replace(/\D/g, ""), // keep only digits
    };
  } catch (err) {
    // If API fails, use store data
    if (authStore.user) {
      form.value = {
        lastName: authStore.user.lastName || "",
        firstName: authStore.user.firstName || "",
        email: authStore.user.email || "",
        phone: (authStore.user.phone || "").replace(/\D/g, ""),
      };
      // Don't show error since we have data from store
    } else {
      error.value =
        err.response?.data?.message || "Erreur lors du chargement du profil";
    }
  }
};

const handleUpdate = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;
  loading.value = true;
  error.value = "";
  success.value = "";
  try {
    const dataToSend = {
      ...form.value,
      phone: `(${form.value.phone.slice(0, 3)}) ${form.value.phone.slice(3, 6)}-${form.value.phone.slice(6)}`,
    };
    const response = await api.updateProfile(dataToSend);
    authStore.user = response.data.data; // update store
    success.value = "Profil mis à jour avec succès";
  } catch (err) {
    console.error(err);
    error.value =
      err.response?.data?.message || "Erreur lors de la mise à jour";
  } finally {
    loading.value = false;
  }
};

const handlePasswordUpdate = async () => {
  const isValid = await passwordV$.value.$validate();
  if (!isValid) return;
  passwordLoading.value = true;
  passwordError.value = "";
  passwordSuccess.value = "";
  try {
    await api.updatePassword(passwordForm.value);
    passwordSuccess.value = "Mot de passe mis à jour avec succès";
    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };
    passwordV$.value.$reset();
  } catch (err) {
    console.error(err);
    passwordError.value =
      err.response?.data?.message ||
      "Erreur lors de la mise à jour du mot de passe";
  } finally {
    passwordLoading.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>
