<template>
  <button @click="emit('click')" class="btn" :class="variant">
    <slot />
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
});

const emit = defineEmits(["click"]);
</script>

<style lang="css" scoped>
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.0125em;
}

.btn:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

.btn:hover:after {
  animation: ripple 0.6s ease-out;
}

.primary {
  background-color: var(--primary-color);
  color: white;
}

.primary:hover {
  background-color: var(--primary-dark);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.primary:disabled {
  background-color: rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.38);
  cursor: not-allowed;
  box-shadow: none;
}

.secondary {
  background-color: var(--secondary-color);
  color: white;
}

.secondary:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.outline {
  background-color: transparent;
  color: var(--error-color);
  border: 1px solid var(--error-color);
}

.outline:hover {
  background-color: rgba(176, 0, 32, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
