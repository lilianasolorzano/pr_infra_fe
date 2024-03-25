import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import login from '../view/login.vue'

const routes: RouteRecordRaw[] = [
    {
        path:'/',
        name: 'login',
        component: login,
    },
    {
        path:'/Home',
        name:'home',
        component: () => import('../view/home.vue'),
    },
    {
        path:'/Users',
        name:'usuarios',
        component: () => import('../view/adminView/usuarios.vue'),
      
    },
    {
        path:'/Credentials',
        name:'credentialsTableAdmin',
        component: () => import('../view/adminView/credentialsTableAdmin.vue'),
    },
    {
        path:'/edit/:id',
        name:'editar',
        component: () => import('../components/editar.vue'),
        props: true
    }
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;




