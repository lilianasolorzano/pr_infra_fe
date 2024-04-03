<template>
  <H1>Usuarios</H1>
  <router-link to="/agregar">
    <global-btn btn_global="Agregar usuario" buttonClass="" />
  </router-link>
  <div>
    <tablegbl :columns="columns" :data="dataTable" :showButtonEditar="true" :showButtonEliminar="true"
      :showButtonVisualize="true" @deleteUser="handleDeleteJSON" @editUser="handleEdit"
      @visualizeUser="handleVisualize" />
  </div>
</template>


<script setup lang="ts">
import { tablegbl } from '../../importFile';
import { globalBtn } from '../../importFile';
import { Amplify } from 'aws-amplify';
import * as  API from 'aws-amplify/api';
// import * as amplifyconfig from '../../amplifyconfiguration.json';
import amplifyConfig from '../../ampliconfig'
import { IdUsuario } from '../../types/index';
import { computed, onMounted, ref } from 'vue';
import { usedataStore } from '../../store/datoUsuario';
import router from '../../router/router';


// const amplifyConfig = {
//   aws_project_region: "us-east-1",
//   aws_cloud_logic_custom: [
//     {
//       name: "access_API",
//       endpoint: import.meta.env.VITE_ENDPOINT,
//       region: "us-east-1"
//     }
//   ]
// };


Amplify.configure(amplifyConfig);
const dataStore = usedataStore()

const idUsers = ref<IdUsuario[]>([])
// llamar la API   
async function getUsers() {
  try {
    const getUserTable = await API.get({
      apiName: 'access_API',
      path: `/dev/users/findAll`,
      options: {
        body: { menssage: 'ingresado' }
      }
    });
    const { body } = await getUserTable.response;
    const data = await body?.json();
    console.log('appi', data);

    if (data !== null && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      idUsers.value = data.data as unknown as IdUsuario[];
      dataStore.clearUserIds();

      idUsers.value.forEach((dataStoreJson) => {
        dataStore.userJson(
          dataStoreJson.id as (string),
          dataStoreJson.user as (string),
          dataStoreJson.email as (string),
          dataStoreJson.password as (string),
          dataStoreJson.role as (string),
        )

      });
    } else {
      idUsers.value = []
    }
  } catch (error) {
    console.log('sin obtener datos', error);
    console.log('sin obtener datos')

  } finally {

  }
};
onMounted(getUsers);
// dataStore.clearUserIds()

const columns = [
  { label: 'Id', key: 'id' },
  { label: 'Usuario', key: 'user' },
  { label: 'Correo', key: 'email' },
  { label: 'Rol', key: 'role' },
];

const dataTable = computed(() => dataStore.dataUsers);


// editar usuario 
const handleEdit = (Idusers: string) => {
  const user = idUsers.value.find(user => user.id === Idusers)

  if (Idusers) {
    router.push({
      name: 'editar',
      params: {
        id: user?.id
      }
    })

  } else {
    console.error('Usuario no encontrado');
  }

}


const handleVisualize = () => {
  console.log('Otra acción');
};


async function handleDeleteJSON(Idusers: string | number) {
  try {
    const restOperation = await API.del({
      apiName: "access_API",
      path: `/dev/users/delete/${Idusers}`,
    });
    await restOperation.response

    idUsers.value = idUsers.value.filter((row) => row.id !== Idusers)
    dataStore.clearUserIds();

    idUsers.value.forEach((getUser) => {
      dataStore.userGet(
        getUser.id as string,
        getUser.user as string,
        getUser.email as string,
        getUser.password as string,
        getUser.role as string,
      )

    })
    console.log('user deleted successfully:', Idusers);
  } catch (error) {
    console.log('delete call failed: ', error);
  }
};

</script>