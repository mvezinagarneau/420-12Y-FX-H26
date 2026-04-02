<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h2>Inscription</h2>
      <form @submit.prevent="handleRegister">
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
            :class="{ 'is-invalid': v$.email.$error }"
            id="email"
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
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe</label>
          <input
            v-model="form.password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': v$.password.$error }"
            id="password"
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
        <div class="mb-3">
          <label for="confirmPassword" class="form-label"
            >Confirmer mot de passe</label
          >
          <input
            v-model="form.confirmPassword"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': v$.confirmPassword.$error }"
            id="confirmPassword"
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
          S'inscrire
        </button>
      </form>
      <p v-if="error" class="text-danger mt-3">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
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
  password: "",
  confirmPassword: "",
  phone: "",
});

const rules = {
  lastName: { required, minLength: minLength(2), maxLength: maxLength(50) },
  firstName: { required, minLength: minLength(2), maxLength: maxLength(50) },
  email: { required, email, maxLength: maxLength(50) },
  password: {
    required,
    minLength: minLength(6),
    pattern: helpers.withMessage(
      "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial",
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$ %^&*\-]).*$/.test(value),
    ),
  },
  confirmPassword: {
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
};

const v$ = useVuelidate(rules, form);

const loading = ref(false);
const error = ref("");
const emailError = ref("");

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

const handleRegister = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;
  loading.value = true;
  error.value = "";
  try {
    const data = { ...form.value };
    if (data.phone && /^\d{10}$/.test(data.phone)) {
      data.phone = `(${data.phone.slice(0, 3)}) ${data.phone.slice(3, 6)}-${data.phone.slice(6)}`;
    }
    await authStore.register(data);
    router.push("/login");
  } catch (err) {
    error.value = err.message || "Erreur d'inscription";
  } finally {
    loading.value = false;
  }
};
</script>
