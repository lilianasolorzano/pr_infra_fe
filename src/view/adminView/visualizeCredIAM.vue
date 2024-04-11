<template>
    <h1>Editar Usuario IAM</h1>
    <global-btn btn_global="Agregar 2da credecial" @click="createdCredSecond()" />

    <!-- <v-btn color="primary" @click="showMenu = !showMenu">Mostrar</v-btn> -->
    <v-btn id="menu-activator" color="primary">Credenciales</v-btn>
    <v-menu activator="#menu-activator">
        <v-list>
            <v-list-item v-for="(secret, index) in dataStore.dataSecretIAM" :key="index" @click="toggleInfo">
                <v-list-item-title @click="toggleInfo; handleShow(secret.iam_access_key, index)">Mostrar Secret Key {{
                    index + 1
                    }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>



    <v-btn color="red" @click="handleDeleteSelectedKeys">Eliminar</v-btn>

    <v-btn color="yellow" btn_global="Rotar" class="RotDate" @click="handleRotate">Rotar</v-btn>
    <!-- <div class="datesdel" v-for="(secret, index) in dataStore.dataSecretIAM" :key="index">
    </div> -->

    <div class="datesdel" v-for="(secret, index) in dataStore.dataSecretIAM" :key="index">
        <v-btn :color="buttonColor(index)" v-show="activeIndex === index" class="ActDate"
            @click="ActDesctAccesKey(index)" :disabled="!secret.secret_access_key">{{ secret.status === 'Active' ?
                'Desactivar' : 'Activar' }}</v-btn>

    </div>

    <table class="style_table" id="tableIAM">
        <thead>
            <tr>
                <th></th>
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
            <td v-show="showMenu">AccessKey</td>
            <td v-show="showMenu">
                <tr class="datesdel" v-for="(secret, index) in dataStore.dataSecretIAM" :key="index">
                    <button rowspan="1" v-show="activeIndex === index">{{ secret.iam_access_key }}</button>
                </tr>
            </td>
            <tr>
                <td v-show="showMenu">SecretKey</td>
                <td>
            <tr v-show="showMenu" class="datesdel" v-for="(secret, index) in dataStore.dataSecretIAM" :key="index">
                <button rowspan="1" v-show="activeIndex === index">{{ secret.secret_access_key }}</button>

                <div class="container">
                    <div class="button_container">


                        <!-- <v-btn :id="`menu-activator-${index}`" color="red">Eliminar</v-btn> -->
                        <!-- <v-menu :activator="`#menu-activator-${index}`"> -->
                        <!-- <globalBtn v-show="activeIndex === index" btn_global="Eliminar" class="DelDate"
                            :disabled="!secret.secret_access_key" @click="handleDeleteAccess(secret.iam_access_key)" /> -->
                        <!-- </v-menu> -->

                        <!-- <globalBtn v-show="activeIndex === index" btn_global="Rotar" class="RotDate"
                            :disabled="!secret.secret_access_key"
                            @click="creatUserIAM(secret.iam_access_key, secret.iam_user_name)"
                            @submit.prevent="AddnewAccessIAM" /> -->
                        <!-- el boton actDes funciona al mismo tiempo para ambas accesKey hay que componerlo  -->
                        <!-- Botón para activar/desactivar -->
                        <!-- <div>
                            <button v-show="activeIndex === index" class="ActDate" @click="ActDesctAccesKey(index)"
                                :disabled="!secret.secret_access_key">
                                {{ secret.status === 'Active' ? 'Desactivar' : 'Activar' }}
                            </button>
                        </div> -->
                        <!-- <globalBtn class="showButton" btn_global="Mostrar" @click="toggleInfo" /> -->
                    </div>
                </div>
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
// const showInfo = ref(true);

const activeIndex = ref(-1);
const showMenu = ref(false);
const selectedKey = ref<string[]>([]);

function handleShow(accessKey: string | undefined, index: number) {
    // dataStore.reset()
    if (accessKey != undefined) {
        console.log('Mostrar', accessKey);
        activeIndex.value = index
        selectedKey.value.push(accessKey);
        showMenu.value = false;
    }
};
const toggleInfo = () => {
    showMenu.value = !showMenu.value;
};

function handleDeleteSelectedKeys() {
    console.log('Eliminar llaves seleccionadas:', selectedKey.value);

    selectedKey.value.forEach(accessKey => {
        handleDeleteAccess(accessKey);
    });
}

const handleRotate = () => {
    if (activeIndex.value !== -1) {
        const secret = dataStore.dataSecretIAM[activeIndex.value];
        creatUserIAM(secret.iam_access_key, secret.iam_user_name);
    }
};

const isActiveCredential = (index: number) => {
    if (activeIndex.value === index) {
        const secret = dataStore.dataSecretIAM[index];
        return secret.status === 'Active';
    }
    return false;
};

// Función para activar/desactivar la credencial seleccionada
// const handleToggleActivation = (index: number) => {
//     activeIndex.value = index;
// };

// // Texto del botón (Activar o Desactivar según el estado actual de la credencial)
// const buttonText = (index: number) => isActiveCredential(index) ? 'Desactivar' : 'Activar';

// Color del botón (verde si activo, amarillo si inactivo)
const buttonColor = (index: number) => isActiveCredential(index) ? 'warning' : 'success';


const props = defineProps(['UserName', 'emits']);// Usuario seleccionado para edición
console.log('props', props)


const userID = ref<IduserIAM>();
const storeSecret = ref<secretUserIAM[]>([{ iam_access_key: '', iam_user_name: '', status: '' }])

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
        // dataStore.clearUserIdIAM()
        const { body } = await getUser.response;
        const secret = await body?.json();
        console.log('constsecret', secret)

        if (body) {
            const data = await body.json() as { data?: void };

            console.log('APPI', data);
            userID.value = data.data as unknown as IduserIAM
            dataStore.reset()
            dataStore.userEditIAM(userID.value)

        } else {
            console.log('sin respuesta')
        }
        if (secret !== null && typeof secret === 'object' && 'secret' in secret && Array.isArray(secret.secret)) {
            storeSecret.value = secret.secret as unknown as secretUserIAM[]
            dataStore.reset()
            // dataStore.clearUserIdIAM()
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
// getLogin()

// eliminar 




async function handleDeleteAccess(iam_access_key?: string) {
    try {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar el accessKey?');


        if (confirmDelete) {
            // const secretUser = storeSecret.value.find((row) => row.iam_user_name !== row.iam_access_key)
            // console.log('deleteFInByid', secretUser)
            // const SecretIAMDel = secretUser?.iam_access_key

            const deleteSecretKey = await API.del({
                apiName: "access_API",
                // path: `/dev/iam/delete_credential/${props.UserName}/${SecretIAMDel}`,
                path: `/dev/iam/delete_credential/${props.UserName}/${iam_access_key}`,
            });

            console.log('restoperation', deleteSecretKey)
            await deleteSecretKey.response
            // dataStore.reset()
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
const creatUserIAM = async (iam_access_key?: string, iam_user_name?: string) => {
    try {
        // const secretUser = storeSecret.value.find((row) => row.iam_user_name !== row.iam_access_key)
        // const SecretIAMDel = secretUser?.iam_access_key
        // const secretIAMUser = secretUser?.iam_user_name

        await API.post({
            apiName: 'access_API',
            path: `/dev/iam/rotateCredential`,
            options: {
                body: {
                    // iam_access_key: SecretIAMDel as string,
                    // iam_user_name: secretIAMUser as string
                    iam_access_key: iam_access_key as string,
                    iam_user_name: iam_user_name as string
                }
            }

        });
        dataStore.clearUserIdDataIAM()
        // dataStore.reset()


        console.log('rotate call succeeded');
    } catch (error) {
        console.log('rotate call failed: ', error);

    } finally {

    }
}

//activar o desactivar access
// const status = ref(false)

const ActDesctAccesKey = async (index: number) => {

    // status.value = !status.value;

    const secret = storeSecret.value[index];

    secret.status = secret.status === 'Active' ? 'Inactive' : 'Active';

    try {

        // const secretUser = storeSecret.value.find((row) => row.iam_user_name !== row.iam_access_key)
        // console.log('secretUser', secretUser)

        // const SecretIAMstatus = secretUser
        // Envio de la solicitud POST para actualizar el accessKey
        await API.put({
            apiName: 'access_API',
            path: `/dev/iam/status_credential/${props.UserName}`,
            options: {
                body: {
                    // accessKeyId: SecretIAMstatus?.iam_access_key as string,
                    accessKeyId: secret.iam_access_key as string,
                    // status: SecretIAMstatus?.status as string (estado.value ? 'activo': 'desactivo'),
                    // status: status.value ? 'Active' : 'Inactive'
                    status: secret.status
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

const createdCredSecond = async () => {
    try {
        // const secretUser = storeSecret.value.find((row) => row.iam_user_name !== row.iam_access_key)
        // const SecretIAMDel = secretUser?.iam_access_key
        // const secretIAMUser = secretUser?.iam_user_name

        await API.put({
            apiName: 'access_API',
            path: `/dev/iam/createdCred/${props.UserName}`,
            options: {
                body: {
                    // iam_access_key: SecretIAMDel as string,
                    // iam_user_name: secretIAMUser as string
                    // iam_access_key: iam_access_key as string,
                    // iam_user_name: iam_user_name as string
                }
            }

        });
        dataStore.clearUserIdDataIAM()
        // dataStore.reset()


        console.log('rotate call succeeded');
    } catch (error) {
        console.log('rotate call failed: ', error);

    } finally {

    }
}


// function AddnewAccessIAM() {
//     dataStore.userEditIAM({
//         accessKeyId: userID.value?.accessKeyId,
//         Status: userID.value?.Status
//     })
// }

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
