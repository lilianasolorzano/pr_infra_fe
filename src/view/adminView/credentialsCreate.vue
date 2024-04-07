<template>
    <h1>Creacion de usuario IAM</h1>
    <form @submit.prevent="AddnewUserIAM">
        <input-global title="" name="Id de usuario" type="text" v-model="creatIAM.UserId"
            @update:value="newValue => listenUserIAM('UserId', newValue)" />
        <input-global title="" name="Usuario IAM" type="text" v-model="creatIAM.UserName"
            @update:value="newValue => listenUserIAM('userName', newValue)" />
        <input-global title="" name="Fecha de expiracion" type="date" v-model="creatIAM.ExpirationDate"
            @update:value="newValue => listenUserIAM('ExpirationDate', newValue)" />
        <div>
            <global-btn btn_global="Guardar" @click="creatUserIAM" />
        </div>
    </form>
</template>

<script setup lang="ts">
import { inputGlobal } from '../../importFile';
import { globalBtn } from '../../importFile';
import { ref } from 'vue'
import { CredentRegistIAM } from '../../types';
import { Amplify } from 'aws-amplify';
import * as API from 'aws-amplify/api';
import * as amplifyconfig from '../../amplifyconfiguration.json';
import { usedataStore } from '../../store/datoUsuario';

Amplify.configure(amplifyconfig)
const dataStore = usedataStore()

const creatIAM = ref<CredentRegistIAM>({
    UserName: '',
})

const creatUserIAM = async () => {
    try {
        // console.log('estado:hasta la chingada',usuarioEditado.value.user)
        await API.post({
            apiName: 'access_API',
            path: `/dev/iam/create`,
            options: {
                body: creatIAM.value
            }
        });
        console.log('create call succeeded');
    } catch (error) {
        console.log('create call failed: ', error);

    } finally {

    }
}
const listenUserIAM = (fielName: string, value: string) => {
    creatIAM.value = { ...creatIAM.value, [fielName]: value }
    console.log(creatIAM.value)
}
function AddnewUserIAM() {
    dataStore.saveDataIAM({
        userName: creatIAM.value.UserName
    })
}

</script>

<style scoped></style>