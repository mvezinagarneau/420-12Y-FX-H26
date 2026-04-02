<template>
  <div class="row justify-content-center">
    <div class="col-md-10">
      <h2>Tableau de bord</h2>
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">
            Bienvenue, {{ user?.firstName }} {{ user?.lastName }}
          </h5>
          <p class="card-text">Rôle : {{ user?.role }}</p>
          <p class="card-text">Courriel : {{ user?.email }}</p>
          <p v-if="user?.role === 'admin'" class="card-text">
            En tant qu'administrateur, vous pouvez gérer les utilisateurs et les
            catégories.
          </p>
          <p v-else-if="user?.role === 'technicien'" class="card-text">
            En tant que technicien, vous pouvez gérer les demandes de support
            assignées.
          </p>
          <p v-else class="card-text">
            En tant que client, vous pouvez soumettre et suivre vos demandes de
            support.
          </p>
          <button
            v-if="user?.role === 'client'"
            class="btn btn-primary mt-3"
            @click="openCreateModal"
          >
            Créer une demande
          </button>
        </div>
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">{{ stats.total }}</h5>
                <p class="card-text">Total demandes</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">{{ stats.open }}</h5>
                <p class="card-text">Ouvertes</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">{{ stats.inProgress }}</h5>
                <p class="card-text">En cours</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">{{ stats.resolved }}</h5>
                <p class="card-text">Résolues</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card-header">
          <h5>Mes demandes de support</h5>
        </div>
        <div class="card-body">
          <table v-if="tickets.length > 0" class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Priorité</th>
                <th>Créé le</th>
                <th v-if="user?.role !== 'client'">Client</th>
                <th v-if="user?.role === 'admin'">Technicien</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in tickets" :key="ticket.id">
                <td>{{ ticket.id }}</td>
                <td>{{ ticket.title }}</td>
                <td>{{ ticket.category?.name }}</td>
                <td>
                  <span
                    :class="{
                      'badge bg-secondary': ticket.status === 'Ouvert',
                      'badge bg-warning': ticket.status === 'En cours',
                      'badge bg-success': ticket.status === 'Résolu',
                      'badge bg-danger': ticket.status === 'Fermé',
                    }"
                    >{{ ticket.status }}</span
                  >
                </td>
                <td>
                  <span
                    :class="{
                      'badge bg-light text-dark': ticket.priority === 'Basse',
                      'badge bg-info': ticket.priority === 'Moyenne',
                      'badge bg-warning': ticket.priority === 'Haute',
                      'badge bg-danger': ticket.priority === 'Critique',
                    }"
                    >{{ ticket.priority }}</span
                  >
                </td>
                <td>{{ new Date(ticket.createdAt).toLocaleDateString() }}</td>
                <td v-if="user?.role !== 'client'">
                  {{ ticket.client?.firstName }} {{ ticket.client?.lastName }}
                </td>
                <td v-if="user?.role === 'admin'">
                  {{ ticket.technician?.firstName }}
                  {{ ticket.technician?.lastName }}
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-muted">Aucune demande de support trouvée.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Ticket Modal -->
  <div class="modal fade" id="createTicketModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Créer une demande de support</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Titre</label>
              <input
                v-model="ticketForm.title"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': v$.title.$error }"
                @input="v$.title.$touch()"
              />
              <div v-if="v$.title.$error" class="text-danger">
                <span v-if="v$.title.required.$invalid"
                  >Le titre est requis</span
                >
                <span v-else-if="v$.title.minLength.$invalid"
                  >Le titre doit contenir au moins 3 caractères</span
                >
                <span v-else-if="v$.title.maxLength.$invalid"
                  >Le titre ne peut pas dépasser 100 caractères</span
                >
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea
                v-model="ticketForm.description"
                class="form-control"
                rows="4"
                :class="{ 'is-invalid': v$.description.$error }"
                @input="v$.description.$touch()"
              ></textarea>
              <div v-if="v$.description.$error" class="text-danger">
                <span v-if="v$.description.required.$invalid"
                  >La description est requise</span
                >
                <span v-else-if="v$.description.minLength.$invalid"
                  >La description doit contenir au moins 10 caractères</span
                >
                <span v-else-if="v$.description.maxLength.$invalid"
                  >La description ne peut pas dépasser 1000 caractères</span
                >
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Catégorie</label>
              <select
                v-model="ticketForm.categoryId"
                class="form-select"
                :class="{ 'is-invalid': v$.categoryId.$error }"
                @change="v$.categoryId.$touch()"
              >
                <option value="">Sélectionner une catégorie</option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
              <div v-if="v$.categoryId.$error" class="text-danger">
                <span v-if="v$.categoryId.required.$invalid"
                  >La catégorie est requise</span
                >
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Priorité</label>
              <select
                v-model="ticketForm.priority"
                class="form-select"
                :class="{ 'is-invalid': v$.priority.$error }"
                @change="v$.priority.$touch()"
              >
                <option value="">Sélectionner une priorité</option>
                <option value="Basse">Basse</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Haute">Haute</option>
                <option value="Critique">Critique</option>
              </select>
              <div v-if="v$.priority.$error" class="text-danger">
                <span v-if="v$.priority.required.$invalid"
                  >La priorité est requise</span
                >
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Créer</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../store/auth";
import api from "../services/api";
import { Modal } from "bootstrap";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, minLength } from "@vuelidate/validators";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const tickets = ref([]);
const categories = ref([]);
const error = ref("");

const ticketForm = ref({
  title: "",
  description: "",
  categoryId: "",
  priority: "",
});

const rules = {
  title: { required, minLength: minLength(3), maxLength: maxLength(100) },
  description: {
    required,
    minLength: minLength(10),
    maxLength: maxLength(1000),
  },
  categoryId: { required },
  priority: { required },
};

const v$ = useVuelidate(rules, ticketForm);

const stats = computed(() => {
  const total = tickets.value.length;
  const open = tickets.value.filter((t) => t.status === "Ouvert").length;
  const inProgress = tickets.value.filter(
    (t) => t.status === "En cours",
  ).length;
  const resolved = tickets.value.filter((t) => t.status === "Résolu").length;
  return { total, open, inProgress, resolved };
});

const loadTickets = async () => {
  try {
    const response = await api.getTickets();
    tickets.value = response.data.data;
  } catch (error) {
    console.error("Erreur lors du chargement des tickets:", error);
  }
};

const loadCategories = async () => {
  try {
    const response = await api.getCategories();
    categories.value = response.data.data;
  } catch (error) {
    console.error("Erreur lors du chargement des catégories:", error);
  }
};

const openCreateModal = () => {
  error.value = "";
  ticketForm.value = {
    title: "",
    description: "",
    categoryId: "",
    priority: "",
  };
  v$.value.$reset();
  const modal = new Modal(document.getElementById("createTicketModal"));
  modal.show();
};

const handleSubmit = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  try {
    await api.createTicket(ticketForm.value);
    await loadTickets();
    const modal = Modal.getInstance(
      document.getElementById("createTicketModal"),
    );
    modal.hide();
  } catch (err) {
    console.error(
      "Erreur lors de la création du ticket:",
      err.response?.data || err,
    );
    error.value = err.response?.data?.message || "Erreur lors de la création";
  }
};

onMounted(() => {
  loadTickets();
  loadCategories();
});
</script>
