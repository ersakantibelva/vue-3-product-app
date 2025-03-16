import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/create',
      name: 'Create',
      component: () => import('../views/FormView.vue'),
    },
    {
      path: '/update/:id',
      name: 'Update',
      component: () => import('../views/FormView.vue'),
    },
  ],
})

export default router
