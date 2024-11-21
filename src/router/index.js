import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/renderBypdf.vue')
  },
  {
    path: '/pdf',
    name: 'pdf',
    component: () => import('../views/renderByimage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
