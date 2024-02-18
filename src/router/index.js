// src/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Finance from '@/modules/editor-finance/components/Tabs.vue'
import FinanceSumMonth from '@/modules/editor-finance/components/FinanceSumMonth.vue'
import Login from '@/views/Login.vue'
import Error404 from '@/views/404.vue'

export const Routes = { LOGIN: '/Login' }

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: Routes.LOGIN,
    name: 'Login',
    component: Login,
  },
  {
    path: '/Finance',
    name: 'Finance',
    component: Finance,
  },
  {
    path: '/FinanceSumMonth',
    name: 'FinanceSumMonth',
    component: FinanceSumMonth,
  },
  {
    path: '/:catchAll(.*)',
    name: 'Error404',
    component: Error404,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
