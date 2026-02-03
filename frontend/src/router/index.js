import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/operadoras',
    name: 'Operadoras',
    component: () => import('@/views/OperadorasView.vue'),
    children: [
      {
        path: ':cnpj',
        name: 'OperadoraDetalhe',
        component: () => import('@/components/OperadoraDetalhe.vue'),
        props: true
      }
    ]
  },
  {
    path: '/estatisticas',
    name: 'Estatísticas',
    component: () => import('@/views/Estatisticas.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
