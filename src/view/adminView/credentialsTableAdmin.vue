<template>
   <v-alert v-show="mostrarMensajeAgr" type="success" dismissible class="fade-out-message">
      {{ mensajeAgr }}
   </v-alert>
   <v-alert v-show="mostrarMensajeAgrError">{{ mensajeAgrError }}</v-alert>



   <v-alert v-show="mostrarMensajeCreadCred" type="success" dismissible class="fade-out-message">
      {{ mensajeCreadCred }}
   </v-alert>
   <v-alert v-show="mostrarMensajeCredUserIAM" type="success" dismissible class="fade-out-message">
      {{ mensajeCredUserIAM }}
   </v-alert>


   <h1>Usuarios IAM</h1>
   <global-btn btn_global="Agregar credencial" buttonClass="agrBtnCred" dark @click="dialog1 = true" />
   <global-btn btn_global="Crear credencial" buttonClass="regBtnCred" dark @click="dialog2 = true" />
   <global-btn btn_global="Crear usuario IAM" buttonClass="regBtnCred" dark @click="dialog3 = true" />

   <div>
      <tablegbl :columns="columns" :data="dataTable" :showButtonEditar="false" :showButtonEliminar="false"
         :showButtonVisualize="true" :showButtonEliminarIAM="true" @deleteIAM="handleDeleteIAM"
         @visualizeCredUser="handleVisualizeIAM" />
   </div>

   <!-- Ventana modal para agregar nueva credencial-->
   <form @submit.prevent="AgrnewCredUserIAM">
      <v-dialog v-model="dialog1" max-width="600px">
         <v-card>
            <v-card-title>Agregar Nueva Credencial</v-card-title>
            <v-card-text>
               <div>
                  <select v-model="selectedUserName" id="user" @change="filterAgrCredUser">
                     <option value="">Seleccione un usuario...</option>
                     <option v-for="datos in userListRegIAM" :key="datos.UserName" :value="datos.UserName">{{
      datos.UserName
   }}
                     </option>
                  </select>
               </div>

               <!-- Contenido del formulario para agregar la credencial -->
               <input-global title="" name="Id de usuario " :value="registCredential.UserId"
                  @update:value="newValue => updateAgrCred('UserId', newValue)" />

               <input-global title="" name=" Llave de accesos IAM" :value="registCredential.accessKeyId"
                  @update:value="newValue => updateAgrCred('accessKeyId', newValue)" />

               <input-global title="" name="Llave secreta" :value="registCredential.secretAccess"
                  @update:value="newValue => updateAgrCred('secretAccess', newValue)" />

               <input-global title="" name="Fecha de expiracion" :value="registCredential.dateExpiration"
                  @update:value="newValue => updateAgrCred('dateExpiration', newValue)" />


            </v-card-text>
            <v-card-actions>
               <div @click="">
                  <v-btn color="primary" @click="AgrCredential">Guardar</v-btn>
               </div>
               <v-btn @click="dialog1 = false">Cancelar</v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </form>


   <!-- ventana modal para crear credenciales  -->
   <form @submit.prevent="AddnewCredUserIAM">
      <!-- <form > -->
      <v-dialog v-model="dialog2" max-width="600px">
         <v-card>
            <v-card-title>Crear Credencial de usuario IAM</v-card-title>
            <v-card-text>
               <div>
                  <select v-model="selectedUserName" id="user" @change="fillCreatCred">
                     <option value="">Seleccione un usuario...</option>
                     <option v-for="(dato, index) in userListWhitoutCred" :key="index" :value="dato.UserName">{{
      dato.UserName
   }}
                     </option>
                  </select>
               </div>
            </v-card-text>
            <v-card-actions>
               <div @click="mostrarMensajeTempralCreadCred">
                  <v-btn color="primary" @click="CreateCredential">Guardar</v-btn>
               </div>
               <v-btn @click="dialog2 = false">Cancelar</v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </form>


   <!-- ventana modal para crear un usuario IAM  -->
   <form @submit.prevent="AddnewUser">
      <v-dialog v-model="dialog3" max-width="600px">
         <v-card>
            <v-card-title>Crear Usuario IAM</v-card-title>
            <v-card-text>
               <div>
                  <input-global title="" type="text" id="userName" v-model="usuarioIAM.userName"
                     @update:value="newValue => updateIAM('userName', newValue)" name="nombre de usuario" />
               </div>

            </v-card-text>
            <v-card-actions>
               <div @click="mostrarMensajeTempralCredUserIAM">
                  <v-btn color="primary" @click="createUserIAM">Guardar</v-btn>
               </div>
               <v-btn @click="dialog3 = false">Cancelar</v-btn>
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
import { userWithOutCredential } from '../../types'
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
         // mandar in id de el usuario que inicio sesion 
         // path: '/dev/iam/getUserCredential/1',
         path: '/dev/iam/findAll',
         options: {
            body: {
               message: 'ingresado',
            }
         }
      });
      const { body } = await getUser.response;
      const data = await body?.json();
      console.log('getIAM', data);

      if (data !== null && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
         usersIAM.value = data.data as unknown as IduserIAM[];

         dataStore.clearUserIds();
         usersIAM.value.forEach((IAM) => {
            dataStore.userIAM(
               IAM.UserId as string,
               IAM.UserName as string,
               IAM.accessKeyId as string,
               IAM.CreateDate as string,
               IAM.Status as string,
               IAM.secretAcces as string,
               IAM.dateExpiration as string,
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
   { label: 'Fecha de expiracion', key: 'dateExpiration' },
];

const dataTable = computed(() => dataStore.dataUsersIAM.slice(1));



// eliminar usuarios IAM que aparecen en las credenciales
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
            delUser.secretAcces as string,
            delUser.dateExpiration as string,
         )

      })
      console.log('user deleted successfully:', UserName);
   } catch (error) {
      console.log('delete call failed: ', error);
   }
};


// visualizar las credenciales de un usuario IAM 
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



// mensaje de accion credencial agregado
const mensajeAgr = ref('');
const mostrarMensajeAgr = ref<boolean>(false);
const mostrarMensajeTempralAgr = () => {
   mostrarMensajeAgr.value = true;
   setTimeout(() => {
      mostrarMensajeAgr.value = true;
   }, 6000); // Ocultar el mensaje después de 3 segundos (3000 milisegundos)
}

// mensaje de error a la credencial agregado

const mensajeAgrError = ref('');
const mostrarMensajeAgrError = ref<boolean>(false);
const mostrarMensajeTempralAgrError = () => {
   mostrarMensajeAgrError.value = true;
   setTimeout(() => {
      mostrarMensajeAgrError.value = true;
   }, 6000); // Ocultar el mensaje después de 3 segundos (3000 milisegundos)
}


// ventana modal para Agregar nuevas credenciales
const dialog1 = ref(false);

const selectedUserName = ref<string>('');
const userListRegIAM = ref<CredentRegistIAM[]>([]);
const registCredential = ref<CredentRegistIAM>({
   UserName: '',
   accessKeyId: '',
   secretAccess: '',
   dateExpiration: ''
})


// obtencial de datos de las credenciales a agregar 
async function fetchUsersData() {
   try {
      const getUserIAM = await API.get({
         apiName: 'access_API',
         path: `/dev/iam/findAllWithCredential`,
         options: {
            body: "message"
         }
      });
      const { body } = await getUserIAM.response;
      const data = await body?.json();
      console.log('getUserIAM', data);
      if (data !== null && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {

         userListRegIAM.value = data.data as unknown as CredentRegistIAM[];

         userListRegIAM.value.forEach((IAMcredential) => {
            dataStore.registCredentialIAM(
               IAMcredential.UserId as string,
               IAMcredential.UserName as string,
               IAMcredential.accessKeyId as string,
               IAMcredential.secretAccess as string,
               IAMcredential.dateExpiration as string,
            )
         });
      } else {
         userListRegIAM.value = []
      }
   } catch (error) {
      console.error('Error fetching users:', error);
   }
};

// filtro de id de las credenciales creadas
const filterAgrCredUser = () => {
   const selectedUser = userListRegIAM.value.find(user => user.UserName === selectedUserName.value);
   if (selectedUser) {
      registCredential.value.UserName = selectedUser.UserName;
      registCredential.value.UserId = selectedUser.UserId;
      registCredential.value.accessKeyId = selectedUser.accessKeyId;
      registCredential.value.secretAccess = selectedUser.secretAccess;
      registCredential.value.dateExpiration = selectedUser.dateExpiration;
   }
};

// Lógica para agregar la credencial
const agregarCredencial = () => {
   console.log('Credencial agregada', agregarCredencial);
   dialog1.value = false; // Cierra la ventana modal
};


// metod put para enviar los datos y agregar la credencial a la tabla 
const registerCredIAMuser = async () => {
   try {
      const response = await API.put({
         apiName: 'access_API',
         // AGREGAR ID DE USUARIO QUE INICIO SESION 
         path: `/dev/iam/addListIam/${registCredential.value.UserName}/1`,
      });

      const body = await response.response
      const data = body.body.json()

      if (data) {
         console.log('Credencial agregada');
         dialog1.value = false; // Cierra la ventana modal
         console.log('agregate call succeeded');
         mostrarMensajeTempralAgr()
         mensajeAgr.value = 'Credencial agregado exitosamente'
      }
   } catch (error) {
      console.log('agregate call failed: ', error);
      mostrarMensajeTempralAgrError()
      mensajeAgrError.value = 'Error: La credencial no fue agregada con exito'

   } finally {

   }
}

const updateAgrCred = (fielName: string, value: string) => {
   registCredential.value = { ...registCredential.value, [fielName]: value }
   console.log('datos agregados', registCredential.value)
}

onMounted(() => {
   // registerCredIAMuser()
   fetchUsersData();
});

function AgrnewCredUserIAM() {
   dataStore.saveRegCredentialIAM(
      registCredential.value.UserName as string,
   )
   ClearUser()
}
function ClearUser() {
   registCredential.value.UserName = '';
   registCredential.value.accessKeyId = '';
   registCredential.value.secretAccess = '';
   registCredential.value.dateExpiration = '';
   registCredential.value.UserId = '';

}
const AgrCredential = async (fielName: string, value: string) => {
   updateAgrCred(fielName, value)
   await registerCredIAMuser()
   router.push('/credentials')
}










// mensaje de accion creacion de credenciales
const mensajeCreadCred = ref('');
const mostrarMensajeCreadCred = ref<boolean>(false);
const mostrarMensajeTempralCreadCred = () => {
   mostrarMensajeCreadCred.value = true;
   setTimeout(() => {
      mostrarMensajeCreadCred.value = true;
   }, 6000); // Ocultar el mensaje después de 3 segundos (3000 milisegundos)
}

// ventana modal para crear credenciales de usuarios IAM
const userListWhitoutCred = ref<userWithOutCredential[]>([]);
const dialog2 = ref(false);
const creatIAM = ref<userWithOutCredential>({
   UserName: '',

})

// obtencion del enlistado para creacion de credenciales a usuarios IAM 
async function getUsersIAM() {
   try {
      const getUser = await API.get({
         apiName: 'access_API',
         path: '/dev/iam/findAllWithoutCredential',
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

         userListWhitoutCred.value = data.data as unknown as userWithOutCredential[];
         // dataStore.clearUserIds();
         console.log('usuario sin crdencial', userListWhitoutCred.value)

         userListWhitoutCred.value.forEach((IAMcredential) => {
            dataStore.CreadwhitOutCredentialIAM(
               IAMcredential.UserId as string,
               IAMcredential.UserName as string,
            )

         });
      } else {
         userListRegIAM.value = []
      }

   } catch (error) {
      console.log('sin obtener datos', error);
      console.log('sin obtener datos')

   } finally {
   }
};


const fillCreatCred = () => {
   const selectedUser = userListWhitoutCred.value.find(user => user.UserName === selectedUserName.value);
   if (selectedUser) {
      creatIAM.value.UserName = selectedUser.UserName;
   }
};

// creacion de credenciales 
const creatUserIAM = async () => {
   try {
      await API.put({
         apiName: 'access_API',
         path: `/dev/iam/createdCred/${creatIAM.value.UserName}`,

      });
      console.log('Credencial creada');
      dialog2.value = false; // Cierra la ventana modal
      console.log('create call succeeded');
      mensajeCreadCred.value = 'Credencial creada con exito'
   } catch (error) {
      console.log('create call failed: ', error);

   } finally {

   }
}
const listenUserIAM = (fielName: string, value: string) => {
   creatIAM.value = { ...creatIAM.value, [fielName]: value }
   console.log('creacion de credencial', creatIAM.value)
}
onMounted(() => {
   getUsersIAM();
   // creatUserIAM()
})

const CreateCredential = async (fielName: string, value: string) => {
   listenUserIAM(fielName, value)
   await creatUserIAM()
   router.push('/credentials')
}

function AddnewCredUserIAM() {
   dataStore.saveDataIAM(
      creatIAM.value.UserName as string
   )
}





// mensaje de accion para crear usuarios IAM
const mensajeCredUserIAM = ref('');
const mostrarMensajeCredUserIAM = ref<boolean>(false);
const mostrarMensajeTempralCredUserIAM = () => {
   mostrarMensajeCredUserIAM.value = true;
   setTimeout(() => {
      mostrarMensajeCredUserIAM.value = true;
   }, 6000); // Ocultar el mensaje después de 3 segundos (3000 milisegundos)
}

// ventana modal para crear usuarios IAM
const dialog3 = ref(false);

interface UsuarioAgrIAM {
   userName: String
};
const usuarioIAM = ref<UsuarioAgrIAM>({
   userName: ''
})

const createUserIAM = async () => {
   try {
      await API.post({
         apiName: 'access_API',
         path: '/dev/iam/create',
         options: {
            body: usuarioIAM.value.userName as string
         }
      });
      mensajeCredUserIAM.value = 'Usuario IAM creado con exito'
   } catch (error) {
      console.log('create call failed: ', error);

   } finally {

   }
};
const updateIAM = (fielName: string, value: string) => {
   usuarioIAM.value.userName = { ...usuarioIAM.value.userName, [fielName]: value }
   console.log('datos agregados', usuarioIAM.value.userName)
}

// enviar los datos del formulario a mi store 
function AddnewUser() {
   dataStore.saveDataIAMs({
      inputEvent: {
         userName: usuarioIAM.value.userName,
      }
   })
   console.log('usuario agregado', AddnewUser)
};
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