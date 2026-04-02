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

const v$ = useVuelidate(rules, form);

const loading = ref(false);
const error = ref("");
const success = ref("");

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

onMounted(() => {
  loadProfile();
});
</script>
