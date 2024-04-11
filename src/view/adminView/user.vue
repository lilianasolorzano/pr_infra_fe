<template>
    <h1>Usuarios</h1>

    <input title="" name="user" :value="userID.user" />
    <input title="" name="email" :value="userID.email" />
    <input title="" name="role" :value="userID.role" />
    <!-- <input-global title="" name="user" :value="userID.user" @update:value="newValue => updateI('user', newValue)" />
    <input-global title="" name="email" :value="userID.email" @update:value="newValue => updateI('email', newValue)" />
    <input-global title="" name="role" :value="userID.role" @update:value="newValue => updateI('role', newValue)" /> -->
    <div>
        <global-btn btn_global="actualizar" type="submit" />
    </div>

</template>

<script setup lang="ts">
import { usedataStore } from '../../store/datoUsuario';
import * as  API from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import amplifyConfig from '../../ampliconfig';
import { IdUsuario } from '../../types/index';
import { onMounted, ref } from 'vue';
import { globalBtn } from '../../importFile';
import router from '../../router/router';

const dataStore = usedataStore()

const props = defineProps(['id']);// Usuario seleccionado para edición
const userID = ref<IdUsuario>({ id: '', user: '', email: '', role: '' });

Amplify.configure(amplifyConfig);

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



router.push('/Users')



</script>

<style scoped></style>