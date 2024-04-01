import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import login from '../view/login.vue'
// import { createPinia } from 'pinia';
import { usedataStore } from '../store/datoUsuario';

// createPinia();
// import { isLoggedIn } from '../view/login.vue'

// const { handleLogin } = login

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'login',
        component: login,
    },
    {
        path: '/Home',
        name: 'home',
        meta: { requiresAuth: true },
        component: () => import('../view/home.vue'),
    },
    {
        path: '/users',
        name: 'usuarios',
        meta: { requiresAuth: true },
        component: () => import('../view/adminView/usuarios.vue')
    },
    {
        path: '/credentials',
        name: 'credentialsTableAdmin',
        meta: { requiresAuth: true },

        component: () => import('../view/adminView/credentialsTableAdmin.vue'),
    },
    {
        path: '/edit/:id',
        name: 'editar',
        meta: { requiresAuth: true },
        component: () => import('../components/editar.vue'),
        props: true
    },
    {
        path: '/agregar',
        name: 'addNewUser',
        meta: { requiresAuth: true },
        component: () => import('../view/adminView/addNewUser.vue'),
    },
    {
        path: '/agregarCredencial',
        name: 'credentialRegister',
        meta: { requiresAuth: true },
        component: () => import('../view/adminView/credentialRegister.vue')
    },
    {
        path: '/credentialCreate',
        name: 'credentialCreate',
        meta: { requiresAuth: true },
        component: () => import('../view/adminView/credentialsCreate.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {

    const dataStore = usedataStore();

    // const isLoggedInValue = false; // Aquí debes implementar la lógica para verificar si el usuario está autenticado
    const isLoggedInValue = dataStore.isLoggedIn;
    localStorage.setItem('isLoggedInValue', JSON.stringify(isLoggedInValue));
    console.log("Valor de la variable en router.ts", isLoggedInValue)
    // Verificar si la ruta requiere autenticación y el usuario no está autenticado
    if (to.meta.requiresAuth && !isLoggedInValue) {
        // Redirigir al usuario a la página de inicio de sesión
        next({ name: 'login' });
    } else {
        next();
        // Permitir el acceso a la ruta
    }
});

export default router;




