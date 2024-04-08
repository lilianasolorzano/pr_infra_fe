<template>
    <h1>agregar credencial</h1>
    <form action="">
        <!-- seleccionar id de usuario  -->
        <label for="userId">Seleccionar Usuario:</label>
        <select v-model="selectedUserName" id="user" @change="fillUserData">
            <option value="">Seleccione un usuario</option>
            <option v-for="datos in userListIAM" :key="datos.UserName" :value="datos.UserName">{{ datos.UserName }}
            </option>
        </select>


        <input-global v-if="selectedUserName" :user="registCredential.UserName" title="" type="" name="Id de usuario"
            id="UserName" v-model="registCredential.UserName"
            @update:value="newValue => updateI('UserName', newValue)" />
        <input-global title="" type="" name="Usuario IAM " id="UserId" v-model="registCredential.UserId"
            @update:value="newValue => updateI('UserId', newValue)" />
        <input-global title="" type="" name="Llave de acceso IAM" id="accessKeyId"
            v-model="registCredential.accessKeyId" @update:value="newValue => updateI('accessKeyId', newValue)" />
        <input-global title="" type="" name="Llave secreta" id="secretKey" v-model="registCredential.secretKey"
            @update:value="newValue => updateI('secretKey', newValue)" />
        <input-global title="" type="" name="Fecha de expiracion" id="ExpirationDate"
            v-model="registCredential.ExpirationDate" @update:value="newValue => updateI('ExpirationDate', newValue)" />
    </form>
</template>

<script setup lang="ts">
import { inputGlobal } from '../../importFile';
import { CredentRegistIAM } from '../../types';
import { ref, onMounted } from 'vue';
import * as API from 'aws-amplify/api';
import amplifyConfig from '../../ampliconfig';
import { Amplify } from 'aws-amplify';
import { usedataStore } from '../../store/datoUsuario';

Amplify.configure(amplifyConfig)
const dataStore = usedataStore()
const selectedUserName = ref<string>('');
const userListIAM = ref<CredentRegistIAM[]>([]);
const registCredential = ref<CredentRegistIAM>({
    UserId: '',
    UserName: '',
    accessKeyId: '',
    secretKey: '',
    ExpirationDate: ''
})

// llamar API 
async function fetchUsersData() {
    try {
        const getUserName = await API.get({
            apiName: 'access_API_IAM',
            path: `/dev/iam/findAll`,
            options: {
                body: "message"
            }
        });
        const { body } = await getUserName.response;
        const data = await body?.json();
        console.log('APPI', data);
        if (data !== null && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {

            userListIAM.value = data.data as unknown as CredentRegistIAM[];
            // dataStore.clearUserIds();
            userListIAM.value.forEach((IAMcredential) => {
                dataStore.registCredentialIAM(
                    IAMcredential.UserId as string,
                    IAMcredential.UserName as string,
                    IAMcredential.accessKeyId as string,
                    IAMcredential.secretKey as string,
                    IAMcredential.date as string
                )
            });
        } else {
            userListIAM.value = []
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
onMounted(() => {
    // fillUserData()
    fetchUsersData();
});


const updateI = (fielName: string, value: string) => {
    registCredential.value = { ...registCredential.value, [fielName]: value }
    console.log('datos agregados', registCredential.value)
}

// filtro de id de usuarios 
async function fillUserData() {
    // en user,userName se puede cambiar por el id solo hay que provarlo 
    const user = userListIAM.value.find(user => user.UserName === selectedUserName.value);
    if (user) {
        registCredential.value = { ...user };
    } else {
        // Limpiar datos del usuario si no se encontró el usuario seleccionado
        registCredential.value = {
            UserId: '',
            UserName: '',
            accessKeyId: '',
            secretKey: ''
        };
    }
}
</script>

<style scoped></style>