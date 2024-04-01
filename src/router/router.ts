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
    meta: { requiresAuth: true, showNavbar: true },
    component: () => import('../view/home.vue'),
  },
  {
    path: '/users',
    name: 'usuarios',
    meta: { requiresAuth: true, showNavbar: true },
    component: () => import('../view/adminView/usuarios.vue')
  },
  {
    path: '/credentials',
    name: 'credentialsTableAdmin',
    meta: { requiresAuth: true, showNavbar: true },

    component: () => import('../view/adminView/credentialsTableAdmin.vue'),
  },
  {
    path: '/edit/:id',
    name: 'editar',
    meta: { requiresAuth: true, showNavbar: true },
    component: () => import('../components/editar.vue'),
    props: true
  },
  {
    path: '/agregar',
    name: 'addNewUser',
    meta: { requiresAuth: true, showNavbar: true },
    component: () => import('../view/adminView/addNewUser.vue'),
  },
  {
    path: '/agregarCredencial',
    name: 'credentialRegister',
    meta: { requiresAuth: true, showNavbar: true },
    component: () => import('../view/adminView/credentialRegister.vue')
  },
  {
    path: '/credentialCreate',
    name: 'credentialCreate',
    meta: { requiresAuth: true, showNavbar: true },
    component: () => import('../view/adminView/credentialsCreate.vue')
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
  console.log("Valor de la variable en router.ts", isLoggedInValue)
  if (to.meta.requiresAuth && !isLoggedInValue) {
    next({ name: 'Forbidden' });
  } else {
    next();
  }
});

export default router;




