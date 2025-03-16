<template>
  <header class="app-header">
    <div class="navbar">
      <div class="navbar-logo">
        <h1>Product App</h1>
      </div>
      <nav class="navbar-links">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/create" class="nav-link">Create</RouterLink>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <RouterView />
  </main>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
