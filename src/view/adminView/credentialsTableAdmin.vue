<template>
   <h1>Usuarios IAM</h1>
   <global-btn btn_global="Agregar credencial" buttonClass="agrBtnCred" dark @click="dialog1 = true" />

   <global-btn btn_global="Crear credencial" buttonClass="regBtnCred" dark @click="dialog2 = true" />
   <div>
      <tablegbl :columns="columns" :data="dataTable" :showButtonEditar="false" :showButtonEliminar="false"
         :showButtonVisualize="true" :showButtonEliminarIAM="true" @deleteIAM="handleDeleteIAM(UserName)"
         @visualizeCredUser="handleVisualizeIAM" />
   </div>


   <!-- Ventana modal para agregar nueva credencial-->
   <form @submit.prevent="fetchUsersData">
      <v-dialog v-model="dialog1" max-width="600px">
         <v-card>
            <v-card-title>Agregar Nueva Credencial</v-card-title>
            <v-card-text>
               <div>
                  <select v-model="selectedUserName" id="user" @change="fillUserData">
                     <option value="">Seleccione un usuario...</option>
                     <option v-for="datos in userListIAM" :key="datos.UserName" :value="datos.UserName">{{
                        datos.UserName
                     }}
                     </option>
                  </select>
               </div>


               <!-- Contenido del formulario para agregar la credencial -->
               <input-global title="" name="Id de usuario " :value="registCredential.UserId"
                  @update:value="newValue => updateI('UserId', newValue)" />

               <input-global title="" name=" Llave de accesos IAM" :value="registCredential.accessKeyId"
                  @update:value="newValue => updateI('accessKeyId', newValue)" />

               <input-global title="" name="Llave secreta" :value="registCredential.secretKey"
                  @update:value="newValue => updateI('secretKey', newValue)" />

               <input-global title="" name="Fecha de expiracion" :value="registCredential.ExpirationDate"
                  @update:value="newValue => updateI('ExpirationDate', newValue)" />



               <!-- <input-global title="" type="" name="Fecha de expiracion" id="ExpirationDate"
                  v-model="registCredential.ExpirationDate" @input="updateI('ExpirationDate', $event.target.value)" /> -->

            </v-card-text>
            <v-card-actions>
               <v-btn color="primary" @click="AgrCredential">Guardar</v-btn>
               <v-btn @click="dialog1 = false">Cancelar</v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </form>

   <!-- ventana modal para crear credenciales  -->
   <form @submit.prevent="AddnewUserIAM">
      <v-dialog v-model="dialog2" max-width="600px">
         <v-card>
            <v-card-title>Crear Credencial</v-card-title>
            <v-card-text>
               <div>
                  <select v-model="selectedUserName" id="user" @change="fillCreatCred">
                     <option value="">Seleccione un usuario...</option>
                     <option v-for="datos in usersIAM" :key="datos.UserName" :value="datos.UserName">{{
                        datos.UserName
                     }}
                     </option>
                  </select>
               </div>
               <p>{{ CreadCredential.UserName }}</p>
               <input-global title="" name="Id de usuario" :value="registCredential.UserId"
                  @update:value="newValue => listenUserIAM('UserId', newValue)" />
               <input-global title="" name="Fecha de expiracion" type="date" :value="registCredential.ExpirationDate"
                  @update:value="newValue => listenUserIAM('ExpirationDate', newValue)" />
               <div>
                  <!-- <global-btn btn_global="Guardar" @click="creatUserIAM" /> -->
               </div>
            </v-card-text>
            <v-card-actions>
               <v-btn color="primary" @click="CreateCredential">Guardar</v-btn>
               <v-btn @click="dialog2 = false">Cancelar</v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </form>
</template>

<script setup lang="ts">
import { usedataStore } from '../../store/datoUsuario';
import { computed, ref, onMounted } from 'vue'
import { tablegbl } from '../../importFile';
import { globalBtn } from '../../importFile';
import { Amplify } from 'aws-amplify';
import * as  API from 'aws-amplify/api';
import amplifyConfig from '../../ampliconfig';
import { IduserIAM } from '../../types';
import { CredentRegistIAM } from '../../types';
import { CreatRegistIAM } from '../../types';
import { inputGlobal } from '../../importFile';
import router from '../../router/router';



Amplify.configure(amplifyConfig)
const dataStore = usedataStore()
const usersIAM = ref<IduserIAM[]>([])


// obtencion de usuariosIAM desde JSON
async function getIAM() {
   try {
      const getUser = await API.get({
         apiName: 'access_API',
         path: '/dev/iam/findAll',
         options: {
            body: {
               message: 'ingresado',
            }
         }
      });
      const { body } = await getUser.response;
      const data = await body?.json();
      console.log('APPI', data);

      if (data !== null && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
         usersIAM.value = data.data as unknown as IduserIAM[];

         dataStore.clearUserIdIAM();
         usersIAM.value.forEach((IAM) => {

            dataStore.userIAM(
               IAM.UserId as (string),
               IAM.UserName as (string),
               IAM.accessKeyId as (string),
               IAM.CreateDate as (string),
               IAM.Status as (string),
               IAM.ExpirationDate as (string),
            )

         });
      } else {
         usersIAM.value = []
      }
   } catch (error) {
      console.log('sin obtener datos', error);
      console.log('sin obtener datos')

   } finally {
   }
};
getIAM()


const columns = [
   { label: 'Usuario IAM', key: 'UserName' },
   { label: 'Id Usuario', key: 'UserId' },
   { label: 'Llave de acceso IAM', key: 'accessKeyId' },
   { label: 'Estado', key: 'Status' },
   { label: 'Fecha de expiracion', key: 'ExpirationDate' },
];

const dataTable = computed(() => dataStore.dataUsersIAM.slice(1));


async function handleDeleteIAM(UserName: string | number) {
   try {
      const restOperation = await API.del({
         apiName: "access_API",
         path: `/dev/iam/delete/${UserName}`,
      });
      console.log('restoperation', restOperation)
      await restOperation.response

      usersIAM.value = usersIAM.value.filter((row) => row.UserId !== UserName)
      console.log('iduser', usersIAM.value)


      // dataStore.clearUserIds();
      usersIAM.value.forEach((delUser) => {
         dataStore.userIAM(
            delUser.UserId as string,
            delUser.UserName as string,
            delUser.accessKeyId as string,
            delUser.CreateDate as string,
            delUser.Status as string,
            delUser.ExpirationDate as string,
         )

      })
      console.log('user deleted successfully:', UserName);
   } catch (error) {
      console.log('delete call failed: ', error);
   }
};

const handleVisualizeIAM = (UserName: string | number) => {
   const userIAM = usersIAM.value.find(userIAM => userIAM.UserName === UserName)
   console.log('usuarios seleccionado', userIAM)
   if (UserName) {
      router.push({
         name: 'visualizeCredIAM',
         params: {
            UserName: userIAM?.UserName
         }
      })

   } else {
      console.error('Usuario no encontrado');
   }
}


// ventana modal para registrar nuevas credenciales
const dialog1 = ref(false);

const selectedUserName = ref<string>('');
const userListIAM = ref<CredentRegistIAM[]>([]);
console.log('seleccion de usuarios', userListIAM)

const registCredential = ref<CredentRegistIAM>({
   UserId: '',
   accessKeyId: '',
   secretKey: '',
   ExpirationDate: ''
})
// crear credencial de usuarios IAM 
// const UserIAMCreateCred = ref<IduserIAM[]>([])
const CreadCredential = ref<IduserIAM>({
   UserId: '',
   UserName: '',
   ExpirationDate: ''
})
async function fetchUsersData() {
   try {
      const getUserName = await API.get({
         apiName: 'access_API',
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
   fetchUsersData();
});



const agregarCredencial = () => {
   // Lógica para agregar la credencial
   console.log('Credencial agregada', agregarCredencial);
   dialog1.value = false; // Cierra la ventana modal
};


// filtro de id de usuarios 
// ejemplo de filter es prueba
const fillUserData = () => {
   const selectedUser = userListIAM.value.find(user => user.UserName === selectedUserName.value);
   if (selectedUser) {
      registCredential.value.UserName = selectedUser.UserName;
      registCredential.value.UserId = selectedUser.UserId;
      registCredential.value.accessKeyId = selectedUser.accessKeyId;
      registCredential.value.secretKey = selectedUser.secretKey;
   }
};

const updateI = (fielName: string, value: string) => {
   registCredential.value = { ...registCredential.value, [fielName]: value }
   console.log('datos agregados', registCredential.value)
}

const AgrCredential = async (fielName: string, value: string) => {
   updateI(fielName, value)
   await fetchUsersData()
   router.push('/Users')
}

// async function fillUserData() {
//    // en user,userName se puede cambiar por el id solo hay que provarlo 
//    const user = userListIAM.value.find(user => user.UserName === selectedUserName.value);
//    console.log('usuario seleccionado', user)
//    if (user) {
//       // registCredential.value
//       registCredential.value.UserName = user.UserName;
//       registCredential.value.UserId = user.UserId;
//       registCredential.value.accessKeyId = user.accessKeyId;
//       registCredential.value.secretKey = user.secretKey;
//       registCredential.value.ExpirationDate = user.ExpirationDate;
//    } else {
//       // Limpiar datos del usuario si no se encontró el usuario seleccionado
//       registCredential.value = {
//          UserId: '',
//          UserName: '',
//          accessKeyId: '',
//          secretKey: ''
//       };
//    }
// }

// ventana modal para crear credenciales 
const dialog2 = ref(false);

const creatIAM = ref<CreatRegistIAM>({
   userName: '',
})

const creatUserIAM = async () => {
   try {
      await API.post({
         apiName: 'access_API',
         path: `/dev/iam/createdCred`,
         options: {
            body: creatIAM.value
         }
      });
      console.log('Credencial agregada');
      dialog2.value = false; // Cierra la ventana modal
      console.log('create call succeeded');
   } catch (error) {
      console.log('create call failed: ', error);

   } finally {

   }
}

// ejemplo de filter es prueba
const fillCreatCred = () => {
   const selectedUser = userListIAM.value.find(user => user.UserName === selectedUserName.value);
   if (selectedUser) {
      registCredential.value.UserName = selectedUser.UserName;
      registCredential.value.UserId = selectedUser.UserId;
      registCredential.value.accessKeyId = selectedUser.accessKeyId;
      registCredential.value.secretKey = selectedUser.secretKey;
   }
};
const listenUserIAM = (fielName: string, value: string) => {
   creatIAM.value = { ...creatIAM.value, [fielName]: value }
   console.log('creacion de credencial', creatIAM.value)
}

const CreateCredential = async (fielName: string, value: string) => {
   updateI(fielName, value)
   await creatUserIAM()
   router.push('/Users')
}

function AddnewUserIAM() {
   dataStore.saveDataIAM({
      userName: creatIAM.value.userName
   })
}

</script>

<style>
h1 {
   padding-left: 5%;
}

.agrBtnCred {
   background-color: #145474;
   font-size: 13px;
   color: white;
   border-radius: 10px;
   height: auto;
   width: auto;
   text-decoration: none;
   position: relative;
   margin-left: 5%;
   margin-top: 50px;
}

.regBtnCred {
   background-color: white;
   font-size: 13px;
   color: #145474;
   border-radius: 10px;
   border: 2px solid rgb(196, 194, 194);
   height: auto;
   width: auto;
   text-decoration: none;
   position: relative;
   margin-top: 50px;
}
</style>