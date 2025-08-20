const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true, perm: 'Dashboard' } },
      // { path: '/usuarios', component: () => import('pages/usuarios/Usuarios.vue'), meta: { requiresAuth: true, perm: 'Usuarios' } },
      { path: '/configuraciones', component: () => import('pages/configuracion/Configuracion.vue'), meta: { requiresAuth: true, perm: 'Produccion primaria' } },
      // finanzas
      { path: '/finanzas', component: () => import('pages/finanzas/Finanzas.vue'), meta: { requiresAuth: true, perm: 'Finanzas' } },
    ]
  },
  { path: '/login', component: () => import('layouts/Login.vue') },
  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') }
]
export default routes
