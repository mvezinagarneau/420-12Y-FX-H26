<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">GarneauSupport</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/dashboard"
                >Tableau de bord</router-link
              >
            </li>
            <li
              class="nav-item"
              v-if="isAuthenticated && user?.role === 'admin'"
            >
              <router-link class="nav-link" to="/users"
                >Utilisateurs</router-link
              >
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/profile">Profil</router-link>
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link class="nav-link" to="/login">Connexion</router-link>
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link class="nav-link" to="/register"
                >Inscription</router-link
              >
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <a class="nav-link" @click="logout">Déconnexion</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <main class="container mt-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "./store/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style lang="scss">
// Custom styles
</style>
