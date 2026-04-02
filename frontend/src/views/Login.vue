<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h2>Connexion</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Courriel</label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': v$.email.$error }"
            id="email"
            @input="v$.email.$touch()"
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
            Le mot de passe est requis
          </div>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          Se connecter
        </button>
      </form>
      <p v-if="error" class="text-danger mt-3">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, maxLength } from "@vuelidate/validators";

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  email: "",
  password: "",
});

const rules = {
  email: { required, email, maxLength: maxLength(50) },
  password: { required },
};

const v$ = useVuelidate(rules, form);

const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;
  loading.value = true;
  error.value = "";
  try {
    await authStore.login(form.value);
    router.push("/dashboard");
  } catch (err) {
    error.value = err.message || "Erreur de connexion";
  } finally {
    loading.value = false;
  }
};
</script>
