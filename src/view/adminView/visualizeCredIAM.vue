<template>
    <h1>Editar Usuario IAM</h1>
    <global-btn btn_global="Agregar 2da credecial" />
    <table class="style_table" id="tableIAM">
        <thead>
            <tr>
                <th></th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <!-- Datos de usuario -->
            <tr>
                <td>UserId</td>
                <td>{{ userID?.UserId }}</td>
            </tr>
            <tr>
                <td>UserName</td>
                <td>{{ userID?.UserName }}</td>
            </tr>
            <tr>
                <td>CreateDate</td>
                <td>{{ userID?.CreateDate }}</td>
            </tr>
            <!-- Datos secretIAM -->
            <tr>
                <td>name</td>
                <td>

            <tr v-for="(secret, index) in dataStore.dataSecretIAM" :key="index">
                <button rowspan="1" v-show="showInfo">{{ secret.iam_access_key }}</button>
                <globalBtn btn_global="Eliminar" @click="handleDeleteAccess" />

                <globalBtn btn_global="Rotar" @click="creatUserIAM" @submit.prevent="AddnewAccessIAM" />
                <!-- el boton actDes funciona al mismo tiempo para ambas accesKey hay que componerlo  -->
                <div>
                    <!-- Botón para activar/desactivar -->
                    <button @click="ActDesctAccesKey">{{ status ? 'Desactivar' : 'Activar' }}</button>
                </div>

                <globalBtn btn_global="Mostrar" @click="toggleInfo" />
            </tr>

            </td>
            </tr>

        </tbody>
    </table>

</template>

<script setup lang="ts">
import { usedataStore } from '../../store/datoUsuario';
import * as  API from 'aws-amplify/api';
import amplifyConfig from '../../ampliconfig';
import { Amplify } from 'aws-amplify';
import { onMounted, ref } from 'vue';
import { globalBtn } from '../../importFile';
import { IduserIAM, secretUserIAM } from '../../types/index';


Amplify.configure(amplifyConfig);


const dataStore = usedataStore()
const showInfo = ref(true);



const props = defineProps(['UserName', 'emits']);// Usuario seleccionado para edición
console.log('props', props)


const userID = ref<IduserIAM>();
const storeSecret = ref<secretUserIAM[]>([{ iam_access_key: '', iam_user_name: '', status: '' }])
// const Desc = ref<secretUserIAM[]>([{ status: '' }])


// const secretUser = storeSecret.value.find((row) => row.iam_user_name !== row.iam_access_key)
// console.log('deleteFInByid', secretUser)


// se usa en delete 
const secretIAM = ref<secretUserIAM[]>([]);


console.log('secretIAM', secretIAM)


async function getLogin() {
    try {
        const getUser = await API.get({
            apiName: 'access_API',
            path: `/dev/iam/findById/${props.UserName}`,
            options: {
                body: {
                    message: 'data'
                }
            }
        });
        const { body } = await getUser.response;
        const secret = await body?.json();
        console.log('constsecret', secret)

        if (body) {
            const data = await body.json() as { data?: void };

            console.log('APPI', data);
            userID.value = data.data as unknown as IduserIAM
            dataStore.userEditIAM(userID.value)

        } else {
            console.log('sin respuesta')
        }
        if (secret !== null && typeof secret === 'object' && 'secret' in secret && Array.isArray(secret.secret)) {
            storeSecret.value = secret.secret as unknown as secretUserIAM[]
            storeSecret.value.forEach((secretDate) => {
                dataStore.userSecretIA(
                    secretDate.iam_access_key as string,
                    secretDate.iam_user_name as string,
                    secretDate.secret_access_key as string,
                    secretDate.status as string
                )


            })
        }
        console.log('dataStore', storeSecret)


    } catch (error) {
        console.log('sin obtener datos', error);
        console.log('sin obtener datos')

    } finally {

    }
};
onMounted(getLogin)

// eliminar 
async function handleDeleteAccess() {
    try {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar el accessKey?');


        if (confirmDelete) {
            const secretUser = storeSecret.value.find((row) => row.iam_user_name !== row.iam_access_key)
            console.log('deleteFInByid', secretUser)
            const SecretIAMVi = secretUser?.iam_access_key

            const deleteSecretKey = await API.del({
                apiName: "access_API",
                path: `/dev/iam/delete_credential/${props.UserName}/${SecretIAMVi}`,
            });

            console.log('restoperation', deleteSecretKey)
            await deleteSecretKey.response

            secretIAM.value.forEach((delSecret) => {
                dataStore.deleteAccessKey(
                    delSecret.iam_user_name as string,
                    delSecret.iam_access_key as string
                )

            })
        } else {
            console.log('Eliminación cancelada');
        }
        console.log('user deleted successfully:', userID);
    } catch (error) {
        console.log('delete call failed: ', error);
    }
};

// rotar acces_key
const creatUserIAM = async () => {
    try {
        const secretUser = storeSecret.value.find((row) => row.iam_user_name !== row.iam_access_key)
        const SecretIAMDel = secretUser?.iam_access_key
        const secretIAMUser = secretUser?.iam_user_name

        await API.post({
            apiName: 'access_API',
            path: `/dev/iam/rotateCredential`,
            options: {
                body: {
                    iam_access_key: SecretIAMDel as string,
                    iam_user_name: secretIAMUser as string
                }
            }

        });
        console.log('rotate call succeeded');
    } catch (error) {
        console.log('rotate call failed: ', error);

    } finally {

    }
}

//activar o desactivar access
const status = ref(false)

const ActDesctAccesKey = async () => {
    status.value = !status.value;

    try {

        const secretUser = storeSecret.value.find((row) => row.iam_user_name !== row.iam_access_key)
        console.log('secretUser', secretUser)

        const SecretIAMstatus = secretUser
        // Envio de la solicitud POST para actualizar el accessKey
        await API.put({
            apiName: 'access_API',
            path: `/dev/iam/status_credential/${props.UserName}`,
            options: {
                body: {
                    accessKeyId: SecretIAMstatus?.iam_access_key as string,
                    // status: SecretIAMstatus?.status as string (estado.value ? 'activo': 'desactivo'),
                    status: status.value ? 'Active' : 'Inactive'
                }
                // body: JSON.stringify({
                //     accessKeyId: SecretIAMstatus?.iam_access_key as string,
                //     status: SecretIAMstatus?.status as string,
                //     // isActive: status

                // })

            }

        });

    } catch (error) {
        console.log('credential call failed: ', error);
    } finally {
        // Lógica adicional después de la actualización
    }
}

function AddnewAccessIAM() {
    dataStore.userEditIAM({
        accessKeyId: userID.value?.accessKeyId,
        Status: userID.value?.Status
    })
}



</script>
<style scoped>
.style_table {
    width: 100%;
    border-collapse: collapse;
}

.style_table th,
.style_table td {
    border: 1px solid #ddd;
    padding: 8px;
}

.style_table th {
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: left;
}

.style_table td div {
    margin-bottom: 5px;
}
</style>
