<template>
  <div class="form-container">
    <div class="form-card">
      <h1 class="form-title">{{ title }}</h1>

      <div v-if="formStatus.success" class="success-message">
        <p>
          Product {{ route.params.id ? "updated" : "created" }} successfully!
        </p>
        <Button variant="secondary" @click="router.push('/')">
          Back to Home
        </Button>
      </div>

      <form v-else @submit.prevent="handleSubmitForm" class="product-form">
        <div class="form-group">
          <label for="title">Product Title</label>
          <input
            type="text"
            id="title"
            v-model="formData.title"
            placeholder="Enter product title"
            :disabled="formStatus.loading"
            :class="{ 'input-error': validationErrors.title }"
          />
          <p v-if="validationErrors.title" class="error-text">
            {{ validationErrors.title }}
          </p>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            placeholder="Enter product description"
            rows="4"
            :disabled="formStatus.loading"
            :class="{ 'input-error': validationErrors.description }"
          ></textarea>
          <p v-if="validationErrors.description" class="error-text">
            {{ validationErrors.description }}
          </p>
        </div>

        <div class="form-group">
          <label for="price">Price ($)</label>
          <input
            type="number"
            id="price"
            v-model="formData.price"
            placeholder="0.00"
            step="0.01"
            min="0"
            :disabled="formStatus.loading"
            :class="{ 'input-error': validationErrors.price }"
          />
          <p v-if="validationErrors.price" class="error-text">
            {{ validationErrors.price }}
          </p>
        </div>

        <div class="form-group">
          <label for="category">Category</label>
          <select
            id="category"
            v-model="formData.category"
            :class="{ 'input-error': validationErrors.category }"
            :disabled="formStatus.loading"
          >
            <option value="" disabled>Select a category</option>
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
          <p v-if="validationErrors.category" class="error-text">
            {{ validationErrors.category }}
          </p>
        </div>

        <div class="form-group">
          <label for="image">Image URL</label>
          <input
            type="url"
            id="image"
            v-model="formData.image"
            placeholder="https://example.com/image.jpg"
            :disabled="formStatus.loading"
            :class="{ 'input-error': validationErrors.image }"
          />
          <p v-if="validationErrors.image" class="error-text">
            {{ validationErrors.image }}
          </p>
        </div>

        <div
          v-if="formData.image && isValidUrl(formData.image)"
          class="image-preview"
        >
          <h3>Image Preview</h3>
          <img :src="formData.image" alt="Product preview" />
        </div>

        <div v-if="formStatus.error" class="error-message">
          <p>{{ formStatus.error }}</p>
        </div>

        <div class="form-actions">
          <Button
            type="button"
            variant="outline"
            :disabled="formStatus.loading"
            @click="handleResetForm"
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="primary"
            :disabled="formStatus.loading"
          >
            {{ submitButtonText }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import Button from "@/components/Button.vue";

const route = useRoute();
const router = useRouter();

const categories = ref([
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
]);

const formData = reactive({
  title: "",
  description: "",
  price: "",
  category: "",
  image: "",
});

const formStatus = reactive({
  loading: false,
  success: false,
  error: null,
});

const validationErrors = reactive({
  title: "",
  description: "",
  price: "",
  category: "",
  image: "",
});

const productData = reactive({
  id: null,
  title: null,
  description: null,
  price: null,
  category: null,
  image: null,
});

const title = computed(() => {
  if (route.params.id) {
    return "Update Product";
  }

  return "Create New Product";
});

const submitButtonText = computed(() => {
  if (route.params.id) {
    return "Update";
  }

  return "Create";
});

onMounted(async () => {
  if (!route.params.id) return;

  fetchProduct(route.params.id);
});

const fetchProduct = async (id) => {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    for (const [key, value] of Object.entries(formData)) {
      formData[key] = data[key];
      productData[key] = data[key];
    }
  } catch (err) {
    console.error("Error get product:", err);
  }
};

const validateForm = () => {
  let isValid = true;

  // Reset validation errors
  Object.keys(validationErrors).forEach((key) => {
    validationErrors[key] = "";
  });

  if (!formData.title.trim()) {
    validationErrors.title = "Title is required";
    isValid = false;
  }

  if (!formData.description.trim()) {
    validationErrors.description = "Description is required";
    isValid = false;
  }

  if (!formData.price) {
    validationErrors.price = "Price is required";
    isValid = false;
  } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
    validationErrors.price = "Price must be a positive number";
    isValid = false;
  }

  if (!formData.category) {
    validationErrors.category = "Category is required";
    isValid = false;
  }

  if (!formData.image.trim()) {
    validationErrors.image = "Image URL is required";
    isValid = false;
  } else if (!isValidUrl(formData.image)) {
    validationErrors.image = "Please enter a valid URL";
    isValid = false;
  }

  return isValid;
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

const handleSubmitForm = async () => {
  if (!validateForm()) return;

  formStatus.loading = true;
  formStatus.success = false;
  formStatus.error = null;

  try {
    let url = "https://fakestoreapi.com/products";
    let method = "POST";

    if (route.params.id) {
      url += `/${route.params.id}`;
      method = "PUT";
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.title,
        price: Number(formData.price),
        description: formData.description,
        category: formData.category,
        image: formData.image,
      }),
    });

    if (!response.ok) {
      let message = "Failed to create product";

      if (route.params.id) {
        let message = "Failed to update product";
      }

      throw new Error(message);
    }

    const data = await response.json();

    // Reset form after successful submission
    Object.keys(formData).forEach((key) => {
      formData[key] = "";
    });

    formStatus.success = true;
  } catch (error) {
    let message = "Error creating product:";

    if (route.params.id) {
      let message = "Error updating product:";
    }

    console.error(message, error);
    formStatus.error = error.message;
  } finally {
    formStatus.loading = false;
  }
};

const handleResetForm = () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = productData[key] || "";
  });

  Object.keys(validationErrors).forEach((key) => {
    validationErrors[key] = "";
  });

  formStatus.success = false;
  formStatus.error = null;
};
</script>

<style lang="css" scoped>
.form-container {
  padding: 24px 16px;
  max-width: 800px;
  margin: 0 auto;
}

.form-card {
  background-color: var(--surface-color);
  border-radius: 8px;
  box-shadow: var(--shadow-2);
  padding: 32px;
  margin-bottom: 32px;
}

.form-title {
  color: var(--primary-color);
  margin-bottom: 24px;
  font-size: 1.75rem;
  font-weight: 500;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.23);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: transparent;
  color: var(--text-primary);
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(98, 0, 238, 0.2);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(0, 0, 0, 0.38);
}

.input-error {
  border-color: var(--error-color) !important;
}

.error-text {
  color: var(--error-color);
  font-size: 0.75rem;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 16px;
}

.error-message {
  background-color: rgba(176, 0, 32, 0.08);
  color: var(--error-color);
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.success-message {
  background-color: rgba(76, 175, 80, 0.08);
  color: #2e7d32;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  text-align: center;
}

.success-message p {
  margin-bottom: 16px;
  font-weight: 500;
}

.image-preview {
  margin-top: 8px;
}

.image-preview h3 {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 8px;
  background-color: white;
}

@media (max-width: 600px) {
  .form-card {
    padding: 24px 16px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
