<template>
    <h1>Creacion de credencial IAM que no sirve este componente</h1>
    <form v-bind="AddnewUserIAM">
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
import amplifyConfig from '../../ampliconfig';
import { usedataStore } from '../../store/datoUsuario';

Amplify.configure(amplifyConfig)
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
function AddnewUserIAM(newuseriam: { UserId: string, UserName: string, accessKeyId: string, secretKey: string, date: string }) {
    dataStore.saveDataIAM(
        newuseriam.UserId,
        newuseriam.UserName,
        newuseriam.accessKeyId,
        newuseriam.secretKey,
        newuseriam.date,
    )

}

</script>

<style scoped></style>