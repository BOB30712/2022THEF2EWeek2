import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'PdfView',
    component: () => import('../views/PdfView.vue')
  },
  {
    path: '/PdfView2',
    name: 'PdfView2',
    component: () => import('../views/PdfView2.vue')
  },
  {
    path: '/DrawView',
    name: 'DrawView',
    component: () => import('../views/DrawView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
