<template>
    <h1>editar usuario normal</h1>
    <input title="" name="user" :value="userID.user" />
    <input title="" name="email" :value="userID.email" />
    <input title="" name="role" :value="userID.role" />
    <!-- <input-global title="" name="user" :value="userID.user" @update:value="newValue => updateI('user', newValue)" />
    <input-global title="" name="email" :value="userID.email" @update:value="newValue => updateI('email', newValue)" />
    <input-global title="" name="role" :value="userID.role" @update:value="newValue => updateI('role', newValue)" /> -->
    <div>
        <global-btn btn_global="actualizar" type="submit" @click="addEdit" />
    </div>

</template>

<script setup lang="ts">
import { usedataStore } from '../store/datoUsuario';
import * as  API from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import * as amplifyconfig from '../amplifyconfiguration.json';
import { IdUsuario } from '../types/index';
import { onMounted, ref } from 'vue';
import { inputGlobal } from '../importFile';
import { globalBtn } from '../importFile';
import router from '../router/router';

const dataStore = usedataStore()

const props = defineProps(['id']);// Usuario seleccionado para edición
const userID = ref<IdUsuario>({ id: '', user: '', email: '', role: '' });

Amplify.configure(amplifyconfig);

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
            // propsUsers.value.forEach((UserEdit) => {
            //     dataStore.user(
            //         UserEdit.id as (string),
            //         UserEdit.user as (string),
            //         UserEdit.email as (string),
            //         UserEdit.role as (string))
            // })
        } else {
            console.log('sin respuesta')
        }
        console.log('dataStore', dataStore.userGet.length)

        // if (data !== null && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        //     userID.value = data.data as unknown as IdUsuario[];
        //     dataStore.clearUserIds();
        // propsUsers.value.forEach((userss) => {
        //     dataStore.userEdit(
        //         userss.email as (string),
        //         userss.id as (string),
        //         userss.role as (string),
        //         userss.user as (string)
        //     )

        // });
        //     console.log('datastore', dataStore.user.length)
        // } else {
        //     propsUsers.value = []
        // }
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
                body: userID.value

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