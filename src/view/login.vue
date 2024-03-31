<template>
    <h1>Inicio de Sesion</h1>
    <form @submit.prevent="handleLogin">
        <input-global title="" name="Nombre de usuario" v-model="loginDetails.user"
            @update:value="newValue => updateI('user', newValue)" />
        <input-global title="" name="password" v-model="loginDetails.password"
            @update:value="newValue => updateI('password', newValue)" />
        <div>
            <global-btn type="submit" btn_global="Iniciar sesion" />
        </div>
        <p v-if="errorMessages">{{ errorMessages }}</p>
    </form>
</template>

<script setup lang="ts">
import { inputGlobal } from '../importFile';
import { globalBtn } from '../importFile';
import * as bcrypt from 'bcryptjs'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// import { usedataStore } from '../store/datoUsuario';
import { inicioSesion } from '../types';
import * as API from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import * as amplifyconfig from '../amplifyconfiguration.json'

// import { required, email } from 'vuelidate/lib/validators';

// const validations = {
//     nombre: { required },
//     email: { required, email },
//     password: { required }
// };
Amplify.configure(amplifyconfig)
// let ResultBody: inicioSesion | null = null
// const dataStore = usedataStore()
const loginDetails = ref<inicioSesion>({
    user: '',
    password: '',
})
// validar los roles de usuarios 
// const iniciarSesion = () => {
//     dataStore.$patch('iniciarSesion', loginDetails);
// };
const errorMessages = ref('')

const router = useRouter()

// const usuarioAutenticado = ref()

const handleLogin = async () => {
    const hashedPassword = bcrypt.hashSync('password', 10)
    console.log('hashedpassword', hashedPassword)
    const passwordMatch = bcrypt.compareSync(loginDetails.value.password, hashedPassword)
    console.log('passwordMatch', passwordMatch)


    const authenticated = false
    console.log('tratando de enviar a otra pagina', authenticated)

    try {

        const respose = await API.post({
            apiName: 'access_API',
            path: '/dev/users/auth',
            options: {
                body: loginDetails.value
            }
        });
        const responsData = await respose.response
        if (responsData.statusCode === 200) {
            await responsData.body.json();
            await router.push('/Home')
            // return ResultBody
            return true

        }

    } catch (errorMessages) {
        errorMessages = 'Nombre del usuario y/o contraseña incorrecta';
        alert(errorMessages)

    }
};

// function obtenerUsuarioAutenticado(): inicioSesion | null {
//     return loginDetails.value; // Devuelve la información del usuario autenticado o null si no hay sesión activa
// }

const updateI = (fielName: string, value: string) => {
    loginDetails.value = { ...loginDetails.value, [fielName]: value }
    console.log('datos agregados', loginDetails.value)
}


// onMounted(async () => {
//     try {
//         const usuario = await handleLogin()
//         usuarioAutenticado.value = usuario
//     } catch {

//     }
// })

// export { usuarioAutenticado }

</script>

<style scoped></style>