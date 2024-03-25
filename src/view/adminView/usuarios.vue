<template>
    <H1>Esta vista es de usuario normal, los datos vendrian de la base de datos</H1>
    <global-btn btn_global="Agregar usuario" buttonClass=""/>
    <div>
      <!-- <tablegbl :columns="columns" :data="dataTable" :botonAccion="BotonAccion"/>
      <globalBtn/> -->
      <tablegbl :columns="columns" :data="dataTable" 
      :showButtonEditar="true" 
      :showButtonEliminar="true" 
      :showButtonVisualize="true"
       @deleteUser="handleDeleteJSON"
       @editUser="handleEdit"
       @visualizeUser="handleVisualize"
       />
    </div>
  </template>

  
  <script setup lang="ts">
    import {tablegbl} from '../../importFile';
    import {globalBtn} from '../../importFile';
    import { Amplify } from 'aws-amplify';
    import * as  API  from 'aws-amplify/api';
    import * as amplifyconfig from '../../amplifyconfiguration.json';
    import { IdUsuario } from '../../types/index';
    import { computed, onMounted, ref } from 'vue';
    import { usedataStore } from '../../store/datoUsuario'; 
    import router from '../../router/router';


Amplify.configure(amplifyconfig);
const dataStore = usedataStore()

const idUsers = ref <IdUsuario[]>([])
// const idEdit = ref <IdUsuario>({id:''})

// const userEdit = ref<IdUsuario>({id:''})
  
// llamar la API   
  async function getUsers(){
    try{
      const getUserTable = await API.get({
        apiName: 'access_API',
        path: `/dev/users/findAll`,
        options: {
          body: { menssage: 'ingresado'}
        }
      });
      const {body} = await getUserTable.response; 
      const data = await body?.json();
      console.log('appi', data);

      if(data !== null && typeof data === 'object' && 'data'  in data && Array.isArray(data.data)){
        idUsers.value = data.data as unknown as IdUsuario[];
        dataStore.clearUserIds();

        idUsers.value.forEach((dataStoreJson) => {
          dataStore.userJson(
            dataStoreJson.id as (string),
            dataStoreJson.user as (string),
            dataStoreJson.email as (string),
            dataStoreJson.role as (string),
            )
            
          });
      }else{
          idUsers.value = []
        }
    } catch (error) {  
        console.log('sin obtener datos', error); 
        console.log('sin obtener datos')

    }finally{
      
    }
};
onMounted(getUsers);

const columns = [
  { label: 'Id', key: 'id' },
  {label: 'Usuario', key:'user'},
  { label: 'Correo', key: 'email' },
  { label: 'Rol', key: 'role' },
];

// const dataTable = computed(() => dataStore.dataUsers);
const dataTable = computed(() => dataStore.dataUsers);

// editar usuario 

// const usuarios = ref(dataStore.dataUsers);
// const usuarioEditado = ref();

const handleEdit = (Idusers : string) => {
  const user = idUsers.value.find(user => user.id === Idusers)
  // const userBody = [{
  //   user: user?.user,
  //   email: user?.email,
  //   role:user?.role
  // }]
  if (Idusers) {
    router.push({
      name: 'editar',
      params: {
      //  id: user?.id, 
        id: user?.id,// Pasa el ID del usuario como parámetro 'user'
        // userData:[JSON.stringify(userBody[0])]
      }
    })
    // console.log('handleEdit', user)
    // router.push({
    //   name: '/Edit', // Nombre de la ruta definida en tu archivo de rutas
    //   params: { user: Idusers, 
    //             userData:{
    //               user: user; 
    //               email: email; 
    //               role: role
    //             } 
    //           } // Pasa el ID y los datos del usuario como props
    // });
  } else {
    console.error('Usuario no encontrado');
  }
  
}
// const handleEdit = (Idusers : string | number) => {
//   console.log('Editar', Idusers);
//   // Agregar lógica para editar el elemento
//   router.push(`/Edit`)
// };


const handleVisualize = () => {
  console.log('Otra acción');
  // Agregar lógica para otra acción personalizada
};

// const handleDeleteUser = (Idusers : string | number) => {
//   // Lógica para eliminar el usuario usando el ID
//   console.log(`Eliminando usuario con ID ${Idusers}`);
// };

async function handleDeleteJSON(Idusers : string | number) {
  try {
        const restOperation = await API.del({
          apiName: "access_API",
          path: `/dev/users/delete/${Idusers}`,
        });
        await restOperation.response

       idUsers.value = idUsers.value.filter((row) => row.id !== Idusers)
       dataStore.clearUserIds ();

       idUsers.value.forEach((getUser)=>{
         dataStore.user(
           getUser.id as string,
           getUser.user as string,
           getUser.email as string,
           getUser.role as string,
           )
           
          })
          console.log('user deleted successfully:', Idusers);
        } catch (error) {
          console.log('delete call failed: ', error);
        }
      };

      </script>
  