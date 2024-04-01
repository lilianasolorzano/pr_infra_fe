import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import login from '../view/login.vue'
// import { createPinia } from 'pinia';
import { usedataStore } from '../store/datoUsuario';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    component: login,
    meta: { showNavbar: true },
  },
  {
    path: '/Home',
    name: 'home',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },
    component: () => import('../view/home.vue'),
  },
  {
    path: '/users',
    name: 'usuarios',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },
    component: () => import('../view/adminView/usuarios.vue')
  },
  {
    path: '/credentials',
    name: 'credentialsTableAdmin',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },

    component: () => import('../view/adminView/credentialsTableAdmin.vue'),
  },
  {
    path: '/edit/:id',
    name: 'editar',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },
    component: () => import('../components/editar.vue'),
    props: true
  },
  {
    path: '/agregar',
    name: 'addNewUser',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },
    component: () => import('../view/adminView/addNewUser.vue'),
  },
  {
    path: '/agregarCredencial',
    name: 'credentialRegister',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },
    component: () => import('../view/adminView/credentialRegister.vue')
  },
  {
    path: '/credentialCreate',
    name: 'credentialCreate',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },
    component: () => import('../view/adminView/credentialsCreate.vue')
  },
  {
    path: '/clientView',
    name: 'client',
    meta: { requiresUser: true, requiresAuth: true, showNavbar: true, role: 'INVITADO' },
    component: () => import('../view/clientView/credentialsClient.vue')
  },
  {
    path: '/:catchAll(.*)',
    // meta: { showNavbar: false },
    component: () => import('../components/error/error404.vue')
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('../components/error/error403.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {

  const dataStore = usedataStore();
  const isLoggedInValue = dataStore.isLoggedIn;
  const isRole = dataStore.role
  console.log("Valor de la variable en router.ts", isLoggedInValue)
  console.log("Valor de la variable en role", isRole)

  // if (to.meta.requiresAuth && !isLoggedInValue) {
  //   next({ name: 'Forbidden' });
  // } else if (to.meta.requiresAdmin && isRole !== 'ADMIN') {
  //   next({ name: 'Forbidden' });
  // } else if (to.meta.requiresUser && isRole !== 'INVITADO') {
  //   next({ name: 'Forbidden' });
  // } else {
  //   next()
  // }


  const isAuthorized =
    (!to.meta.requiresAuth || isLoggedInValue) &&
    (!to.meta.requiresAdmin || isRole === 'ADMIN') &&
    (!to.meta.requiresUser || isRole === 'INVITADO');

  // Redirige al usuario a la página Forbidden si no está autorizado
  isAuthorized ? next() : next({ name: 'Forbidden' });


});

export default router;




