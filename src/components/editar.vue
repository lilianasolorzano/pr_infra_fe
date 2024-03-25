<template>
        <h1>editar usuario normal</h1>
        <form @submit.prevent="">
        <div>
            <label for="">nombre: {{ props.id }}</label>
            <input type="text"  :v-model="props.id" placeholder="nombre de usuario" />
        </div>
        <!-- <div>
            <label for="">email</label>
            <input type="text"  :v-model="editedUser.email"/>
        </div>
        <div>
          <label for="">role</label>
          <input type="text" :v-model="editedUser.role"/>
        </div> -->
        <!-- <button @click="saveJSON">guardar cambios</button> -->
    </form>
</template>

<script setup lang="ts">
import {  defineProps } from 'vue';

// const props = defineProps<{
//   id: Number,
//   userData: { id: String, name: String, email: String, role: String}// Datos del usuario recibidos como props
// }>();
// const props = defineProps<{
//   id: Number,
//   userData: { user: string}// Datos del usuario recibidos como props
// }>();

const props = defineProps([
// user: string | number, 
'id'
//   userData: {
//     user:string,
//     email:string,
//     role:string
//   },
//   columns: Array as () => {label:string, key:string} [],
]);

// const id = props.user
// const editedUser = {...user}

console.log('edit users', props.id)
// console.log('edit', id)
// const userId = props.user;
// const userData = props.userData;
// const userName = userData.user;
// const userEmail = userData.email;
// const userRole = userData.role;
// import { usedataStore } from '../store/datoUsuario';
// import * as  API  from 'aws-amplify/api';
// import { Amplify } from 'aws-amplify';
// import * as amplifyconfig from '../amplifyconfiguration.json';
// import { IdUsuario } from '../types/index';
// import { ref } from 'vue';

// // Datos de usuarios
// const userEdit = ref<IdUsuario>({id:''});
// const dataStore = usedataStore();
// // Amplify.configure(amplifyconfig);
// const usuarios = ref(dataStore.dataUsers);

// //   // Usuario seleccionado para edición
// const UserEdit = ref <IdUsuario>({id: ''}) 
// // const iddelete = ref ([])
  
//   // Método para editar un usuario
// // const ElementEdit = (dataUsers) => {
// // usuarioEditado.value = { ...dataUsers };
// //   };

// //   const clickButton = (dataUsers) => {
// //     // usuarioEditado.value = { ...dataUsers };
// //     idEdit.value = {...dataUsers}
// //     console.log('edicion de usuario',idEdit.value.id)
// //   };
  
//   // Método para guardar cambios en el usuario editado
//   const saveCambios = () => {
//     // Encuentra y actualiza el usuario editado en la lista de usuarios
//     const index = usuarios.value.findIndex(u => u.id === usuarioEditado.value.id);
//   console.log(index)

//     if (index !== -1) {
//     //   usuarios.value[index] = { ...usuarioEditado.value };
//       usuarios.value[index] = { ...usuarioEditado.value};
//     }
//     // Reinicia el usuarioEditado después de guardar los cambios
//     usuarioEditado.value = ''
//   };


//   const saveJSON = async () => {
//     try {
//                     const restOperation = API.put({
//                       apiName: "access_API",
//                       path: `/dev/users/update/${idEdit.value.id}`,
//                       options: {
//                         body: {
//                             user: usuarioEditado.value
//                         }
//                       }
//                     });
//                     const response = await restOperation.response;
//                     console.log('PUT call succeeded: ', response);
//                     // if(response.statusCode === 200){
//                     //     const responseData = await response.body.json()
//                     //     console.log('datos actualizados', responseData)
//                     //     return responseData
//                     // }else{
//                     //     console.error('error al actualizar', response.statusCode)
//                     // }
//                     // console.log()
//                   } catch (error) {
//                     console.log('PUT call failed: ', error);
//                   }
// };

</script>

<style scoped>

</style>