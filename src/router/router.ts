import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import login from '../view/login.vue'

// const { handleLogin } = login

const routes: RouteRecordRaw[] = [
    {
        path:'/',
        name: 'login',
        component: login,
    },
    {
        path:'/users',
        name: 'usuarios',
        meta: { requiresAdmin: true },
        component: () => import('../view/adminView/usuarios.vue')
    },
    {
        path:'/credentials',
        name: 'credentialsTableAdmin',
        meta: { requiresAdmin: true },
        
        component: () => import('../view/adminView/credentialsTableAdmin.vue'),
    },
    {
        path:'/edit/:id',
        name:'editar',
        meta: { requiresAdmin: true },
        component: () => import('../components/editar.vue'),
        props: true
    },
     {
        path:'/agregar',
        name:'addNewUser',
        meta: { requiresAdmin: true },
        component: () => import('../view/adminView/addNewUser.vue'),
    },
    {
        path: '/agregarCredencial',
        name: 'credentialRegister',
        meta: { requiresAdmin: true },
        component: () => import ('../view/adminView/credentialRegister.vue')
    },
    {
        path: '/credentialCreate',
        name: 'credentialCreate',
        meta: { requiresAdmin: true },
        component: () => import ('../view/adminView/credentialsCreate.vue')
    },
    {
        path: '/VisualizeIAM/:UserName',
        name: 'visualizeCredIAM',
        meta: { requiresAdmin: true },
        component: () => import('../view/adminView/visualizeCredIAM.vue'),
        props: true
    },
    {
        path: '/componentePadre/:UserName',
        name: 'componentePadre',
        meta: { requiresAdmin: true },
        component: () => import('../components/pruebadealgo/componentePadre.vue'),
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


// router.beforeEach(async (to, from, next) => {
//   if (to.meta.requiresAdmin) {
//     try {
//       const usuarioAutenticado = await handleLogin(); // Llama a handleLogin para obtener la información de autenticación
//       if (usuarioAutenticado) {
//         next(); // Permite el acceso a la ruta si el usuario está autenticado
//       } else {
//         next('/'); // Redirige al usuario a la página de inicio de sesión si no está autenticado
//       }
//     } catch (error) {
//       console.error('Error al verificar la autenticación:', error);
//       next('/'); // En caso de error, redirige al usuario a la página de inicio de sesión
//     }
//   } else {
//     next(); // Permite el acceso a rutas que no requieren autenticación
//   }
// });

export default router;




