import { createRouter, createWebHistory } from 'vue-router'

import { setupRouterGuard } from './guard'

import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: HomeView,
      name: 'home',
      path: '/',
    },
    {
      component: () => import('@/views/GenerateView.vue'),
      name: 'generate',
      path: '/generate',
    },
  ],
})

setupRouterGuard(router)

export default router
