<template>
  <div>
    <h2>Gestion des catégories</h2>
    <button class="btn btn-success mb-3" @click="openCreateModal">
      Ajouter une catégorie
    </button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Description</th>
          <th>Actif</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>{{ category.description }}</td>
          <td>{{ category.active ? "Oui" : "Non" }}</td>
          <td>
            <button
              class="btn btn-sm btn-warning me-2"
              @click="openEditModal(category)"
            >
              Modifier
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="archiveCategory(category)"
            >
              Archiver
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Create/Edit Modal -->
    <div class="modal fade" id="categoryModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? "Modifier" : "Ajouter" }} une catégorie
            </h5>
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
                <label class="form-label">Nom</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.name.$error }"
                  @input="v$.name.$touch()"
                />
                <div v-if="v$.name.$error" class="text-danger">
                  <span v-if="v$.name.required.$invalid"
                    >Le nom est requis</span
                  >
                  <span v-else-if="v$.name.maxLength.$invalid"
                    >Le nom ne peut pas dépasser 100 caractères</span
                  >
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea
                  v-model="form.description"
                  class="form-control"
                  rows="3"
                  @input="v$.description.$touch()"
                ></textarea>
                <div v-if="v$.description.$error" class="text-danger">
                  <span v-if="v$.description.maxLength.$invalid"
                    >La description ne peut pas dépasser 500 caractères</span
                  >
                </div>
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
          </div>
        </div>
      </div>
    </div>

    <!-- Archive Confirmation Modal -->
    <div class="modal fade" id="archiveModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmer l'archivage</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Êtes-vous sûr de vouloir archiver la catégorie "{{
                categoryToArchive?.name
              }}" ?
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Annuler
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="confirmArchive"
            >
              Archiver
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import { Modal } from "bootstrap";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";

const categories = ref([]);
const isEditing = ref(false);
const error = ref("");
const categoryToArchive = ref(null);
const form = ref({
  name: "",
  description: "",
  active: true,
});

const rules = {
  name: { required, maxLength: maxLength(100) },
  description: { maxLength: maxLength(500) },
};

const v$ = useVuelidate(rules, form);

const loadCategories = async () => {
  try {
    const response = await api.getCategories();
    categories.value = response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  error.value = "";
  form.value = {
    name: "",
    description: "",
    active: true,
  };
  v$.value.$reset();
  const modal = new Modal(document.getElementById("categoryModal"));
  modal.show();
};

const openEditModal = (category) => {
  isEditing.value = true;
  error.value = "";
  form.value = { ...category };
  v$.value.$reset();
  const modal = new Modal(document.getElementById("categoryModal"));
  modal.show();
};

const archiveCategory = async (category) => {
  categoryToArchive.value = category;
  const modal = new Modal(document.getElementById("archiveModal"));
  modal.show();
};

const confirmArchive = async () => {
  if (categoryToArchive.value) {
    try {
      await api.deleteCategory(categoryToArchive.value.id);
      await loadCategories();
      const modal = Modal.getInstance(document.getElementById("archiveModal"));
      modal.hide();
      categoryToArchive.value = null;
    } catch (error) {
      console.error(error);
    }
  }
};

const handleSubmit = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  try {
    const data = { ...form.value };
    if (isEditing.value) {
      await api.updateCategory(form.value.id, data);
    } else {
      await api.createCategory(data);
    }
    await loadCategories();
    const modal = Modal.getInstance(document.getElementById("categoryModal"));
    modal.hide();
  } catch (err) {
    console.error(
      "Error creating/updating category:",
      err.response?.data || err,
    );
    error.value =
      err.response?.data?.message || "Erreur lors de la création/mise à jour";
  }
};

onMounted(() => {
  loadCategories();
});
</script>
