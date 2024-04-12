<template>
    <h1>editar usuario normal</h1>
    <div class="form-container">
        <form>
            <div>
                <input-global title="" name="user" :value="userID.user"
                    @update:value="newValue => updateI('user', newValue)" />
                <input-global title="" name="email" :value="userID.email"
                    @update:value="newValue => updateI('email', newValue)" />
                <input-global title="" name="Agregar nueva contraseña" :type="showPassword ? 'text' : 'password'"
                    @update:value="newValue => updateI('password', newValue)">
                </input-global>
                <v-icon @click="toggleShowPassword">{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                <div>
                    <v-select title="" id="UserRol" :items="['admin', 'invitado']" v-model="selectedOption"
                        style="width: 650px;" />
                </div>

                <div>
                    <global-btn btn_global="actualizar" type="submit" @click="addEdit" />
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { usedataStore } from '../store/datoUsuario';
import * as  API from 'aws-amplify/api';
import amplifyConfig from '../ampliconfig';
import { Amplify } from 'aws-amplify';
import { IdUsuario } from '../types/index';
import { onMounted, ref } from 'vue';
import { inputGlobal } from '../importFile';
import { globalBtn } from '../importFile';
import router from '../router/router';

const dataStore = usedataStore()
Amplify.configure(amplifyConfig);


const showPassword = ref(false); // Estado para controlar la visibilidad de la contraseña

// Función para alternar la visibilidad de la contraseña
const toggleShowPassword = () => {
    showPassword.value = !showPassword.value;
};





const props = defineProps(['id']);// Usuario seleccionado para edición
const userID = ref<IdUsuario>({ id: '', user: '', email: '', role: '', password: '' });
const selectedOption = ref('select...');


async function getLogin() {
    try {
        const getUser = await API.get({
            apiName: 'access_API',
            path: `/dev/users/findById/${props.id}`,
            options: {
                body: {
                    message: 'data'
                }
            }
        });
        console.log('dato', getUser)
        const { body } = await getUser.response;
        if (body) {
            const data = await body.json() as { data?: void };
            console.log('APPI', data);
            userID.value = data.data as unknown as IdUsuario
            console.log('idusers', userID.value)
            dataStore.userEdit(userID.value)
        } else {
            console.log('sin respuesta')
        }
        console.log('dataStore', dataStore.userGet.length)
    } catch (error) {
        console.log('sin obtener datos', error);
        console.log('sin obtener datos')

    } finally {

    }
};
onMounted(getLogin)

const saveJSON = async () => {
    try {
        const restOperation = API.put({
            apiName: "access_API",
            path: `/dev/users/update/${props.id}`,
            options: {
                body: {
                    user: userID.value.user as string,
                    email: userID.value.email as string,
                    role: selectedOption.value
                }


            }
        });
        const response = await restOperation.response;
        console.log('PUT call succeeded: ', response);
    } catch (error) {
        console.log('PUT call failed: ', error);
    }
};

const updateI = (fielName: string, value: string) => {
    userID.value = { ...userID.value, [fielName]: value }
    console.log('datos agregados', userID.value)
}

const addEdit = async (fielName: string, value: string) => {
    updateI(fielName, value)
    await saveJSON()
    router.push('/Users')
}

</script>

<style scoped>
form {
    border-radius: 13px;
    width: 65%;
    height: auto;
    padding: 20px;
    margin: 15px;
    position: center;
    background-color: white;
    box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.2);
    text-transform: none;
    /* font-family: Arial; */
}

form:hover {
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.9);
}

.form-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    /* height: 100vh; */
    /* Ajusta la altura del formulario al tamaño de la pantalla */
}
</style>