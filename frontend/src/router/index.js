import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import Profile from "../views/Profile.vue";
import Users from "../views/Users.vue";

const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    component: Users,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (
    (to.path === "/login" || to.path === "/register") &&
    authStore.isAuthenticated
  ) {
    next("/dashboard");
  } else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresAdmin && authStore.user?.role !== "admin") {
    next("/login");
  } else {
    next();
  }
});

export default router;
