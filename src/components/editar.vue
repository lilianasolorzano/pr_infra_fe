<template>
    <h1>editar usuario normal</h1>
    <input-global title="" name="user" :value="userID.user" @update:value="newValue => updateI('user', newValue)" />
    <input-global title="" name="email" :value="userID.email" @update:value="newValue => updateI('email', newValue)" />
    <div>
        <v-select title="" id="UserRol" :items="['admin', 'invitado']" v-model="selectedOption" />
    </div>

    <div>
        <global-btn btn_global="actualizar" type="submit" @click="addEdit" />
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

const props = defineProps(['id']);// Usuario seleccionado para edición
const userID = ref<IdUsuario>({ id: '', user: '', email: '' });
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

<style scoped></style>