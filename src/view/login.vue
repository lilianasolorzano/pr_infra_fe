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
import { inicioSesion, UserData } from '../types';
import * as API from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import * as amplifyconfig from '../amplifyconfiguration.json'
import { usedataStore } from '../store/datoUsuario';

Amplify.configure(amplifyconfig)
const dataStore = usedataStore()

const loginDetails = ref<inicioSesion>({
    user: '',
    password: '',
})

const errorMessages = ref('')

const router = useRouter()

const handleLogin = async () => {
    const hashedPassword = bcrypt.hashSync('password', 10)
    console.log('hashedpassword', hashedPassword)
    const passwordMatch = bcrypt.compareSync(loginDetails.value.password, hashedPassword)
    console.log('passwordMatch', passwordMatch)

    const authenticated = false
    console.log('tratando de enviar a otra pagina', authenticated)

    let data: UserData | null = null;

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
            const jsonData = await responsData.body.json();
            if (typeof jsonData === 'object' && jsonData !== null) {
                data = jsonData as unknown as UserData;
                const role = data?.data?.userDTO?.role

                dataStore.setLoggedIn(role)
                console.log("auth, login", role)

                const roleRoutes = {
                    'ADMIN': '/Home',
                    'INVITADO': '/clientView'
                };

                const route = roleRoutes[role as keyof typeof roleRoutes];
                if (route) {
                    await router.push(route);
                    return true;
                } else {
                    console.error('Rol desconocido:', role);
                    await router.push('/');
                    return false;
                }
            } else {
                console.error('Los datos no son un objeto JSON válido:', jsonData);
            }


        } else {
            return false
        }

    } catch (errorMessages) {
        errorMessages = 'Nombre del usuario y/o contraseña incorrecta';
        alert(errorMessages)

    }
};

const updateI = (fielName: string, value: string) => {
    loginDetails.value = { ...loginDetails.value, [fielName]: value }
    console.log('datos agregados', loginDetails.value)
}

</script>

<style scoped></style>