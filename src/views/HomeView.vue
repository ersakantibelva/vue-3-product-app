<template>
  <main>
    <h1 class="page-title">Products</h1>

    <div v-if="loading" class="loading">
      <p>Loading products...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>Error: {{ error }}</p>
    </div>

    <div v-else class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image">
          <img :src="product.image" :alt="product.title" />
        </div>
        <div class="product-content">
          <h2 class="product-title">{{ truncateText(product.title, 50) }}</h2>
          <p class="product-category">{{ product.category }}</p>
          <p class="product-description">
            {{ truncateText(product.description, 100) }}
          </p>
          <div class="product-details">
            <p class="product-price">${{ product.price.toFixed(2) }}</p>
            <div class="product-rating">
              <span class="rating-value">{{ product.rating.rate }}</span>
              <span class="rating-count">({{ product.rating.count }})</span>
            </div>
          </div>
          <div class="product-actions">
            <Button
              variant="secondary"
              @click="router.push(`/update/${product.id}`)"
              >Update</Button
            >
            <Button variant="outline" @click="handleDeleteProduct(product.id)"
              >Delete</Button
            >
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import Button from "@/components/Button.vue";

const router = useRouter();

const products = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    products.value = await response.json();
    loading.value = false;
  } catch (err) {
    error.value = err.message;
    loading.value = false;
  }
});

const truncateText = (text, length = 100) => {
  if (text.length <= length) {
    return text;
  }

  return text.substring(0, length) + "...";
};

const handleDeleteProduct = (id) => {
  products.value = products.value.filter((product) => product.id !== id);
};
</script>

<style lang="css" scoped>
.page-title {
  margin-bottom: 24px;
  font-size: 2rem;
  color: var(--primary-color);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.product-card {
  background-color: var(--surface-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  transform: translateY(0);
}

.product-card:hover {
  box-shadow: var(--shadow-4);
  transform: translateY(-5px);
}

.product-image {
  height: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 16px;
  transition: all 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-image img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.product-category {
  font-size: 0.875rem;
  color: var(--primary-color);
  text-transform: capitalize;
  margin-bottom: 8px;
  font-weight: 500;
}

.product-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
  flex-grow: 1;
}

.product-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-primary);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-value {
  background-color: var(--primary-color);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.product-actions {
  display: flex;
  gap: 8px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-actions {
  opacity: 1;
}

.rating-count {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.product-actions {
  display: flex;
  gap: 8px;
}

.loading,
.error {
  text-align: center;
  padding: 32px;
  font-size: 1.25rem;
  color: var(--text-secondary);
}

@media (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
