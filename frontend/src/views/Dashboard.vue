<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <h2>Tableau de bord</h2>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">
            Bienvenue, {{ user?.firstName }} {{ user?.lastName }}
          </h5>
          <p class="card-text">Rôle : {{ user?.role }}</p>
          <p class="card-text">Courriel : {{ user?.email }}</p>
          <p v-if="user?.role === 'admin'" class="card-text">
            En tant qu'administrateur, vous pouvez gérer les utilisateurs.
          </p>
          <p v-else-if="user?.role === 'technicien'" class="card-text">
            En tant que technicien, vous pouvez accéder aux demandes de support.
          </p>
          <p v-else class="card-text">
            En tant que client, vous pouvez soumettre des demandes de support.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "../store/auth";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>
